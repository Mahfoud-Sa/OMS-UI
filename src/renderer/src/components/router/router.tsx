import { createHashRouter } from 'react-router-dom'
import RootLayout from '../layouts/layout'
import ProtectedRoute from '../layouts/protected-route'
import Factories from '../pages/factories/factories'
import FactoryDetails from '../pages/factories/factory-details/factory-details'
import NewFactory from '../pages/factories/new-factory/new-factory'
import Home from '../pages/home/home'
import Login from '../pages/login/login'
import NewOrder from '../pages/orders/new-order'
import Orders from '../pages/orders/orders'
import ResetPassword from '../pages/reset-password/reset-password'
import InfoUser from '../pages/users/info-user'
import NewUser from '../pages/users/new-user'
import Users from '../pages/users/users'

export const router = createHashRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <ProtectedRoute element={<Home />} />
        // element: <Home />
      },
      {
        path: '/users',
        // element: <ProtectedRoute element={<Users />} />
        element: <Users />
      },
      {
        path: '/users/new',
        // element: <ProtectedRoute element={<Users />} />
        element: <NewUser />
      },
      {
        path: '/users/:id',
        // element: <ProtectedRoute element={<Users />} />
        element: <InfoUser />
      },
      // reset password page
      {
        path: '/users/:id/reset-password',
        element: <ResetPassword />
      },
      {
        path: '/orders',
        // element: <ProtectedRoute element={<Orders />} />
        element: <Orders />
      },
      {
        path: '/orders/new',
        // element: <ProtectedRoute element={<Orders />} />
        element: <NewOrder />
      },
      {
        path: '/factories',
        // element: <ProtectedRoute element={<Orders />} />
        element: <Factories />
      },
      {
        path: '/factories/:factoryId',
        element: <ProtectedRoute element={<FactoryDetails />} />
      },
      {
        path: '/factories/new',
        element: <ProtectedRoute element={<NewFactory />} />
      }
    ]
  }
])
