import { useState } from 'react'
import OrdersWrapper from '../_components/orders-wrapper'

const ProgressOrders = () => {
  const [openSheet, setOpenSheet] = useState(false)

  return (
    <section>
      <OrdersWrapper openSheet={openSheet} setOpenSheet={setOpenSheet} status={1} />
    </section>
  )
}
export default ProgressOrders
