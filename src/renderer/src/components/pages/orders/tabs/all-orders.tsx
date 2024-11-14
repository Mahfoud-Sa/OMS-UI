import { Button } from '@renderer/components/ui/button'
import CreateOrderButton from '../_components/CreateOrderButton'
import OrdersSearch from '../_components/orders-search'
import OrdersWrapper from '../_components/orders-wrapper'

type Props = {
  getOrdersTotal: (total: number) => void
}
const AllOrders = ({ getOrdersTotal }: Props) => {
  return (
    <section>
      <div className="flex gap-3 flex-row h-[50px]">
        <OrdersSearch />
        <Button className="w-[109px] h-full" variant="outline">
          فلترة
        </Button>
        <CreateOrderButton />
      </div>
      <OrdersWrapper status={null} getOrdersTotal={getOrdersTotal} />
    </section>
  )
}

export default AllOrders
