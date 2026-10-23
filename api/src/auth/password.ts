import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

/**
 * Default password every user (including the bootstrap admin) starts with — set by
 * the seed scripts and by `UserRepository.upsert` for any user that doesn't already
 * have a stored password. Trainees/admins are expected to change it after first login
 * (see POST /api/auth/change-password).
 */
export const DEFAULT_PASSWORD = 'biviz2026@i2i'

const KEY_LENGTH = 64

export interface PasswordHash {
  hash: string
  salt: string
}

export function hashPassword(password: string): PasswordHash {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex')
  return { hash, salt }
}

export function verifyPasswordHash(password: string, salt: string, hash: string): boolean {
  const candidate = scryptSync(password, salt, KEY_LENGTH)
  const stored = Buffer.from(hash, 'hex')
  if (candidate.length !== stored.length) return false
  return timingSafeEqual(candidate, stored)
}
