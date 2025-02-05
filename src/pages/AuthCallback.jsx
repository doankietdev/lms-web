import LoadingSpinner from '@/components/LoadingSpinner'
import { useAuthCallbackMutation } from '@/features/api/authApi'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export const AuthCallback = () => {
  const { isAuthenticated, user, getAccessTokenSilently, isLoading } = useAuth0()
  const navigate = useNavigate()
  const [loginCallback] = useAuthCallbackMutation()

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (isLoading) return

      try {
        if (isAuthenticated && user) {
          const token = await getAccessTokenSilently()
          await loginCallback({ token, email: user?.email, name: user?.name, picture: user?.picture }).unwrap()
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error('Login failed')
      } finally {
        navigate('/')
      }
    }
    handleAuthCallback()
  }, [getAccessTokenSilently, isAuthenticated, isLoading, loginCallback, navigate, user])

  return (
    <LoadingSpinner message='Logging in, please wait...' />
  )
}
