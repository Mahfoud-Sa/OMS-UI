import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import OrdersWrapper from './_components/orders-wrapper'
import Statistics from './_components/statistics'

const Orders = () => {
  const tabs = [
    {
      content: null,
      value: 'AllOrders',
      label: 'كل الطلبات'
    },
    {
      content: 1,
      value: 'ProgressOrders',
      label: 'طلبات قيد العمل'
    },
    {
      content: 2,
      value: 'ReadyOrders',
      label: 'الطلبات المكتملة'
    },
    {
      content: 5,
      value: 'OnDeliveryOrders',
      label: 'الطلبات قيد التوصيل'
    },
    {
      content: 3,
      value: 'DeliveredOrders',
      label: 'طلبات تم التسليم'
    },
    {
      content: 4,
      value: 'CanceledOrders',
      label: 'طلبات تم الغائها'
    }
  ]

  return (
    <section className="p-5">
      <Statistics />
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
              <section>
                <OrdersWrapper status={tab.content} />
              </section>{' '}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

export default Orders
