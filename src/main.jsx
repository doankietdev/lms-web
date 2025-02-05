import { Auth0Provider } from '@auth0/auth0-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.jsx'
import { appStore, persistor } from './app/store'
import { Toaster } from './components/ui/sonner'
import { API_ROOT, AUTH0_CLIENT_ID, AUTH0_DOMAIN } from './configs/env'
import './index.css'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin + '/auth/callback',
        audience: API_ROOT
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      useRefreshTokensFallback={true}
    >
      <Provider store={appStore}>
        <PersistGate loading='null' persistor={persistor}>
          <App />
          <Toaster />
        </PersistGate>
      </Provider>
    </Auth0Provider>
  </StrictMode>
)
