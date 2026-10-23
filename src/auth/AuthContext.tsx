import { createContext, use, useCallback, useEffect, useState } from 'react'
import * as authService from '@/auth/authService'
import type { User } from '@/domain/user'

interface AuthContextValue {
  user: User | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthContextValue['status']>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    authService
      .restoreSession()
      .then((restored) => {
        setUser(restored)
        setStatus(restored ? 'authenticated' : 'unauthenticated')
      })
      .catch(() => setStatus('unauthenticated'))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setError(null)
    try {
      const loggedInUser = await authService.login(email, password)
      setUser(loggedInUser)
      setStatus('authenticated')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in'
      setError(message)
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  return <AuthContext value={{ user, status, error, login, logout }}>{children}</AuthContext>
}

export function useAuth() {
  const ctx = use(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
