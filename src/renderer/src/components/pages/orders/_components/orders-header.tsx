import { Button } from '@renderer/components/ui/button'
import CreateOrderButton from './CreateOrderButton'
import OrdersSearch from './orders-search'

interface OrdersHeaderProps {
  onFilterClick: () => void
}

const OrdersHeader = ({ onFilterClick }: OrdersHeaderProps) => {
  return (
    <div className="flex gap-3 flex-row h-[50px]">
      <OrdersSearch />
      <Button
        onClick={onFilterClick}
        className="w-[109px] text-sm
 h-full"
        variant="outline"
      >
        فلترة
      </Button>
      <CreateOrderButton />
    </div>
  )
}

export default OrdersHeader
