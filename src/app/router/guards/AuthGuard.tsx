import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '@app/providers/AuthProvider'
import { ROUTES } from '@shared/constants/routes'

export function AuthGuard() {
  const { isAuthenticated, isLoading } = useAuthContext()

  if (isLoading) return null

  return isAuthenticated
    ? <Outlet />
    : <Navigate to={ROUTES.auth.login} replace />
}
