import { Navigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { ROUTES } from '@/routes'

export function RootRedirect() {
  const { user } = useAuth()
  const landsOnAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  return <Navigate to={landsOnAdmin ? ROUTES.adminDashboard : ROUTES.dashboard} replace />
}
