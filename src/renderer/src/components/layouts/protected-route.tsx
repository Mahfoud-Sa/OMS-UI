import { Navigate } from 'react-router-dom'

import { getUserType } from '@renderer/lib/user-auth-type'
import { useIsAuthenticated } from 'react-auth-kit'

import { Roles } from '@renderer/types/api'
import React, { ReactElement } from 'react'

interface ProtectedRouteProps {
  element: ReactElement
  requiredRoles?: Roles[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requiredRoles }) => {
  const isAuthenticated = useIsAuthenticated()
  const { userRoles } = getUserType()

  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />
  }
  if (
    requiredRoles &&
    requiredRoles.length > 0 &&
    !userRoles.some((role) => requiredRoles.includes(role))
  ) {
    // Redirect to unauthorized page if user does not have required roles
    return <Navigate to="/orders" replace />
  }
  // If authenticated, render the passed component
  return element
}

export default ProtectedRoute
