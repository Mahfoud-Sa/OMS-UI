import { Icons } from '@renderer/components/icons/icons'
import CreateBtn from '@renderer/components/layouts/create-btn'
import { StructureTable } from '@renderer/components/tables/structure-table'
import TablePagination from '@renderer/components/tables/table-pagination'
import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { Skeleton } from '@renderer/components/ui/skeleton'
import { useToast } from '@renderer/components/ui/use-toast_1'
import { deleteApi, getApi } from '@renderer/lib/http'
import { gotRole } from '@renderer/lib/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import FactoriesSearch from './_components/factories-search'
import Statistics from './_components/statistics'

export interface FactoryInterface {
  id: string
  name: string
  location: string
  createdAt: string
  productionLinesCount?: number
  teamsCount?: number
}

const Factories = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const page = searchParams.get('page') || '1'
  const pageSize = 6
  const sortBy = 'date'
  const [ascending, setAscending] = useState(true)
  const { data: fetchedData, isLoading } = useQuery({
    queryKey: ['factories', query, page, sortBy, ascending],
    queryFn: () =>
      getApi<{
        factories: FactoryInterface[]
        total: number
        pageNumber: number
        pageSize: number
        pages: number
      }>('/Factories', {
        params: { query, page, pageSize, sortBy, ascending }
      })
  })

  const [factoriesData, setFactoriesData] = useState<FactoryInterface[]>([])
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedFactoryId, setSelectedFactoryId] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (id: string) => {
      return deleteApi(`/Factories/${id}`)
    },
    onSuccess: () => {
      toast({
        title: 'تم الحذف',
        description: `تم حذف المصنع بنجاح`,
        variant: 'success'
      })
      queryClient.invalidateQueries({ queryKey: ['factories'] })
    }
  })

  const removeSelectedFactory = (id: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      try {
        mutation.mutate(id)
        const updateFactoriesData = factoriesData?.filter((factory) => factory.id !== id)
        setFactoriesData(updateFactoriesData)
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  const columns: ColumnDef<FactoryInterface, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'اسم المصنع',
      cell: (info) => (
        <>
          <div>{info.row.original.name}</div>
          <div style={{ fontSize: '0.8em', color: 'gray' }}>#{info.row.original.id}</div>
        </>
      )
    },
    {
      accessorKey: 'createdAt',
      header: () => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              setAscending(!ascending)
            }}
          >
            تاريخ التسجيل
            <ArrowUpDown className="ml-2 h-4 w-4 mx-2" />
          </Button>
        )
      },
      cell: (info) => info.getValue(),
      enableSorting: true
    },
    {
      accessorKey: 'location',
      header: 'موقع المصنع',
      cell: (info) => info.getValue()
    },
    {
      id: 'actions',
      cell: (info) => (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Icons.ellipsis className="object-contain shrink-0 w-6 aspect-square" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                {gotRole('Get Factory') && (
                  <Link to={`/factories/${info.row.original.id}`}>
                    <DropdownMenuItem>تعديل</DropdownMenuItem>
                  </Link>
                )}
                {gotRole('Delete Factory') && (
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedFactoryId(info.row.original.id)
                      setIsDialogOpen(true)
                    }}
                    style={{ backgroundColor: 'orange', color: 'white' }}
                    color="white"
                    className="btn"
                  >
                    حذف
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )
    }
  ]

  useEffect(() => {
    if (fetchedData?.data.factories) {
      console.log(fetchedData.data.factories)
      fetchedData.data.factories.forEach((factory) => {
        const date = new Date(factory.createdAt)
        factory.createdAt = date.toISOString().split('T')[0]
      })
      setFactoriesData(fetchedData.data.factories)
    }
  }, [fetchedData])

  return (
    <section className="p-5">
      <Statistics factoriesTotal={factoriesData?.length} productionLinesTotal={0} />
      <div className="bg-white rounded-lg min-h-[500px] p-7 shadow-sm mt-6">
        <div className="flex gap-3 flex-row h-[50px]">
          <FactoriesSearch />
          <CreateBtn
            disable={!gotRole('Add Factory')}
            title={'اضافة مصنع'}
            href={'new'}
            className="w-[200px]"
          />
        </div>
        <div className="p-4 h-96 overflow-auto mt-4">
          {isLoading && <Skeleton className="h-96" />}
          {factoriesData && (
            <StructureTable columns={columns} data={factoriesData} title="Factories" />
          )}
        </div>
        <TablePagination
          total={fetchedData?.data.total || 0}
          page={fetchedData?.data.pageNumber || 1}
          pageSize={fetchedData?.data.pageSize || 10}
        />
      </div>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setSelectedFactoryId(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف المصنع</DialogTitle>
          </DialogHeader>
          <DialogDescription>هل انت متاكد من حذف المصنع؟</DialogDescription>
          <DialogFooter className="gap-4">
            <button
              onClick={async () => {
                if (selectedFactoryId) {
                  await removeSelectedFactory(selectedFactoryId)
                }
                setIsDialogOpen(false)
              }}
              className="bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
            >
              نعم
            </button>
            <DialogClose asChild>
              <button>لا</button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

export default Factories
