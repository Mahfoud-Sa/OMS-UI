import { StructureTable } from '@renderer/components/tables/structure-table'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import React from 'react'
import { DailyReportProps } from './daily-report'

type Props = {
  data: {
    orders: DailyReportProps[]
    pageNumber: number
    pageSize: number
    pages: number
    total: number
  }
}

const DailyReportTable = ({ data }: Props) => {
  const columns = React.useMemo<ColumnDef<DailyReportProps>[]>(
    () => [
      {
        accessorKey: 'createAt',
        header: 'تاريخ الانشاء',
        cell: ({ row }) => {
          return moment(row.original.createAt).format('YYYY-MM-DD')
        }
      },
      {
        accessorKey: 'total',
        header: 'المجموع'
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

export default DailyReportTable
