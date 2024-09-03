import { cn } from '@renderer/lib/utils'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Header,
  SortingState,
  useReactTable
} from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  title?: string
  className?: string
}

export function StructureTable<TData, TValue>({
  columns,
  data,
  // title, 
  className
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  const sortTable = (header: Header<TData, unknown>) => () => {
    if (header.column.columnDef.enableSorting) {
      header.column.getToggleSortingHandler()
    }
  }

  return (
    <div className={cn('rounded-lg bg-white', className)}>
      <Table className="relative text-center border-separate border-spacing-y-1 p-4">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              style={{ background: `rgba(218, 151, 46, 0.2)` }}
              key={headerGroup.id}
              className="border-none"
            >
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
            <TableRow
              className="text-nowrap bg-SurfContainerLow text-base font-medium"
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="px-5 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
