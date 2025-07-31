import BackBtn from '@renderer/components/layouts/back-btn'
import { Badge } from '@renderer/components/ui/badge'
import { Button } from '@renderer/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import { getApi } from '@renderer/lib/http'
import { cn } from '@renderer/lib/utils'
import { Order } from '@renderer/types/api'
import { useQuery } from '@tanstack/react-query'
import { Printer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuthUser } from 'react-auth-kit'
import { Link, useParams } from 'react-router-dom'
import ListItems from './tabs/list-items'
import MainInfo from './tabs/main-info'
import Timeline from './tabs/timeline'

const OrderDetails = () => {
  const { id } = useParams()
  const authUser = useAuthUser()
  const userType = authUser()?.userType as string
  const [order, setOrder] = useState<Order>()
  const { data, isSuccess } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getApi<Order>(`/Orders/${id}`),
    refetchOnWindowFocus: true
  })

  useEffect(() => {
    if (data?.data) {
      setOrder(data.data)
    }
  }, [data, isSuccess])

  const tabs = [
    {
      content: <MainInfo />,
      value: 'main-info',
      label: 'المعلومات الأساسية'
    },
    {
      content: <ListItems />,
      value: 'itmes',
      label: 'حركة الطلب',
      disabled: true
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
        <div className="mb-3 flex justify-between gap-2 items-center">
          <BackBtn href="/orders" />
          <h1 className="text-2xl font-bold">
            تفاصيل الطلب رقم {data?.data.billNo?.toString().padStart(2, '0')}
          </h1>
          <Badge
            className={cn('', {
              'bg-indigo-100 text-indigo-900': order?.orderState == 0,
              'bg-amber-100 text-amber-900': order?.orderState == 1,
              'bg-emerald-100 text-emerald-900': order?.orderState == 2,
              'bg-green-100 text-green-900': order?.orderState == 3,
              'bg-red-100 text-red-900': order?.orderState == 4,
              'bg-blue-100 text-blue-900': order?.orderState === 5
            })}
          >
            {order?.orderState == 0 && 'جديد'}
            {order?.orderState == 1 && 'قيد العمل'}
            {order?.orderState == 2 && 'مكتمل'}
            {order?.orderState == 3 && 'تم التسليم'}
            {order?.orderState == 4 && 'ملغى'}
            {order?.orderState == 5 && 'قيد التوصيل'}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Link to={['مشرف'].includes(userType) ? `/orders/${id}/print` : ''}>
            <Button disabled={!['مشرف'].includes(userType)} className="flex gap-2">
              طباعة تقرير الطلب
              <Printer />
            </Button>
          </Link>
          <Link to={`/orders/${id}/items/print`}>
            <Button className="flex gap-2">
              طباعة تقرير منتجات الطلب
              <Printer />
            </Button>
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-lg min-h-[500px] p-7 shadow-sm mt-6">
        <Tabs className="w-full" defaultValue={'main-info'}>
          <TabsList className="bg-transparent mb-3">
            {tabs.map(
              (tab, index) =>
                !tab.disabled && (
                  <TabsTrigger key={index} value={tab.value}>
                    <div className="flex justify-center items-center gap-x-4">
                      <span className="text-lg font-bold">{tab.label}</span>
                    </div>
                  </TabsTrigger>
                )
            )}
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
