import { StructureTable } from '@renderer/components/tables/structure-table'
import TablePagination from '@renderer/components/tables/table-pagination'
import { Badge } from '@renderer/components/ui/badge'
import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { cn, gotRole } from '@renderer/lib/utils'
import { Order, Roles } from '@renderer/types/api'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, CheckIcon, MoreHorizontal, X } from 'lucide-react'
import React from 'react'
import { useAuthUser } from 'react-auth-kit'
import { Link } from 'react-router-dom'

type Props = {
  data: {
    orders: Order[]
    pageNumber: number
    pageSize: number
    pages: number
    total: number
  }
  isAsc: boolean
  setAsc: (value: boolean) => void
}

const isDeliveryDateLessThanFiveDays = (deliveryDate?: string) => {
  if (!deliveryDate) return false
  const deliveryDateObj = new Date(deliveryDate)
  const currentDate = new Date()
  const timeDifference = deliveryDateObj.getTime() - currentDate.getTime()
  const daysDifference = timeDifference / (1000 * 3600 * 24)
  return daysDifference < 5
}

const rowClassName = (order: Order) => {
  return isDeliveryDateLessThanFiveDays(order.readyAt) && ![3, 4].includes(order.orderState)
    ? 'bg-red-400'
    : ''
}
// const handleDeleteOrder = async (orderId: number) => {
//   // Call API to delete order
//   await deleteApi(`/Orders/${orderId}`)
// }

const OrdersTable = ({ data, isAsc, setAsc }: Props) => {
  const authUser = useAuthUser()
  const userType = authUser()?.userType as string

  const columns = React.useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'الرقم',
        cell: ({ row }) => row.original.id.toString().padStart(2, '0')
      },
      {
        accessorKey: 'customerName',
        header: 'اسم العميل'
      },
      {
        accessorKey: 'createAt',
        header: () => {
          return (
            <Button
              variant="ghost"
              onClick={() => {
                console.log('clicked')
                console.log(isAsc)
                setAsc(!isAsc)
              }}
            >
              تاريخ الأنشاء
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          return <div>{new Date(row.original.createAt).toISOString().split('T')[0]}</div>
        }
      },
      ...(userType !== 'بائع'
        ? [
            {
              accessorKey: 'workPlace',
              header: 'اسم الفرع',
              cell: ({ row }) => {
                return row.original.workPlace ? row.original.workPlace : row.original.fullName
              }
            }
          ]
        : []),
      {
        accessorKey: 'billNo',
        header: 'رقم الفاتورة'
      },
      {
        accessorKey: 'orderState',
        header: 'حالة الطلب',
        cell: ({ row }) => {
          return (
            <Badge
              className={cn('', {
                'bg-indigo-100 text-indigo-900': row.original.orderState == 0,
                'bg-amber-100 text-amber-900': row.original.orderState == 1,
                'bg-emerald-100 text-emerald-900': row.original.orderState == 2,
                'bg-green-100 text-green-900': row.original.orderState == 3,
                'bg-red-100 text-red-900': row.original.orderState == 4,
                'bg-blue-100 text-blue-900': row.original.orderState === 5
              })}
            >
              {row.original.orderState == 0 && 'جديد'}
              {row.original.orderState == 1 && 'قيد العمل'}
              {row.original.orderState == 2 && 'مكتمل'}
              {row.original.orderState == 3 && 'تم التسليم'}
              {row.original.orderState == 4 && 'ملغى'}
              {row.original.orderState == 5 && 'قيد التوصيل'}
            </Badge>
          )
        }
      },
      {
        accessorKey: 'id',
        header: 'حالة السداد',
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-center">
              {row.original.payed ? (
                <div
                  className="p-1 bg-green-100 text-green-900 rounded-2xl
"
                >
                  <CheckIcon className="h-6 w-6 " />
                </div>
              ) : (
                <div className="bg-red-100 text-red-900 rounded-2xl p-1">
                  <X />
                </div>
              )}
            </div>
          )
        }
      },
      ...(['مشرف', 'بائع'].includes(userType)
        ? [
            {
              accessorKey: 'sellingPrice',
              header: 'السعر البيع'
            }
          ]
        : []),

      {
        id: 'actions',
        cell: ({ row }) => (
          <DropdownMenu>
            {gotRole(Roles.GetOrder) && (
              <>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="h-17 -mt-[70px] ml-7 min-w-[84.51px] p-0"
                >
                  <Link to={`/orders/${row.original?.id}`}>
                    <DropdownMenuItem className="cursor-pointer">تفاصيل</DropdownMenuItem>
                  </Link>
                  {/* delete order button */}
                  {/* <DropdownMenuItem
                    className="cursor-pointe bg-red-500 text-white hover:bg-red-600"
                    onClick={() => handleDeleteOrder(row.original?.id)}
                  >
                    حذف
                  </DropdownMenuItem> */}
                </DropdownMenuContent>
              </>
            )}
          </DropdownMenu>
        )
      }
    ],
    [isAsc, setAsc]
  )

  return (
    <div>
      <StructureTable
        columns={columns.filter(Boolean)}
        data={data.orders || []}
        rowClassName={rowClassName}
      />
      <TablePagination total={data.total} page={data.pageNumber} pageSize={data.pageSize} />
    </div>
  )
}

export default OrdersTable
