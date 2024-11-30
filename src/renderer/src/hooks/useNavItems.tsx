import { NavItem } from '@/types'
import { gotAnyRole, gotRole } from '@renderer/lib/utils'
import { useEffect, useState } from 'react'
import { useAuthUser } from 'react-auth-kit'

export default function useNavItems() {
  const authUser = useAuthUser()
  const userType = authUser()?.userType as string
  const [userRoles, setUserRoles] = useState<string[]>([])
  useEffect(() => {
    const roles = localStorage.getItem('_auth_state')
      ? JSON.parse(localStorage.getItem('_auth_state') || '{}').roles
      : []
    setUserRoles(roles)
  }, [userType])

  const navItems: NavItem[] = [
    {
      list: [
        {
          href: '/orders/',
          icon: 'bell',
          label: 'الطلبات',
          disabled: false
        },
        {
          href: '/factories/',
          icon: 'factory',
          label: 'المصانع',
          disabled: !gotRole('Get Factories') && userRoles.length > 0
        },
        {
          href: '/products/',
          icon: 'shoppingBag',
          label: 'المنتجات',
          disabled: !gotRole('Get Products') && userRoles.length > 0
        },
        {
          href: '/reports',
          icon: 'clipboardList',
          label: 'التقارير',
          disabled:
            !gotAnyRole([
              'Delivery Dates Reporter',
              'Orders Production Reporter',
              'Orders States Reporter',
              'Daily Reporter'
            ]) && userRoles.length > 0
        },
        {
          href: '',
          icon: 'idCard',
          label: 'ادارة المستخدمين',
          disabled: !gotAnyRole(['Get All Users', 'Recet Password']) && userRoles.length > 0,
          type: 'group',
          subLinks: [
            {
              label: 'المستخدمين',
              href: '/users',
              disabled: !gotRole('Get All Users') && userRoles.length > 0
            },
            {
              label: 'ضبط كلمة المرور',
              href: '/users/1/reset-password',
              disabled: !gotRole('Recet Password') && userRoles.length > 0
            }
          ]
        },
        {
          href: '/backup',
          icon: 'databaseBackup',
          label: 'النسخ الاحتياطي',
          disabled: true
        }
      ]
    }
  ]
  return navItems
}
