import IssueDetails from '@renderer/pages/issues/[id]'
import Issues from '@renderer/pages/issues/issues'
import { createHashRouter } from 'react-router-dom'
import RootLayout from '../layouts/layout'
import LoginRootLayout from '../layouts/login-layout'
import ProtectedRoute from '../layouts/protected-route'
import Factories from '../pages/factories/factories'
import FactoryDetails from '../pages/factories/factory-details/factory-details'
import NewFactory from '../pages/factories/new-factory/new-factory'
import Home from '../pages/home/home'
import Login from '../pages/login/login'
import NewOrder from '../pages/orders/new-order'
import PrintItemBill from '../pages/orders/order-details/_components/PrintItemsBill'
import PrintOrderBill from '../pages/orders/order-details/_components/PrintOrderBill'
import OrderDetails from '../pages/orders/order-details/order-details'
import OrderIssues from '../pages/orders/order-issues/order-issues'
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
    element: <LoginRootLayout />,
    children: [
      {
        path: '/login',
        element: <Login />
      }
    ]
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
        element: <ProtectedRoute element={<Users />} />
      },
      {
        path: '/users/new',
        element: <ProtectedRoute element={<NewUser />} />
        // element: <NewUser />
      },
      {
        path: '/users/:id',
        // element: <ProtectedRoute element={<Users />} />
        element: <ProtectedRoute element={<InfoUser />} />
      },
      // reset password page
      {
        path: '/users/:id/reset-password',
        element: <ProtectedRoute element={<ResetPassword />} />
      },
      {
        path: '/profile',
        element: <ProtectedRoute element={<UserProfile />} />
      },
      {
        path: '/orders',
        element: <ProtectedRoute element={<Orders />} />
        // element: <Orders />
      },
      {
        path: '/orders/new',
        element: <ProtectedRoute element={<NewOrder />} />
        // element: <NewOrder />
      },
      {
        path: '/orders/:id',
        element: <ProtectedRoute element={<OrderDetails />} />
        // element: <OrderDetails />
      },
      {
        path: '/orders/:id/print',
        element: <ProtectedRoute element={<PrintOrderBill />} />
        // element: <PrintOrderBill />
      },
      {
        path: '/orders/:id/items/print',
        element: <ProtectedRoute element={<PrintItemBill />} />
        // element: <PrintItemBill />
      },
      {
        path: '/orders/issues/:id',
        element: <ProtectedRoute element={<OrderIssues />} />
        // element: <PrintItemBill />
      },
      {
        path: '/issues',
        element: <ProtectedRoute element={<Issues />} />
      },
      {
        path: '/issues/:id',
        element: <ProtectedRoute element={<IssueDetails />} />
      },
      {
        path: '/factories',
        element: <ProtectedRoute element={<Factories />} />
        // element: <Factories />
      },
      {
        path: '/products',
        element: <ProtectedRoute element={<Products />} />
        // element: <Products />
      },
      {
        path: '/products/new',
        element: <ProtectedRoute element={<NewProduct />} />
        // element: <NewProduct />
      },
      {
        path: '/products/:id',
        element: <ProtectedRoute element={<InfoProduct />} />
        // element: <InfoProduct />
      },
      {
        path: '/factories/:factoryId',
        element: <ProtectedRoute element={<FactoryDetails />} />

        // element: <FactoryDetails />
      },
      {
        path: '/factories/new',
        element: <ProtectedRoute element={<NewFactory />} />

        // element: <NewFactory />
      },
      {
        path: '/reports',
        element: <ProtectedRoute element={<Reports />} />

        // element: <Reports />
      }
    ]
  }
])
