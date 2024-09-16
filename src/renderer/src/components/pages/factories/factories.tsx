import { Icons } from '@renderer/components/icons/icons'
import CreateBtn from '@renderer/components/layouts/create-btn'
import { StructureTable } from '@renderer/components/tables/structure-table '
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
import { useToast } from '@renderer/components/ui/use-toast'
import { deleteApi, getApi } from '@renderer/lib/http'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import FactoriesSearch from './_components/factories-search'
import Statistics from './_components/statistics'

export interface FactoryInterface {
  id: string
  factoryName: string
  factoryLocation: string
  createdAt: string
  productionLinesCount: number
  teamsCount: number
}

const initialFactoryData: FactoryInterface[] = [
  {
    id: '4131324242429',
    factoryName: 'Factory 1',
    factoryLocation: 'Location 1',
    createdAt: '2000-01-01',
    productionLinesCount: 100,
    teamsCount: 100
  },
  {
    id: '2',
    factoryName: 'Factory 2',
    factoryLocation: 'Location 2',
    createdAt: '2005-05-05',
    productionLinesCount: 200,
    teamsCount: 200
  }
  // Add more factory data as needed
]

const Factories = () => {
  const {
    data: fetchedData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['factories'],
    queryFn: () =>
      getApi<{ factories: FactoryInterface[] }>('/api/Factories', {
        params: { page: 1, pageSize: 2 }
      })
  })
  console.log(fetchedData)

  const [factoriesData, setFactoriesData] = useState(fetchedData?.data.factories)
  const { toast } = useToast()
  const [page] = useState(1)
  const pageSize = 10
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedFactoryId, setSelectedFactoryId] = useState<string | null>(null)
  const mutation = useMutation({
    mutationFn: (id: string) => {
      return deleteApi(`/api/Factories/${id}`)
    }
  })

  const removeSelectedFactory = (id: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      try {
        // TODO need to implement deleteApi
        mutation.mutate(id)
        const deletedFactoryData = factoriesData?.find((factory) => factory.id === id)
        const updateFactoriesData = factoriesData?.filter((factory) => factory.id !== id)
        setFactoriesData(updateFactoriesData)
        toast({
          title: 'تم الحذف',
          description: `تم حذف المصنع ${deletedFactoryData?.factoryName}`,
          variant: 'success'
        })

        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  const columns: ColumnDef<FactoryInterface, unknown>[] = [
    {
      accessorKey: 'factoryName',
      header: 'اسم المصنع',
      cell: (info) => (
        <>
          <div>{info.row.original.factoryName}</div>
          <div style={{ fontSize: '0.8em', color: 'gray' }}>
            ...#{info.row.original.id.slice(0, 8)}
          </div>
        </>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'تاريخ الانشاء',
      cell: (info) => info.getValue(),
      enableSorting: true
    },
    {
      accessorKey: 'factoryLocation',
      header: 'موقع المصنع',
      cell: (info) => info.getValue()
    },
    {
      accessorKey: 'productionLinesCount',
      header: 'عدد خطوط الانتاج',
      cell: (info) => info.getValue()
    },
    {
      accessorKey: 'teamsCount',
      header: 'عدد الفرق',
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
                <Link to={`/factories/${info.row.original.id}`}>
                  <DropdownMenuItem>تعديل</DropdownMenuItem>
                </Link>
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
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )
    }
  ]

  let paginatedData = factoriesData?.slice((page - 1) * pageSize, page * pageSize)
  if (error) {
    console.log(error)
    paginatedData = initialFactoryData?.slice((page - 1) * pageSize, page * pageSize)
  }

  return (
    <section className="p-5">
      <Statistics />
      <div className="bg-white rounded-lg min-h-[500px] p-7 shadow-sm mt-6">
        <div className="flex gap-3 flex-row h-[50px]">
          <FactoriesSearch />
          <CreateBtn title={'اضافة مصنع'} href={'new'} className="w-[200px]" />
        </div>
        <div className="p-4 h-96 overflow-auto mt-4">
          {isLoading && <Skeleton className="h-96" />}
          {paginatedData && (
            <StructureTable
              columns={columns}
              data={paginatedData ? paginatedData : []}
              title="Factories"
            />
          )}
          {/* <TablePagination
            total={factoriesData.length}
            page={page}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
          /> */}
        </div>
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
