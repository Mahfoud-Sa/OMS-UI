import { createHashRouter } from 'react-router-dom'
import RootLayout from '../layouts/layout'
import Factories from '../pages/factories/factories'
import FactoryDetails from '../pages/factories/factory-details/factory-details'
import NewFactory from '../pages/factories/new-factory/new-factory'
import Home from '../pages/home/home'
import Login from '../pages/login/login'
import NewOrder from '../pages/orders/new-order'
import OrderDetails from '../pages/orders/order-details/order-details'
import Orders from '../pages/orders/orders'
import InfoProduct from '../pages/products/info-product'
import NewProduct from '../pages/products/new-product'
import Products from '../pages/products/products'
import UserProfile from '../pages/profile/user-profile'
import Reports from '../pages/reports/reports'
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
        // element: <ProtectedRoute element={<Home />} />
        element: <Home />
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
        path: '/profile',
        element: <UserProfile />
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
        path: '/orders/:id',
        // element: <ProtectedRoute element={<Orders />} />
        element: <OrderDetails />
      },
      {
        path: '/factories',
        // element: <ProtectedRoute element={<Orders />} />
        element: <Factories />
      },
      {
        path: '/products',
        // element: <ProtectedRoute element={<Orders />} />
        element: <Products />
      },
      {
        path: '/products/new',
        // element: <ProtectedRoute element={<Orders />} />
        element: <NewProduct />
      },
      {
        path: '/products/:id',
        // element: <ProtectedRoute element={<Orders />} />
        element: <InfoProduct />
      },
      {
        path: '/factories/:factoryId',
        element: <FactoryDetails />
      },
      {
        path: '/factories/new',
        element: <NewFactory />
      },
      {
        path: '/reports',
        element: <Reports />
      }
    ]
  }
])
