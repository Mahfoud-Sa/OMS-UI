import { cn } from '@renderer/lib/utils'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table'
import { useEffect, useRef, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  title?: string
  className?: string
  rowClassName?: (row: TData) => string
  tableHeight?: string
}

export function StructureTable<TData, TValue>({
  columns,
  data,
  className,
  rowClassName,
  tableHeight = '400px'
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [showBottomShadow, setShowBottomShadow] = useState(false)
  const tableContainerRef = useRef<HTMLDivElement>(null)

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

  // Check if scrollable content exists
  useEffect(() => {
    const checkScroll = () => {
      const container = tableContainerRef.current
      if (container) {
        const hasScrollableContent = container.scrollHeight > container.clientHeight
        setShowBottomShadow(
          hasScrollableContent &&
            container.scrollTop < container.scrollHeight - container.clientHeight
        )
      }
    }

    const handleScroll = () => {
      const container = tableContainerRef.current
      if (container) {
        setShowBottomShadow(
          container.scrollTop < container.scrollHeight - container.clientHeight - 20
        )
      }
    }

    const container = tableContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      checkScroll()

      // Re-check when data changes
      checkScroll()
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [data])

  return (
    <div className={cn('rounded-lg bg-white relative m-2', className)}>
      <div
        ref={tableContainerRef}
        style={{ height: tableHeight, overflowY: 'auto' }}
        className="relative"
      >
        <Table className="relative text-center border-separate border-spacing-y-1 p-4">
          <TableHeader className="sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                style={{ background: `rgba(218, 151, 46, 0.2)` }}
                key={headerGroup.id}
                className="border-none"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead className={`border-b p-0 px-5 text-center text-black`} key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                className={cn(
                  'text-nowrap bg-SurfContainerLow text-base font-medium',
                  rowClassName && rowClassName(row.original)
                )}
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
      {showBottomShadow && (
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-200 to-transparent pointer-events-none"></div>
      )}
    </div>
  )
}
