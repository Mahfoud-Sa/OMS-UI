import { Icons } from '@renderer/components/icons/icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/ui/table'
import { cn } from '@renderer/lib/utils'
import { ProductionLineProps, ProductionTeam } from '@renderer/types/api'
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
  onEditProductionLineTeam: (productionLineTeam: ProductionTeam, productionLineId: string) => void
}
export function StructureTable<TData extends ProductionLineProps, TValue>({
  columns,
  data,
  className,
  displayActions = true,
  onEditProductionLineTeam
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
    <div className={cn('rounded-lg bg-white', className)}>
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
              {/* Nested rows with the same column layout */}
              {row.getIsExpanded() &&
                row.original.teams &&
                row.original.teams.map((team, index) => (
                  <TableRow key={index} className="bg-white">
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <TableCell
                        key={`${cell.id}-${index}`}
                        className="text-gray-600 text-sm align-middle"
                      >
                        {/* Render nested data based on the column */}
                        {cellIndex === 0 && (
                          <div className="flex flex-col gap-2">
                            <div>{team.name}</div>
                            {team.id && (
                              <div style={{ fontSize: '0.8em', color: 'gray' }}>#{team.id}</div>
                            )}
                          </div>
                        )}
                        {cellIndex === 1 && <p style={{ direction: 'ltr' }}>{team.phone}</p>}
                        {/* last column showed be the dropdown menu */}
                        {cellIndex === 3 && displayActions && (
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Icons.ellipsis className="object-contain shrink-0 w-6 aspect-square" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuGroup>
                                <a
                                  onClick={() => {
                                    onEditProductionLineTeam(team, String(row.original.id))
                                  }}
                                >
                                  <DropdownMenuItem>تعديل</DropdownMenuItem>
                                </a>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
