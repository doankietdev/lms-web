import LoadingSpinner from '@/components/LoadingSpinner'
import { useAuthCallbackMutation } from '@/features/api/authApi'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export const AuthCallback = () => {
  const { isAuthenticated, user, getAccessTokenSilently, isLoading, error } = useAuth0()
  const navigate = useNavigate()
  const [loginCallback] = useAuthCallbackMutation()
  const location = useLocation()

  useEffect(() => {
    const handleAuthCallback = async () => {
      window.history.replaceState({}, document.title, location.pathname)
      
      if (isLoading) return


      if (error) {
        toast.error('Login failed')
        navigate('/')
        return
      }

      try {
        if (isAuthenticated && user) {
          const token = await getAccessTokenSilently()
          await loginCallback({
            token,
            email: user?.email,
            name: user?.name,
            picture: user?.picture
          }).unwrap()
          const returnToAfterLogin = sessionStorage.getItem('returnToAfterLogin')
          sessionStorage.removeItem('returnToAfterLogin')
          navigate(returnToAfterLogin || '/')
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error('Login failed')
        navigate('/')
      }
    }
    handleAuthCallback()
  }, [error, getAccessTokenSilently, isAuthenticated, isLoading, location.pathname, loginCallback, navigate, user])

  return <LoadingSpinner message="Logging in, please wait..." />
}
