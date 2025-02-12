import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeProvider } from './components/ThemeProvider'
import { Toaster } from './components/ui/sonner'
import { injectGetAccessTokenSilently, injectLoginWithRedirect, injectNavigate } from './lib/utils'
import { Routes } from './routes'

import 'video-react/dist/video-react.css'
import './App.css'
import { ErrorBoundary } from './components/ErrorBoundary'
import { setError } from './features/errorSlice'
import { ERROR_TYPES } from './utils/constants'

function App() {
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0()
  const navigate = useNavigate()

  injectLoginWithRedirect(loginWithRedirect)
  injectGetAccessTokenSilently(getAccessTokenSilently)
  injectNavigate(navigate)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getAccessTokenSilently()
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setError(ERROR_TYPES.SERVER_ERROR)
      }
    }
    checkAuth()
  }, [getAccessTokenSilently])

  return (
    <ThemeProvider>
      <main>
        <ErrorBoundary>
          <Routes />
        </ErrorBoundary>
      </main>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
