import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '../layouts/layout'
import ProtectedRoute from '../layouts/protected-route'
import Home from '../pages/home/home'
import Login from '../pages/login/login'
import Orders from '../pages/orders/orders'

export const router = createBrowserRouter([
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
        element: <div>users</div>
      },
      {
        path: '/orders',
        element: <ProtectedRoute element={<Orders />} />
      }
    ]
  }
])
