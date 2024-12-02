import CreateBtn from '@renderer/components/layouts/create-btn'
import { gotRole } from '@renderer/lib/utils'
import { Roles } from '@renderer/types/api'

const CreateOrderButton = () => {
  const userRoles: string[] = localStorage.getItem('_auth_state')
    ? JSON.parse(localStorage.getItem('_auth_state') || '{}').roles
    : []
  return (
    <CreateBtn
      disable={!gotRole(Roles.AddOrder) && userRoles.length > 0}
      title={'إضافة طلب'}
      href={'new'}
      className="w-[200px]"
    />
  )
}
export default CreateOrderButton
