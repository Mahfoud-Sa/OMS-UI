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
import { ItemProductionReportProps } from './item-production-report'

type Props = {
  data: {
    orders: ItemProductionReportProps[]
    pageNumber: number
    pageSize: number
    pages: number
    total: number
  }
}

const ItemProductionReportTable = ({ data }: Props) => {
  const columns = React.useMemo<ColumnDef<ItemProductionReportProps>[]>(
    () => [
      {
        accessorKey: 'orderId',
        header: 'الرقم',
        cell: ({ row }) => {
          return row.original.orderId
        }
      },
      {
        accessorKey: 'factory',
        header: 'اسم المصنع'
      },
      {
        accessorKey: 'line',
        header: 'خط الإنتاج'
      },
      {
        accessorKey: 'createAt',
        header: 'التاريخ',
        cell: ({ row }) => {
          return <div>{moment(row.original.createAt).format('YYYY-MM-DD')}</div>
        }
      },
      {
        accessorKey: 'team',
        header: 'اسم الفرقة'
      },
      {
        accessorKey: 'billNo',
        header: 'رقم الطلب'
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

  return (
    <div>
      <StructureTable columns={columns} data={data.orders} />
      {/* <TablePagination total={data.total} page={data.pageNumber} pageSize={data.pageSize} /> */}
    </div>
  )
}

export default ItemProductionReportTable
