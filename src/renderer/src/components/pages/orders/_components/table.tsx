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
import { getUserType } from '@renderer/lib/user-auth-type'
import { cn, gotRole } from '@renderer/lib/utils'
import { Order, Roles } from '@renderer/types/api'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, DollarSignIcon, MoreHorizontal } from 'lucide-react'
import React from 'react'
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
const displayIsPaidIcon = (order: Order) => {
  return (
    order.isPaid &&
    [6, 4, 2].includes(order.orderState) && (
      <DollarSignIcon size={'16'} className="bg-green-200 rounded-sm text-green-600" />
    )
  )
}

const OrdersTable = ({ data, isAsc, setAsc }: Props) => {
  const { isDistributor, userType } = getUserType()

  const columns = React.useMemo<ColumnDef<Order>[]>(() => {
    // Create base columns
    const baseColumns: ColumnDef<Order>[] = [
      {
        accessorKey: 'id',
        header: 'الرقم',
        cell: ({ row }) => row.original.id.toString().padStart(2, '0')
      },
      {
        accessorKey: 'customerName',
        header: 'اسم العميل'
      }
    ]

    // Conditionally add storeName column
    if (isDistributor) {
      baseColumns.push({
        accessorKey: 'storeName',
        header: 'اسم المتجر'
      })
    }

    // Add remaining columns
    baseColumns.push(
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
      {
        accessorKey: 'billNo',
        header: 'رقم الفاتورة'
      },
      {
        accessorKey: 'orderState',
        header: 'حالة الطلب',
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-1">
              <Badge
                className={cn('', {
                  'bg-blue-200 text-blue-600': row.original.orderState == 0,
                  'bg-orange-200 text-orange-600': row.original.orderState == 1,
                  'bg-green-200 text-green-600': row.original.orderState == 2,
                  'bg-violet-200 text-violet-600': row.original.orderState == 3,
                  'bg-red-200 text-red-600': row.original.orderState == 4
                })}
              >
                {row.original.orderState == 0 && 'جديد'}
                {row.original.orderState == 1 && 'قيد العمل'}
                {row.original.orderState == 2 && 'مكتمل'}
                {row.original.orderState == 3 && 'تم التسليم'}
                {row.original.orderState == 4 && 'ملغى'}
              </Badge>
              {displayIsPaidIcon(row.original) && (
                <DollarSignIcon size={'16'} className="bg-green-200 rounded-sm text-green-600">
                  مدفوع
                </DollarSignIcon>
              )}
            </div>
          )
        }
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      ['مشرف', 'بائع'].includes(userType) && {
        accessorKey: 'sellingPrice',
        header: 'السعر البيع'
      },

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
                </DropdownMenuContent>
              </>
            )}
          </DropdownMenu>
        )
      }
    )

    return baseColumns
  }, [isAsc, setAsc, isDistributor, userType])

  return (
    <div>
      <StructureTable
        columns={columns.filter(Boolean)}
        data={data.orders}
        rowClassName={rowClassName}
        tableHeight="400px"
      />
      <TablePagination total={data.total} page={data.pageNumber} pageSize={data.pageSize} />
    </div>
  )
}

export default OrdersTable
