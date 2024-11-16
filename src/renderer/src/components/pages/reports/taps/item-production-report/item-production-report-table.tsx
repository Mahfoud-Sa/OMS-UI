import { StructureTable } from '@renderer/components/tables/structure-table'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import React from 'react'
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
