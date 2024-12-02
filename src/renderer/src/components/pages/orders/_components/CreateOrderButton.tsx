import CreateBtn from '@renderer/components/layouts/create-btn'

const CreateOrderButton = () => {
  return <CreateBtn disable={true} title={'إضافة طلب'} href={'new'} className="w-[200px]" />
}
export default CreateOrderButton
