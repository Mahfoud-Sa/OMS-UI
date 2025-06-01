import { Button } from '@renderer/components/ui/button'
import { Printer } from 'lucide-react'
import { useAuthUser } from 'react-auth-kit'
import CreateOrderButton from './CreateOrderButton'
import OrdersSearch from './orders-search'

interface OrdersHeaderProps {
  onFilterClick: () => void
  showPrintButton?: boolean
  onPrintClick?: () => void
}

const OrdersHeader = ({
  onFilterClick,
  showPrintButton = true,
  onPrintClick
}: OrdersHeaderProps) => {
  const authUser = useAuthUser()
  const userType = authUser()?.userType as string

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
      {showPrintButton && ['مشرف'].includes(userType) && (
        <Button
          onClick={onPrintClick}
          className="flex text-sm
 items-center gap-2 h-full"
        >
          <Printer size={16} />
          طباعة فواتير متعددة
        </Button>
      )}
      <CreateOrderButton />
    </div>
  )
}

export default OrdersHeader
