import { StructureTable } from '@renderer/components/tables/structure-table'
import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { BillingStatusReportsProps } from './billing-status-reports'

type Props = {
  data: {
    orders: BillingStatusReportsProps[]
    pageNumber: number
    pageSize: number
    pages: number
    total: number
  }
}

const BillingStatusReportsTable = ({ data }: Props) => {
  const columns = React.useMemo<ColumnDef<BillingStatusReportsProps>[]>(
    () => [
      {
        accessorKey: 'orderId',
        header: 'الرقم',
        cell: ({ row }) => {
          return row.original.orderId
        }
      },
      {
        accessorKey: 'billNo',
        header: 'رقم الفاتورة'
      },

      {
        accessorKey: 'factory',
        header: 'اسم المصنع'
      },
      {
        accessorKey: 'createAt',
        header: 'تاريخ الانشاء',
        cell: ({ row }) => {
          return <div>{new Date(row.original.createAt).toLocaleDateString()}</div>
        }
      },
      {
        accessorKey: 'line',
        header: 'خط الانتاج'
      },
      {
        accessorKey: 'team',
        header: 'فريق الانتاج'
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
              <Link to={`/orders/${row.original?.orderId}`}>
                <DropdownMenuItem className="cursor-pointer">تفاصيل</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ],
    []
  )
  const sortedOrders = data.orders.sort((a, b) => {
    return new Date(a.createAt).getTime() - new Date(b.createAt).getTime()
  })

  return (
    <div>
      <StructureTable columns={columns} data={sortedOrders} />
      {/* <TablePagination total={data.total} page={data.pageNumber} pageSize={data.pageSize} /> */}
    </div>
  )
}

export default BillingStatusReportsTable
