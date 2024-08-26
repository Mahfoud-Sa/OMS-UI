import { createHashRouter } from 'react-router-dom'
import RootLayout from '../layouts/layout'
import ProtectedRoute from '../layouts/protected-route'
import Factories from '../pages/factories/factories'
import FactoryDetails from '../pages/factories/factory-details/factory-details'
import Home from '../pages/home/home'
import Login from '../pages/login/login'
import NewOrder from '../pages/orders/new-order'
import Orders from '../pages/orders/orders'
import ResetPassword from '../pages/reset-password/reset-password'
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
      }
    ]
  }
])
