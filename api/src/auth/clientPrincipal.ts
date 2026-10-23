import type { HttpRequest } from '@azure/functions'

export type Role = 'ADMIN' | 'TRAINEE' | 'MANAGER'

export interface ClientPrincipal {
  oid: string
  email: string
  name: string
  role: Role
}

/**
 * Identity is trusted directly off request headers — there is no Entra ID / Easy Auth
 * / JWT validation anymore. The frontend sets these four headers from whatever
 * `POST /api/auth/login` returned (see src/services/http.ts), and they're just
 * echoed back here as-is.
 *
 * This is a deliberate simplification for an internal pilot with synthetic training
 * data: anyone who can reach the API can set these headers to any value (e.g. via
 * browser devtools) and act as any user id/role. There is no cryptographic proof of
 * identity on a per-request basis. If this app starts holding anything sensitive, or
 * gets exposed outside a trusted network, re-introduce real auth (Entra ID/Easy Auth,
 * or at minimum a signed session token) before that happens — this function is the
 * only place that would need to change.
 */
export function getClientPrincipal(request: HttpRequest): ClientPrincipal | null {
  const oid = request.headers.get('x-user-id')
  const email = request.headers.get('x-user-email')
  const name = request.headers.get('x-user-name')
  const role = request.headers.get('x-user-role')

  if (!oid || !email || (role !== 'ADMIN' && role !== 'TRAINEE' && role !== 'MANAGER')) return null

  return { oid, email, name: name ?? email, role }
}
