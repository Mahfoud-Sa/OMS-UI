import { createHashRouter } from 'react-router-dom'
import RootLayout from '../layouts/layout'
import ProtectedRoute from '../layouts/protected-route'
import Home from '../pages/home/home'
import Login from '../pages/login/login'
import Orders from '../pages/orders/orders'
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
        element: <ProtectedRoute element={<Users />} />
      },
      {
        path: '/orders',
        element: <ProtectedRoute element={<Orders />} />
      }
    ]
  }
])
