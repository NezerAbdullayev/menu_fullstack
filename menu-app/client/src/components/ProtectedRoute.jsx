import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Loading } from './PageState'

/**
 * Giriş yoxdursa /admin/login-ə yönləndirir.
 * children verilərsə onları, yoxdursa <Outlet/> render edir.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, checking } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }
  if (checking) {
    return <Loading fullscreen />
  }
  return children ?? <Outlet />
}
