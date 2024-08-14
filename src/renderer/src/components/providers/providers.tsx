import { DirectionProvider } from '@radix-ui/react-direction'
import { AuthProvider } from 'react-auth-kit'
import { RouterProvider } from 'react-router-dom'
import { router } from '../router/router'
import { ReactQueryClientProvider } from './ReactQueryClientProvider'

const Providers = () => {
  return (
    <ReactQueryClientProvider>
      <AuthProvider
        authType={'cookie'}
        authName={'_auth'}
        cookieDomain={window.location.hostname}
        cookieSecure={window.location.protocol === 'https:'}
      >
        <DirectionProvider dir="rtl">
          <RouterProvider router={router} />
        </DirectionProvider>
      </AuthProvider>
    </ReactQueryClientProvider>
  )
}

export default Providers
