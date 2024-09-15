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
import { Link } from 'react-router-dom'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  title?: string
  className?: string
  onDeleteProductionLineTeam: (productionLineId: string, productionLineTeamIds: string[]) => void
}
interface ProductionTeam {
  id: string
  productionTeamName: string
  phoneNumber: string
  employsCount: number
}

interface ProductionLineProps {
  id: string
  productionLineName: string
  phoneNumber: string
  teamsCount: number
  productionTeams?: ProductionTeam[] // Include productionTeams here
}

export function StructureTable<TData extends ProductionLineProps, TValue>({
  columns,
  data,
  className,
  onDeleteProductionLineTeam
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
                row.original.productionTeams &&
                row.original.productionTeams.map((team, index) => (
                  <TableRow key={index} className="bg-white">
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <TableCell
                        key={`${cell.id}-${index}`}
                        className="text-gray-600 text-sm align-middle"
                      >
                        {/* Render nested data based on the column */}
                        {cellIndex === 0 && (
                          <div className="flex flex-col gap-2">
                            <div>{team.productionTeamName}</div>
                            <div style={{ fontSize: '0.8em', color: 'gray' }}>#{team.id}</div>
                          </div>
                        )}
                        {cellIndex === 1 && <p style={{ direction: 'ltr' }}>{team.phoneNumber}</p>}
                        {cellIndex === 2 && <p>{team.employsCount}</p>}
                        {/* last column showed be the dropdown menu */}
                        {cellIndex === 3 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Icons.ellipsis className="object-contain shrink-0 w-6 aspect-square" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuGroup>
                                <Link to={`./teams/${team.id}`}>
                                  <DropdownMenuItem>تعديل</DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem
                                  onClick={() => {
                                    onDeleteProductionLineTeam(row.original.id, [team.id])
                                  }}
                                  style={{ backgroundColor: 'orange', color: 'white' }}
                                  color="white"
                                  className="btn"
                                >
                                  حذف
                                </DropdownMenuItem>
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
