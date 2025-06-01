import { useState } from 'react'
import OrdersWrapper from '../_components/orders-wrapper'

const ReadyOrders = () => {
  const [openSheet, setOpenSheet] = useState(false)

  return (
    <section>
      <OrdersWrapper openSheet={openSheet} setOpenSheet={setOpenSheet} status={2} />
    </section>
  )
}

export default ReadyOrders
