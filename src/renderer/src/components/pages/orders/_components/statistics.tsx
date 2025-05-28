import { getApi } from '@renderer/lib/http'
import { Order } from '@renderer/types/api'
import { useQuery } from '@tanstack/react-query'
import { Box, Boxes } from 'lucide-react'
import { useAuthUser } from 'react-auth-kit'
import StatisticCard from '../../../layouts/statistic-card'
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useState } from "react";

type StatisticsProps = {
  filterData: (role: string | undefined) => void
  // totalOrders: number
  // totalOrdersInProgress: number
  // totalOrdersDelivered: number
}

export default function Statistics({
  filterData
  // totalOrders,
  // totalOrdersDelivered,
  // totalOrdersInProgress
}: StatisticsProps) {
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

  const data = [
    {
      title: 'أجمالي الطلبات',
      icon: Boxes,
      value: totalOrders?.data.total || 0,
      iconClassName: 'text-[#041016]',
      iconBgWrapperColor: 'bg-blue-100'
    },
    {
      title: 'أجمالي الطلبات قيد العمل',
      icon: Box,
      value: inProgressOrdersTotal?.data.total || 0,
      iconClassName: 'text-orange-900',
      iconBgWrapperColor: 'bg-orange-100',
      role: 'manager'
    },
    {
      title: 'أجمالي الطلبات الجاهزه',
      icon: Box,
      value: readyOrdersTotal?.data.total || 0,
      iconClassName: 'text-green-900',
      iconBgWrapperColor: 'bg-green-100',
      role: 'manager'
    },
    {
      title: 'اجمالي الطلبات تم تسليمها',
      icon: Box,
      value: deliveredOrdersTotal?.data.total || 0,
      iconClassName: 'text-red-900',
      iconBgWrapperColor: 'bg-red-100',
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
          handleClick={() => {
            if (i == 0) filterData(undefined)
            filterData(item?.role)
            // setSelectedCard({ id: i == 0 ? null : i, title: item.title })
          }}
        />
      ))}
    </div>
  )
}
