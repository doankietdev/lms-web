import { useAuth0 } from '@auth0/auth0-react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'

// eslint-disable-next-line react/prop-types
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loginWithRedirect, isLoading,  } = useAuth0()
  const { user } = useSelector((store) => store.user)
  const location = useLocation()

  if (!isLoading && !isAuthenticated) {
    sessionStorage.setItem('returnToAfterLogin', location.pathname)
    loginWithRedirect()
    return <LoadingSpinner message="Redirecting to login page" />
  }

  if (allowedRoles.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/403" replace />
  }

  return children
}
