import { Button } from '@renderer/components/ui/button'
import { useState } from 'react'
import CreateOrderButton from '../_components/CreateOrderButton'
import OrdersSearch from '../_components/orders-search'
import OrdersWrapper from '../_components/orders-wrapper'

const AllOrders = () => {
  const [openSheet, setOpenSheet] = useState(false)
  return (
    <section>
      <div className="flex gap-3 flex-row h-[50px]">
        <OrdersSearch />
        <Button onClick={() => setOpenSheet(true)} className="w-[109px] h-full" variant="outline">
          فلترة
        </Button>
        <CreateOrderButton />
      </div>
      <OrdersWrapper openSheet={openSheet} setOpenSheet={setOpenSheet} status={null} />
    </section>
  )
}

export default AllOrders
