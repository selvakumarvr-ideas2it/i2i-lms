import { getTableClient, TABLE_NAMES } from '../tableClientFactory'
import { DEFAULT_PASSWORD, hashPassword, verifyPasswordHash } from '../../auth/password'
import type { UserRecord, UserRepository } from '../interfaces'
import type { Trainee } from '../../../../src/domain/user'

const PARTITION = 'USER'

interface UserEntity {
  partitionKey: string
  rowKey: string
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'TRAINEE' | 'MANAGER'
  avatarInitials: string
  joinedAt: string
  cohort?: string
  title?: string
  passwordHash: string
  passwordSalt: string
}

function toEntity(user: UserRecord, password: { hash: string; salt: string }): UserEntity {
  const entity: UserEntity = {
    partitionKey: PARTITION,
    rowKey: user.id,
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarInitials: user.avatarInitials,
    joinedAt: user.joinedAt,
    passwordHash: password.hash,
    passwordSalt: password.salt,
  }
  if (user.role === 'TRAINEE') entity.cohort = user.cohort
  if (user.role === 'ADMIN' || user.role === 'MANAGER') entity.title = user.title
  return entity
}

function fromEntity(entity: UserEntity): UserRecord {
  const base = {
    id: entity.id,
    name: entity.name,
    email: entity.email,
    avatarInitials: entity.avatarInitials,
    joinedAt: entity.joinedAt,
  }
  // Rows are frequently hand-typed via the Portal's "Add entity" UI or `az storage
  // entity insert`, neither of which validates against the ADMIN/TRAINEE/MANAGER enum
  // — so `role` casing (Admin, admin, TRAINEE, ...) can't be trusted to match exactly.
  const role = (entity.role ?? '').trim().toUpperCase()
  if (role === 'ADMIN') {
    return { ...base, role: 'ADMIN', title: entity.title ?? 'Administrator' }
  }
  if (role === 'MANAGER') {
    return { ...base, role: 'MANAGER', title: entity.title ?? 'Manager' }
  }
  return { ...base, role: 'TRAINEE', cohort: entity.cohort ?? 'PBI-Accelerator' }
}

export function createTableUserRepository(): UserRepository {
  return {
    async getByEmail(email) {
      const client = await getTableClient(TABLE_NAMES.users)
      const normalized = email.trim().toLowerCase()
      for await (const entity of client.listEntities<UserEntity>({
        queryOptions: { filter: `PartitionKey eq '${PARTITION}' and email eq '${normalized}'` },
      })) {
        return fromEntity(entity)
      }
      return null
    },

    async getById(id) {
      const client = await getTableClient(TABLE_NAMES.users)
      try {
        const entity = await client.getEntity<UserEntity>(PARTITION, id)
        return fromEntity(entity)
      } catch (err: unknown) {
        if ((err as { statusCode?: number }).statusCode === 404) return null
        throw err
      }
    },

    async list() {
      const client = await getTableClient(TABLE_NAMES.users)
      const results: UserRecord[] = []
      for await (const entity of client.listEntities<UserEntity>({ queryOptions: { filter: `PartitionKey eq '${PARTITION}'` } })) {
        results.push(fromEntity(entity))
      }
      return results
    },

    async listTrainees() {
      const client = await getTableClient(TABLE_NAMES.users)
      const results: Trainee[] = []
      // Filtering by role server-side would need an exact-case OData match, and Azure
      // Table Storage's filter language has no case-insensitive string functions — so
      // this scans the (small, cohort-sized) Users partition and normalizes client-side
      // via fromEntity instead, same as every other read path.
      for await (const entity of client.listEntities<UserEntity>({
        queryOptions: { filter: `PartitionKey eq '${PARTITION}'` },
      })) {
        const record = fromEntity(entity)
        if (record.role === 'TRAINEE') results.push(record)
      }
      return results
    },

    async upsert(user) {
      const client = await getTableClient(TABLE_NAMES.users)

      // id is the stable key everywhere else in the app (Progress, submissions, etc.),
      // so upserting by a changed email would orphan those rows — the id itself
      // (set once, e.g. to the lowercased email at creation time) is what's fixed.
      let password: { hash: string; salt: string } | undefined
      try {
        const existing = await client.getEntity<UserEntity>(PARTITION, user.id)
        password = { hash: existing.passwordHash, salt: existing.passwordSalt }
      } catch (err: unknown) {
        if ((err as { statusCode?: number }).statusCode !== 404) throw err
      }
      // No existing row (or an existing row from before passwords existed): bootstrap
      // with the default password so the user can log in and change it themselves.
      if (!password?.hash || !password.salt) password = hashPassword(DEFAULT_PASSWORD)

      await client.upsertEntity(toEntity({ ...user, email: user.email.trim().toLowerCase() }, password), 'Replace')
      return user
    },

    async verifyPassword(email, password) {
      const client = await getTableClient(TABLE_NAMES.users)
      const normalized = email.trim().toLowerCase()
      for await (const entity of client.listEntities<UserEntity>({
        queryOptions: { filter: `PartitionKey eq '${PARTITION}' and email eq '${normalized}'` },
      })) {
        if (!entity.passwordHash || !entity.passwordSalt) {
          // Row created without a password — e.g. `az storage entity insert` or the
          // Portal's "Add entity" UI, both of which bypass upsert()'s auto-default.
          // Accept the default password once and self-heal a real hash, so a manually
          // added row behaves exactly like a seeded one from here on.
          if (password !== DEFAULT_PASSWORD) return null
          const { hash, salt } = hashPassword(DEFAULT_PASSWORD)
          await client.updateEntity({ partitionKey: PARTITION, rowKey: entity.rowKey, passwordHash: hash, passwordSalt: salt }, 'Merge')
          return fromEntity(entity)
        }
        if (!verifyPasswordHash(password, entity.passwordSalt, entity.passwordHash)) return null
        return fromEntity(entity)
      }
      return null
    },

    async setPassword(id, newPassword) {
      const client = await getTableClient(TABLE_NAMES.users)
      const { hash, salt } = hashPassword(newPassword)
      await client.updateEntity({ partitionKey: PARTITION, rowKey: id, passwordHash: hash, passwordSalt: salt }, 'Merge')
    },
  }
}
