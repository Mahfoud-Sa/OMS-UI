import { useState } from 'react'
import OrdersWrapper from '../_components/orders-wrapper'

const DeliveredOrders = () => {
  const [openSheet, setOpenSheet] = useState(false)
  return (
    <section>
      <OrdersWrapper openSheet={openSheet} setOpenSheet={setOpenSheet} status={3} />
    </section>
  )
}

export default DeliveredOrders
