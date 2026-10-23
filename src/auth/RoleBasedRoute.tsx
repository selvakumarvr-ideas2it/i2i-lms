import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { ROUTES } from '@/routes'
import type { Role } from '@/domain/user'

interface RoleBasedRouteProps {
  allow: Role[]
  redirectTo?: string
}

export function RoleBasedRoute({ allow, redirectTo }: RoleBasedRouteProps) {
  const { user } = useAuth()
  if (!user) return <Navigate to={ROUTES.login} replace />

  if (!allow.includes(user.role)) {
    const landsOnAdmin = user.role === 'ADMIN' || user.role === 'MANAGER'
    const fallback = redirectTo ?? (landsOnAdmin ? ROUTES.adminDashboard : ROUTES.dashboard)
    return <Navigate to={fallback} replace />
  }

  return <Outlet />
}
