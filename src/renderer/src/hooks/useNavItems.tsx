import { NavItem } from '@/types'

export default function useNavItems() {
  const navItems: NavItem[] = [
    {
      list: [
        {
          href: '/',
          icon: 'category',
          label: 'fdffd الرئيسية'
        },
        {
          href: '',
          icon: 'taskSquare',
          label: 'إدارة القبول والتسجيل',
          type: 'group',
          subLinks: [
            { label: 'بنين', href: '/dashboard/admission-and-registration?gender=boys' },
            { label: 'بنات', href: '/dashboard/admission-and-registration?gender=girls' }
          ]
        },
        {
          href: '/dashboard/levels',
          icon: 'bookmark',
          label: 'إدارة المستويات والصفوف',
          disabled: true
        },
        {
          href: '/dashboard/attendance',
          icon: 'calendarTick',
          label: 'إدارة الحضور والغياب',
          disabled: true
        },
        {
          href: '/dashboard/invoices',
          icon: 'archive',
          label: 'إدارة الفواتير',
          disabled: true
        },
        {
          href: '/dashboard/users',
          icon: 'profileUser',
          label: 'إدارة المستخدمين',
          disabled: true
        }
      ]
    }
  ]
  return navItems
}
