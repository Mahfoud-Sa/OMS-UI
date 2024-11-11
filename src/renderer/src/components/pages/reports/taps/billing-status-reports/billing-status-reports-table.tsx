import DeleteDialog from '@renderer/components/layouts/delete-dialog'
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
import { cn } from '@renderer/lib/utils'
import { Order } from '@renderer/types/api'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
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
}

const BillingStatusReportsTable = ({ data }: Props) => {
  const columns = React.useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: '',
        header: 'الرقم',
        cell: ({ row }) => (row.index + 1).toString().padStart(2, '0')
      },
      {
        accessorKey: 'customerName',
        header: 'اسم العميل'
      },
      {
        accessorKey: 'createAt',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              تاريخ الأنشاء
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          return <div>{new Date(row.original.createAt).toLocaleDateString()}</div>
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
            <Badge
              className={cn('', {
                'bg-blue-200 text-blue-600': row.original.orderState == 0,
                'bg-orange-200 text-orange-600': row.original.orderState == 1,
                'bg-green-200 text-green-600': row.original.orderState == 2,
                'bg-violet-200 text-violet-600': row.original.orderState == 3,
                'bg-red-200 text-red-600': row.original.orderState == 4
              })}
            >
              {row.original.orderState == 0 && 'جاري العمل'}
              {row.original.orderState == 1 && 'قيد التنفيذ'}
              {row.original.orderState == 2 && 'مكتمل'}
              {row.original.orderState == 3 && 'تم التسليم'}
              {row.original.orderState == 4 && 'ملغى'}
            </Badge>
          )
        }
      },
      {
        accessorKey: 'sellingPrice',
        header: 'السعر البيع'
      },

      {
        id: 'actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="h-17 -mt-[70px] ml-7 min-w-[84.51px] p-0">
              <Link to={`/orders/${row.original?.id}`}>
                <DropdownMenuItem className="cursor-pointer">تفاصيل</DropdownMenuItem>
              </Link>

              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DeleteDialog url={`/Orders/${row.original?.id}`} keys={['orders']} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ],
    []
  )

  return (
    <div>
      <StructureTable columns={columns} data={data.orders} />
      <TablePagination total={data.total} page={data.pageNumber} pageSize={data.pageSize} />
    </div>
  )
}

export default BillingStatusReportsTable
