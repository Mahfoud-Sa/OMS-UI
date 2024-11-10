import Loader from '@renderer/components/layouts/loader'
import { getApi } from '@renderer/lib/http'
import { Product } from '@renderer/types/api'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import ProductsTable from './products-table'

const ProductsWrapper = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const page = searchParams.get('page')

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['products', query, page],
    queryFn: () =>
      getApi<{
        total: number
        products: Product[]
        pageNumber: number
        pageSize: number
        pages: number
      }>(`/Products`, {
        params: {
          query,
          page
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
  return <ProductsTable data={data?.data! || []} />
}

export default ProductsWrapper
