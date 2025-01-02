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
import moment from 'moment'
import React from 'react'
import { Link } from 'react-router-dom'
import { ReceiptDatesReportProps } from './receipt-dates-report'

type Props = {
  data: {
    orders: ReceiptDatesReportProps[]
    pageNumber: number
    pageSize: number
    pages: number
    total: number
  }
}

const ReceiptDatesReportTable = ({ data }: Props) => {
  const columns = React.useMemo<ColumnDef<ReceiptDatesReportProps>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'الرقم',
        cell: ({ row }) => {
          return row.original.id
        }
      },
      {
        accessorKey: 'billNo',
        header: 'رقم الفاتورة'
      },
      {
        accessorKey: 'createAt',
        header: 'تاريخ الانشاء',
        cell: ({ row }) => {
          return <div>{new Date(row.original.createAt).toLocaleDateString()}</div>
        }
      },
      {
        accessorKey: 'deliveryAt',
        header: 'تاريخ التسليم',
        cell: ({ row }) => {
          return <div>{new Date(row.original.deliveryAt).toLocaleDateString()}</div>
        }
      },
      {
        accessorKey: 'sellingPrice',
        header: 'تكلفة البيع'
      },
      {
        accessorKey: 'costPrice',
        header: 'تكلفة البيع'
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
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ],
    []
  )
  const sortedOrders = data.orders.sort((a, b) => {
    return moment(a.createAt).diff(moment(b.createAt))
  })

  return (
    <div>
      <StructureTable columns={columns} data={sortedOrders} />
      {/* <TablePagination total={data.total} page={data.pageNumber} pageSize={data.pageSize} /> */}
    </div>
  )
}

export default ReceiptDatesReportTable
