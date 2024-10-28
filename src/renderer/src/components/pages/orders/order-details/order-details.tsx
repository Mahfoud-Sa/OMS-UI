import BackBtn from '@renderer/components/layouts/back-btn'
import { Button } from '@renderer/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import { CoinsIcon, Printer } from 'lucide-react'
import ListItems from './tabs/list-items'
import MainInfo from './tabs/main-info'
import Timeline from './tabs/timeline'

const OrderDetails = () => {
  const tabs = [
    {
      content: <MainInfo />,
      value: 'main-info',
      label: 'المعلومات الأساسية'
    },
    {
      content: <ListItems />,
      value: 'itmes',
      label: 'حركة الطلب'
    },
    {
      content: <Timeline />,
      value: 'timeline',
      label: 'الخط الزمني'
    }
  ]
  return (
    <section className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <BackBtn href={'/orders'} />
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex text-primary gap-2 bg-transparent border-primary border-2 px-3"
          >
            عرض التكلفة
            <CoinsIcon />
          </Button>
          <Button className="flex gap-2">
            طباعة تقارير
            <Printer />
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-lg min-h-[500px] p-7 shadow-sm mt-6">
        <Tabs className="w-full" defaultValue={'main-info'}>
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

export default OrderDetails
