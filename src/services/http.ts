import type { User } from '@/domain/user'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
const CURRENT_USER_KEY = 'pbi-accelerator:current-user'

/**
 * There is no real authentication in front of the API — identity is just whatever
 * `getCurrentUser()` last cached from `POST /api/auth/login`, sent back on every
 * request as plain headers (see api/src/auth/clientPrincipal.ts, which trusts them
 * outright). This is a deliberate simplification for an internal pilot; anyone who
 * can reach the API can set these headers to act as any user. Don't put anything
 * sensitive behind this without re-introducing real auth first.
 */
export function getCurrentUser(): User | null {
  try {
    const raw = window.localStorage.getItem(CURRENT_USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function setCurrentUser(user: User | null) {
  if (user) {
    window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    window.localStorage.removeItem(CURRENT_USER_KEY)
  }
}

function authHeaders(): HeadersInit {
  const user = getCurrentUser()
  if (!user) return {}
  return {
    'x-user-id': user.id,
    'x-user-email': user.email,
    'x-user-name': user.name,
    'x-user-role': user.role,
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...init.headers,
    },
  })

  if (response.status === 204) return undefined as T

  const text = await response.text()
  const body = text ? JSON.parse(text) : undefined

  if (!response.ok) {
    const message = (body && typeof body === 'object' && 'error' in body ? String(body.error) : undefined) ?? response.statusText
    throw new ApiError(response.status, message)
  }

  return body as T
}
