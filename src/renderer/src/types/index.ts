import { Icons } from '@renderer/components/icons/icons'

export type NavItem = {
  title?: string
  list: Array<{
    type?: 'link' | 'group'
    href: string
    disabled?: boolean
    external?: boolean
    icon?: keyof typeof Icons
    label: string
    description?: string
    subLinks?: { href: string; label: string; disabled?: boolean }[]
  }>
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[]
}

export interface FooterItem {
  title: string
  items: {
    title: string
    href: string
    external?: boolean
  }[]
}

export type MainNavItem = NavItemWithOptionalChildren

export type SidebarNavItem = NavItemWithChildren

export interface DeliveryUserCardProps {
  id: string
  fullName: string
  userName: string
  userType: string
  imagePath?: string
  phoneNumber: string
  workPlace: string
}

export type Role = {
  id: string
  name: string
}
