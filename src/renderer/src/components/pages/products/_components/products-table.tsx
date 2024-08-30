import DeleteDialog from '@renderer/components/layouts/delete-dialog'
import { StructureTable } from '@renderer/components/tables/structure-table '
import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { Product } from '@renderer/types/api'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

type Props = {
  data: Product[]
}

const ProductsTable = ({ data }: Props) => {
  const columns = React.useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'الرقم',
        cell: ({ row }) => (row.index + 1).toString().padStart(2, '0')
      },
      {
        accessorKey: 'name',
        header: 'أسم المنتج'
      },
      {
        accessorKey: 'quantity',
        header: 'الكمية'
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
              <Link to={`/products/${row.original?.id}`}>
                <DropdownMenuItem className="cursor-pointer">تفاصيل</DropdownMenuItem>
              </Link>

              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DeleteDialog url={`/products/${row.original?.id}`} keys={['products']} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ],
    []
  )

  return <StructureTable columns={columns} data={data} />
}

export default ProductsTable
