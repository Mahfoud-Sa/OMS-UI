import { NavItem } from '@/types'

export default function useNavItems() {
  const navItems: NavItem[] = [
    {
      list: [
        {
          href: '/',
          icon: 'category',
          label: 'الصفحة الرئيسية'
        },
        {
          href: '/orders/',
          icon: 'bell',
          label: 'الطلبات',
          disabled: false
        },
        {
          href: '/factories/',
          icon: 'factory',
          label: 'المصانع'
        },
        {
          href: '/production_lines/',
          icon: 'package',
          label: 'خطوط الانتاج',
          disabled: true
        },
        {
          href: '/products/',
          icon: 'shoppingBag',
          label: 'العناصر',
          disabled: false
        },
        {
          href: '/reports',
          icon: 'clipboardList',
          label: 'التقارير',
          disabled: false
        },
        {
          href: '',
          icon: 'idCard',
          label: 'ادارة المستخدمين',
          type: 'group',
          subLinks: [
            {
              label: 'المستخدمين',
              href: '/users'
            },
            {
              label: 'الموطفين',
              href: '/employees',
              disabled: true
            },
            {
              label: 'ضبط كلمة المرور',
              href: '/users/1/reset-password'
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
