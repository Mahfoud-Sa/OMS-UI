import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = useIsAuthenticated()

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />
  }
  // If authenticated, render the passed component
  return element
}

export default ProtectedRoute
