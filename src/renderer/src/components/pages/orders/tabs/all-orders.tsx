import CreateBtn from '@renderer/components/layouts/create-btn'
import { Button } from '@renderer/components/ui/button'
import OrdersSearch from '../_components/orders-search'
import OrdersWrapper from '../_components/orders-wrapper'

const AllOrders = () => {
  return (
    <section>
      <div className="flex gap-3 flex-row h-[50px]">
        <OrdersSearch />
        <Button className="w-[109px] h-full" variant="outline">
          فلترة
        </Button>
        <CreateBtn title={'إضافة طلب'} href={'new'} className="w-[200px]" />
      </div>
      <OrdersWrapper status={null} />
    </section>
  )
}

export default AllOrders
