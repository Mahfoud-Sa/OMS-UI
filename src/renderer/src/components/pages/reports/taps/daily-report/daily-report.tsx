import { Button } from '@renderer/components/ui/button'
import { getApi } from '@renderer/lib/http'
import { useState } from 'react'
import FilterSheet from './components/filter-sheet'
import DailyReportTable from './daily-report-table'

const DailyReport = () => {
  const [openSheet, setOpenSheet] = useState(false)
  const [filterOptions, setFilterOptions] = useState({
    factory: '',
    productionLine: '',
    productionTeam: '',
    sortBy: 'asc',
    price: {
      min: 0,
      max: 0
    },
    date: {
      from: '',
      to: ''
    },
    orderState: ''
  })
  // const [searchParams] = useSearchParams()
  // const query = searchParams.get('query')
  // const page = searchParams.get('page')

  // const { data, isPending, isError, error } = useQuery({
  //   queryKey: ['orders', status, query, page],
  //   queryFn: () =>
  //     getApi<{
  //       total: number
  //       orders: Order[]
  //       pageNumber: number
  //       pageSize: number
  //       pages: number
  //     }>(`/Orders`, {
  //       params: {
  //         query,
  //         page,
  //         orderState: status
  //       }
  //     })
  // })

  // if (isPending)
  //   return (
  //     <div className="min-h-[300px] flex items-center justify-center">
  //       <Loader size={40} color={'#DA972E'} />
  //     </div>
  //   )
  const getData = () => {
    getApi(`/Orders`, {
      params: {}
    })
  }

  const handleApplyFilters = (filters) => {
    setFilterOptions(filters)
    console.log(filters)
  }

  return (
    <>
      <section>
        <div className="flex gap-3 flex-row h-[50px] px-4">
          <Button onClick={() => setOpenSheet(true)} className="w-full h-full" variant="outline">
            فلترة
          </Button>
          <Button onClick={() => setOpenSheet(true)} className="w-full h-full" variant="default">
            تصدير
          </Button>
        </div>
        <DailyReportTable
          data={{
            orders: [],
            pageNumber: 0,
            pageSize: 0,
            pages: 0,
            total: 0
          }}
        />
      </section>
      <FilterSheet
        open={openSheet}
        onClose={() => {
          setOpenSheet(false)
          setFilterOptions({
            factory: '',
            productionLine: '',
            productionTeam: '',
            sortBy: 'asc',
            price: {
              min: 0,
              max: 0
            },
            date: {
              from: '',
              to: ''
            },
            orderState: ''
          })
        }}
        onApply={handleApplyFilters}
      />
    </>
  )
}

export default DailyReport
