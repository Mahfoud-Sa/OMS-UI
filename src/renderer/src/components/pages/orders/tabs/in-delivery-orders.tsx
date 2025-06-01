import { useState } from 'react'
import OrdersWrapper from '../_components/orders-wrapper'

const InDeliveryOrders = () => {
  const [openSheet, setOpenSheet] = useState(false)
  return (
    <section>
      <OrdersWrapper openSheet={openSheet} setOpenSheet={setOpenSheet} status={6} />
    </section>
  )
}

export default InDeliveryOrders
