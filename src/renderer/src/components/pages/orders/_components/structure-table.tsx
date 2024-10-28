import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/ui/table'
import { cn } from '@renderer/lib/utils'
import { OrderItemTable } from '@renderer/types/api'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  Header,
  SortingState,
  useReactTable
} from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import React, { useState } from 'react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  title?: string
  className?: string
  displayActions?: boolean
}
export function StructureTable<TData extends OrderItemTable, TValue>({
  columns,
  data,
  className
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [expanded, setExpanded] = useState({})

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      expanded
    },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel()
  })

  const sortTable = (header: Header<TData, unknown>) => () => {
    if (header.column.columnDef.enableSorting) {
      header.column.getToggleSortingHandler()
    }
  }

  return (
    <div className={cn('rounded-lg bg-white col-span-3', className)}>
      <Table className="relative text-center border-separate border-spacing-y-1 p-4">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-none bg-white">
              {headerGroup.headers.map((header) => (
                <TableHead
                  className={`border-b p-0 px-5 text-center text-black ${header.column.columnDef.enableSorting ? 'flex items-center cursor-pointer justify-center border-b-0' : ''}`}
                  key={header.id}
                  onClick={sortTable(header)}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.columnDef.enableSorting && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <React.Fragment key={row.id}>
              <TableRow
                className="text-nowrap bg-SurfContainerLow text-base font-medium"
                key={row.id}
                style={{ background: `rgba(218, 151, 46, 0.2)` }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="px-5 py-2"
                    style={{
                      direction: cell.column.columnDef.cell === 'phoneNumber' ? 'ltr' : 'inherit'
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
