import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, rol } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (requiredRole && rol !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PrivateRoute
