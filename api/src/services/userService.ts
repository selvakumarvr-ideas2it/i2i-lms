import { DEFAULT_PASSWORD } from '../auth/password'
import { HttpError } from '../auth/requireRole'
import type { Repositories, UserRecord } from '../repositories/interfaces'
import type { Admin } from '../../../src/domain/user'

/**
 * Always resolves as ADMIN even if the Users table has no row (or was accidentally
 * deleted) for this address — a bootstrap safety net so there's always at least one
 * way into the admin console. Once a real row exists for this email, its stored role
 * (and stored password) is what's used — this fallback only fires when the table has
 * NO row at all for the address, and only with the default password.
 */
const DEFAULT_ADMIN_EMAIL = 'powerbi.admin@ideas2it.com'

function defaultAdmin(): Admin {
  return {
    id: DEFAULT_ADMIN_EMAIL,
    name: 'Power BI Admin',
    email: DEFAULT_ADMIN_EMAIL,
    role: 'ADMIN',
    avatarInitials: 'PA',
    joinedAt: new Date(0).toISOString(),
    title: 'Program Administrator',
  }
}

export function createUserService(repos: Repositories) {
  async function getByEmail(email: string): Promise<UserRecord | null> {
    const normalized = email.trim().toLowerCase()
    const found = await repos.users.getByEmail(normalized)
    if (found) return found
    if (normalized === DEFAULT_ADMIN_EMAIL) return defaultAdmin()
    return null
  }

  return {
    getByEmail,
    getById: (id: string) => repos.users.getById(id),
    list: () => repos.users.list(),
    listTrainees: () => repos.users.listTrainees(),
    upsert: (user: UserRecord) => repos.users.upsert(user),

    async verifyPassword(email: string, password: string): Promise<UserRecord | null> {
      const normalized = email.trim().toLowerCase()
      const verified = await repos.users.verifyPassword(normalized, password)
      if (verified) return verified

      // Bootstrap admin has no table row yet — only the default password works until
      // someone materializes a real row for it (which changePassword below does).
      if (normalized === DEFAULT_ADMIN_EMAIL && password === DEFAULT_PASSWORD) {
        const existing = await repos.users.getByEmail(normalized)
        if (!existing) return defaultAdmin()
      }
      return null
    },

    async changePassword(id: string, email: string, currentPassword: string, newPassword: string): Promise<void> {
      const normalized = email.trim().toLowerCase()
      const verified = await repos.users.verifyPassword(normalized, currentPassword)
      if (verified) {
        await repos.users.setPassword(id, newPassword)
        return
      }

      if (normalized === DEFAULT_ADMIN_EMAIL && currentPassword === DEFAULT_PASSWORD) {
        const existing = await repos.users.getByEmail(normalized)
        if (!existing) {
          // First password change for the bootstrap admin: materialize its row (with
          // the default password) so the new password has something to attach to,
          // then immediately overwrite it with what they actually chose.
          const admin = defaultAdmin()
          await repos.users.upsert(admin)
          await repos.users.setPassword(admin.id, newPassword)
          return
        }
      }

      throw new HttpError(401, 'Current password is incorrect.')
    },
  }
}

export type UserService = ReturnType<typeof createUserService>
