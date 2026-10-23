import { logActivity } from '@/services/activityService'
import { apiFetch, getCurrentUser, setCurrentUser } from '@/services/http'
import type { User } from '@/domain/user'

/**
 * Auth is behind this single module — see src/services/http.ts for the (deliberately
 * unvalidated) header-based identity model this talks to. Swapping in a real provider
 * later means rewriting these functions; nothing else in the app would change.
 */
export async function login(email: string, password: string): Promise<User> {
  const user = await apiFetch<User>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setCurrentUser(user)
  if (user.role === 'TRAINEE') {
    await logActivity(user.id, 'LOGIN').catch(() => undefined)
  }
  return user
}

export async function logout(): Promise<void> {
  setCurrentUser(null)
}

export async function restoreSession(): Promise<User | null> {
  const cached = getCurrentUser()
  if (!cached) return null

  try {
    // Re-fetches from the Users table so a role change (or removal) made directly in
    // the table takes effect on the next load without an explicit sign-out.
    const fresh = await apiFetch<User>('/api/me')
    setCurrentUser(fresh)
    return fresh
  } catch {
    setCurrentUser(null)
    return null
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiFetch<void>('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}
