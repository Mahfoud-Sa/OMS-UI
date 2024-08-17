import CreateBtn from '@renderer/components/layouts/create-btn'
import OrdersSearch from './_components/orders-search'
import Statistics from './_components/statistics'

const Orders = () => {
  return (
    <section className="p-5">
      <Statistics
        selectedRole={undefined}
        filterData={function (role: string | undefined): void {
          throw new Error('Function not implemented.')
        }}
      />
      <div className="bg-white rounded-lg min-h-[500px] p-7 shadow-sm mt-6">
        <div className="flex gap-3 flex-row h-[50px]">
          <OrdersSearch />
          <CreateBtn title={'إضافة طلب'} href={'new'} className="w-[200px]" />
        </div>
      </div>
    </section>
  )
}

export default Orders
