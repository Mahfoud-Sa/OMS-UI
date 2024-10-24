import CreateBtn from '@renderer/components/layouts/create-btn'
import { Button } from '@renderer/components/ui/button'
import ReportSearch from '../../_components/reports-search'
import ItemProductionReportTable from './item-production-report-table'

const ItemProductionReport = () => {
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

  return (
    <section>
      <div className="flex gap-3 flex-row h-[50px]">
        <ReportSearch />
        <Button className="w-[109px] h-full" variant="outline">
          فلترة
        </Button>
        <CreateBtn title={'إضافة طلب'} href={'new'} className="w-[200px]" />
      </div>
      <ItemProductionReportTable
        data={{
          orders: [],
          pageNumber: 0,
          pageSize: 0,
          pages: 0,
          total: 0
        }}
      />
    </section>
  )
}

export default ItemProductionReport
