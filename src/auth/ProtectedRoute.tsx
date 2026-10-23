import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { ROUTES } from '@/routes'

export function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-muted">
        Loading your session…
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />
  }

  return <Outlet />
}
