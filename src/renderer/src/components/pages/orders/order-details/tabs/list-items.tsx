import Loader from '@renderer/components/layouts/loader'
import { StructureTable } from '@renderer/components/tables/structure-table'
import { Button } from '@renderer/components/ui/button'
import { getApi } from '@renderer/lib/http'
import { OrderHistory } from '@renderer/types/api'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

const ListItems = () => {
  const { id } = useParams()

  const { data, isPending, error, isError } = useQuery({
    queryKey: ['OrderHistories', id],
    queryFn: () => getApi<OrderHistory[]>(`/Orders/${id}/OrderHistories`)
  })

  const columns = useMemo<ColumnDef<OrderHistory>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'الرقم',
        cell: ({ row }) => (row.index + 1).toString().padStart(2, '0')
      },
      {
        accessorKey: 'userName',
        header: 'اسم المستخدم'
      },
      {
        accessorKey: 'actionName',
        header: 'نوع العملية'
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              تاريخ
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          return <div>{new Date(row.original.createdAt).toLocaleDateString()}</div>
        }
      }
    ],
    []
  )

  if (isPending)
    return (
      <div className="flex justify-center items-center bg-white rounded-lg min-h-[800px] shadow-sm">
        <Loader size={50} color="#DA972E" />
      </div>
    )

  if (isError) return <p>{error.message}</p>

  return (
    <div>
      <StructureTable columns={columns} data={data.data} />
    </div>
  )
}

export default ListItems
