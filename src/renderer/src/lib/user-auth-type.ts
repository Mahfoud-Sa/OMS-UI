import { Roles } from '@renderer/types/api'
import { useAuthUser } from 'react-auth-kit'

export const getUserType = () => {
  const authUser = useAuthUser()
  const userType = authUser()?.userType as string
  const userRoles = authUser()?.roles as Roles[]

  return {
    isAdmin: userType === 'مشرف',
    isReseller: userType === 'بائع',
    isDistributor: userType === 'منسق طلبات',
    userType: userType || 'unknown',
    userRoles: userRoles || []
  }
}
