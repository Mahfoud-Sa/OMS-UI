import { useAuthUser } from 'react-auth-kit'

export const getUserType = () => {
  const authUser = useAuthUser()
  const userType = authUser()?.userType as string

  return {
    isAdmin: userType === 'مشرف',
    isReseller: userType === 'بائع',
    isDistributor: userType === 'منسق طلبات',
    userType: userType || 'unknown'
  }
}
