import CreateBtn from '@renderer/components/layouts/create-btn'
import { gotRole } from '@renderer/lib/utils'
import { Roles } from '@renderer/types/api'

const CreateOrderButton = () => {
  return (
    <CreateBtn
      disable={!gotRole(Roles.AddOrder)}
      title={'إضافة طلب'}
      href={'new'}
      className="w-[200px]"
    />
  )
}
export default CreateOrderButton
