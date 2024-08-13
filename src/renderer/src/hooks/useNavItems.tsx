import { NavItem } from '@/types'

export default function useNavItems() {
  const navItems: NavItem[] = [
    {
      list: [
        {
          href: '/',
          icon: 'category',
          label: ' ddالصفحة الرئيسية'
        },
        {
          href: '/orders/',
          icon: 'bell',
          label: 'الطلبات',
          disabled: true
        },
        {
          href: '/factories/',
          icon: 'factory',
          label: 'المصانع',
          disabled: true
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
          disabled: true
        },
        {
          href: '/reports',
          icon: 'clipboardList',
          label: 'التقارير',
          disabled: true
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
              href: '/reset-password',
              disabled: true
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
