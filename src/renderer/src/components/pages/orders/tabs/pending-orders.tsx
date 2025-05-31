import { useState } from 'react'
import OrdersWrapper from '../_components/orders-wrapper'

const PendingOrders = () => {
  const [openSheet, setOpenSheet] = useState(false)

  return (
    <section>
      <OrdersWrapper openSheet={openSheet} setOpenSheet={setOpenSheet} status={0} />
    </section>
  )
}

export default PendingOrders
