import { DirectionProvider } from '@radix-ui/react-direction'
import reactAuthStore from '@renderer/lib/react-auth-store'
import AuthProvider from 'react-auth-kit'
import { RouterProvider } from 'react-router-dom'
import { router } from '../router/router'
import { ReactQueryClientProvider } from './ReactQueryClientProvider'

const Providers = () => {
  return (
    <ReactQueryClientProvider>
      <DirectionProvider dir="rtl">
        <AuthProvider store={reactAuthStore}>
          <RouterProvider router={router} />
        </AuthProvider>
      </DirectionProvider>
    </ReactQueryClientProvider>
  )
}

export default Providers
