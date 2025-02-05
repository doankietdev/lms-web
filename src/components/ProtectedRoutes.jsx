import { useAuth0 } from '@auth0/auth0-react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0()

  if (!isLoading && !isAuthenticated) {
    return loginWithRedirect()
  }

  return children
}

export const AdminRoute = ({ children }) => {
  const { user } = useSelector((store) => store.user)

  if (user?.role !== 'instructor') {
    return <Navigate to="/" />
  }

  return children
}
