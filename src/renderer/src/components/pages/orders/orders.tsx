import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import Statistics from './_components/statistics'
import AllOrders from './tabs/all-orders'
import CanceledOrders from './tabs/canceled-orders'
import DeliveredOrders from './tabs/delivered-orders'
import ProgressOrders from './tabs/progress-orders'
import ReadyOrders from './tabs/ready-orders'

const Orders = () => {
  const tabs = [
    {
      content: <AllOrders />,
      value: 'AllOrders',
      label: 'كل الطلبات'
    },
    {
      content: <ProgressOrders />,
      value: 'ProgressOrders',
      label: 'طلبات قيد العمل'
    },
    {
      content: <ReadyOrders />,
      value: 'ReadyOrders',
      label: 'الطلبات الجاهزة'
    },
    {
      content: <DeliveredOrders />,
      value: 'DeliveredOrders',
      label: 'طلبات تم التسليم'
    },
    {
      content: <CanceledOrders />,
      value: 'CanceledOrders',
      label: 'طلبات تم الغائها'
    }
  ]

  return (
    <section className="p-5">
      <Statistics
        filterData={function (): void {
          throw new Error('Function not implemented.')
        }}
        // totalOrders={ordersTotal}
        // totalOrdersInProgress={ordersTotalInProgress}
        // totalOrdersDelivered={ordersTotalDelivered}
      />
      <div className="bg-white rounded-lg min-h-[500px] p-7 shadow-sm mt-6">
        <Tabs className="w-full" defaultValue={'AllOrders'}>
          <TabsList className="bg-transparent mb-3">
            {tabs.map((tab, index) => (
              <TabsTrigger key={index} value={tab.value}>
                <div className="flex justify-center items-center gap-x-4">
                  <span className="text-lg font-bold">{tab.label}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent value={tab.value} key={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

export default Orders
