import { getApi } from '@renderer/lib/http'
import { Order } from '@renderer/types/api'
import { useQuery } from '@tanstack/react-query'
import { Boxes, CheckCircle, HammerIcon, SaudiRiyal, Truck } from 'lucide-react'
import { useAuthUser } from 'react-auth-kit'
import StatisticCard from '../../../layouts/statistic-card'

export default function Statistics() {
  // fetch orders statistics using useQuery
  const authUser = useAuthUser()
  const userType = authUser()?.userType as string
  const { data: totalOrders } = useQuery({
    queryKey: ['orders', 'allOrders'],
    // 5 seconds cache
    gcTime: 5000,
    staleTime: 5000,
    queryFn: () =>
      getApi<{
        total: number
        orders: Order[]
        pageNumber: number
        pageSize: number
        pages: number
      }>(
        `/Orders${userType === 'بائع' ? '/User' : userType === 'منسق طلبات' ? '/OrderManager' : ''}`,
        {
          params: {
            size: 1
          }
        }
      )
  })
  const { data: deliveredOrdersTotal } = useQuery({
    queryKey: ['orders', 'deliveredOrders'],
    // 5 seconds cache
    gcTime: 5000,
    staleTime: 5000,
    queryFn: () =>
      getApi<{
        total: number
        orders: Order[]
        pageNumber: number
        pageSize: number
        pages: number
      }>(
        `/Orders${userType === 'بائع' ? '/User' : userType === 'منسق طلبات' ? '/OrderManager' : ''}`,
        {
          params: {
            size: 1,
            orderState: 3
          }
        }
      )
  })
  const { data: inProgressOrdersTotal } = useQuery({
    queryKey: ['orders', 'inProgressOrders'],
    // 5 seconds cache
    gcTime: 5000,
    staleTime: 5000,
    queryFn: () =>
      getApi<{
        total: number
        orders: Order[]
        pageNumber: number
        pageSize: number
        pages: number
      }>(
        `/Orders${userType === 'بائع' ? '/User' : userType === 'منسق طلبات' ? '/OrderManager' : ''}`,
        {
          params: {
            size: 1,
            orderState: 1
          }
        }
      )
  })
  const { data: readyOrdersTotal } = useQuery({
    queryKey: ['orders', 'readyOrders'],
    // 5 seconds cache
    gcTime: 5000,
    staleTime: 5000,
    queryFn: () =>
      getApi<{
        total: number
        orders: Order[]
        pageNumber: number
        pageSize: number
        pages: number
      }>(
        `/Orders${userType === 'بائع' ? '/User' : userType === 'منسق طلبات' ? '/OrderManager' : ''}`,
        {
          params: {
            size: 1,
            orderState: 2
          }
        }
      )
  })
  const { data: onDeliveryOrdersTotal } = useQuery({
    queryKey: ['orders', 'onDeliveryOrders'],
    // 5 seconds cache
    gcTime: 5000,
    staleTime: 5000,
    queryFn: () =>
      getApi<{
        total: number
        orders: Order[]
        pageNumber: number
        pageSize: number
        pages: number
      }>(
        `/Orders${userType === 'بائع' ? '/User' : userType === 'منسق طلبات' ? '/OrderManager' : ''}`,
        {
          params: {
            size: 1,
            orderState: 5
          }
        }
      )
  })

  const data = [
    {
      title: 'أجمالي الطلبات',
      icon: Boxes,
      value: totalOrders?.data.total || 0,
      iconClassName: 'text-[#041016]',
      iconBgWrapperColor: 'bg-indigo-100'
    },
    {
      title: 'أجمالي الطلبات قيد العمل',
      icon: HammerIcon,
      value: inProgressOrdersTotal?.data.total || 0,
      iconClassName: 'text-amber-900',
      iconBgWrapperColor: 'bg-amber-100',
      role: 'manager'
    },
    {
      title: 'أجمالي الطلبات المكتملة',
      icon: CheckCircle,
      value: readyOrdersTotal?.data.total || 0,
      iconClassName: 'text-emerald-900',
      iconBgWrapperColor: 'bg-emerald-100',
      role: 'manager'
    },
    {
      title: 'أجمالي الطلبات قيد التوصيل',
      icon: Truck,
      value: onDeliveryOrdersTotal?.data.total || 0,
      iconClassName: 'text-blue-900',
      iconBgWrapperColor: 'bg-blue-100',
      role: 'manager'
    },
    {
      title: 'اجمالي الطلبات تم تسليمها',
      icon: SaudiRiyal,
      value: deliveredOrdersTotal?.data.total || 0,
      iconClassName: 'text-green-900',
      iconBgWrapperColor: 'bg-green-100',
      role: 'retailer'
    }
  ]

  return (
    <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {data.map((item, i) => (
        <StatisticCard
          key={i}
          // ${selectedCard?.id == i && 'border-2 border-primary'}
          className={`w-full`}
          title={item.title}
          total={item.value.toString()}
          icon={item.icon}
          iconWrapperClassName={`${item.iconBgWrapperColor}`}
          iconClassName={item.iconClassName}
        />
      ))}
    </div>
  )
}
