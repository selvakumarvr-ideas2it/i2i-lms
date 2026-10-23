import type { ClientPrincipal, Role } from './clientPrincipal'

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

export function requireRole(principal: ClientPrincipal | null, allow: Role[]): ClientPrincipal {
  if (!principal) throw new HttpError(401, 'Sign-in required.')
  if (!allow.includes(principal.role)) throw new HttpError(403, `Requires role: ${allow.join(' or ')}.`)
  return principal
}

/** A trainee may only read/write their own data; an admin may act on anyone's. */
export function requireSelfOrAdmin(principal: ClientPrincipal | null, traineeId: string): ClientPrincipal {
  if (!principal) throw new HttpError(401, 'Sign-in required.')
  if (principal.role !== 'ADMIN' && principal.oid !== traineeId) {
    throw new HttpError(403, 'You can only access your own data.')
  }
  return principal
}
