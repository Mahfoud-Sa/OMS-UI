import { useState } from 'react'
import OrdersWrapper from '../_components/orders-wrapper'

const CanceledOrders = () => {
  const [openSheet, setOpenSheet] = useState(false)
  return (
    <section>
      <OrdersWrapper openSheet={openSheet} setOpenSheet={setOpenSheet} status={4} />
    </section>
  )
}

export default CanceledOrders
