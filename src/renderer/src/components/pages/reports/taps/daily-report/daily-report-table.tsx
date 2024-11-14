import { StructureTable } from '@renderer/components/tables/structure-table'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import React from 'react'

type Props = {
  data: {
    orders: tableProps[]
    pageNumber: number
    pageSize: number
    pages: number
    total: number
  }
}
type tableProps = {
  orderId: string
  createAt: string
  team: string
  factory: string
  line: string
}

const DailyReportTable = ({ data }: Props) => {
  const columns = React.useMemo<ColumnDef<tableProps>[]>(
    () => [
      {
        accessorKey: 'orderId',
        header: () => {
          return ''
        },
        cell: ({ row }) => (row.index + 1).toString().padStart(2, '0')
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

export default DailyReportTable
