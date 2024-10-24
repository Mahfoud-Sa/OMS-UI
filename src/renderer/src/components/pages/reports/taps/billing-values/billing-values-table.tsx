import DeleteDialog from '@renderer/components/layouts/delete-dialog'
import { StructureTable } from '@renderer/components/tables/structure-table'
import TablePagination from '@renderer/components/tables/table-pagination'
import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { Order } from '@renderer/types/api'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
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

const BillingValuesTable = ({ data }: Props) => {
  const columns = React.useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'الرقم',
        cell: ({ row }) => (row.index + 1).toString().padStart(2, '0')
      },
      {
        accessorKey: 'customerName',
        header: 'اسم المصنع'
      },
      {
        accessorKey: 'customerName',
        header: 'خط الإنتاج'
      },
      {
        accessorKey: 'createAt',
        header: 'التاريخ',
        cell: ({ row }) => {
          return <div>{new Date(row.original.createAt).toLocaleDateString()}</div>
        }
      },
      {
        accessorKey: 'billNo',
        header: 'اسم الفرقة'
      },
      {
        accessorKey: 'billNo',
        header: 'اسم الفرقة'
      },
      {
        accessorKey: 'sellingPrice',
        header: 'تكلفة المصنع'
      },
      {
        accessorKey: 'sellingPrice',
        header: 'تكلفة الإنتاج'
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

export default BillingValuesTable
