import CreateBtn from '@renderer/components/layouts/create-btn'
import { useAuthUser } from 'react-auth-kit'

const CreateOrderButton = () => {
  const authUser = useAuthUser()
  const userType = authUser()?.userType as string
  return (
    <CreateBtn
      disable={!['مشرف', 'منسق طلبات', 'بائع'].includes(userType)}
      title={'إضافة طلب'}
      href={'new'}
      className="w-[200px]"
    />
  )
}
export default CreateOrderButton
