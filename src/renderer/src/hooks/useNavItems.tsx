import { NavItem } from '@/types'
import { useAuthUser } from 'react-auth-kit'

export default function useNavItems() {
  const authUser = useAuthUser()
  const userType = authUser()?.userType as string

  const navItems: NavItem[] = [
    {
      list: [
        {
          href: '/orders/',
          icon: 'bell',
          label: 'الطلبات',
          disabled: !['مشرف', 'منسق طلبات', 'بائع'].includes(userType)
        },
        {
          href: '/factories/',
          icon: 'factory',
          label: 'المصانع',
          disabled: !['مشرف'].includes(userType)
        },
        {
          href: '/products/',
          icon: 'shoppingBag',
          label: 'المنتجات',
          disabled: !['مشرف'].includes(userType)
        },
        {
          href: '/reports',
          icon: 'clipboardList',
          label: 'التقارير'
          // TODO: enable this link when the page is ready;
          // disabled: true
        },
        {
          href: '',
          icon: 'idCard',
          label: 'ادارة المستخدمين',
          disabled: !['مشرف'].includes(userType),
          type: 'group',
          subLinks: [
            {
              label: 'المستخدمين',
              href: '/users',
              disabled: !['مشرف'].includes(userType)
            },
            {
              label: 'ضبط كلمة المرور',
              href: '/users/1/reset-password',
              disabled: !['مشرف'].includes(userType)
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
