import { useState } from 'react'
import OrdersWrapper from '../_components/orders-wrapper'

const AllOrders = () => {
  const [openSheet, setOpenSheet] = useState(false)
  return (
    <section>
      <OrdersWrapper openSheet={openSheet} setOpenSheet={setOpenSheet} status={null} />
    </section>
  )
}

export default AllOrders
