import Loader from '@renderer/components/layouts/loader'
import { getApi } from '@renderer/lib/http'
import { Order } from '@renderer/types/api'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import OrdersTable from './table'

type Props = {
  status: null | 0 | 1 | 2 | 3 | 4
}

const OrdersWrapper = ({ status }: Props) => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const page = searchParams.get('page')

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['orders', status, query, page],
    queryFn: () =>
      getApi<{
        total: number
        orders: Order[]
        pageNumber: number
        pageSize: number
        pages: number
      }>(`/Orders`, {
        params: {
          query,
          page,
          orderState: status
        }
      })
  })

  if (isPending)
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <Loader size={40} color={'#DA972E'} />
      </div>
    )

  if (isError) return <div>{error.message}</div>
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  return <OrdersTable data={data.data || []} />
}

export default OrdersWrapper
