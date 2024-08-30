import Loader from '@renderer/components/layouts/loader'
import { getApi } from '@renderer/lib/http'
import { Product } from '@renderer/types/api'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import ProductsTable from './products-table'

const ProductsWrapper = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')

  const { data, isPending } = useQuery({
    queryKey: ['products', query],
    queryFn: () =>
      getApi<Product[]>(`/Products`, {
        params: {
          query
        }
      })
  })

  if (isPending)
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <Loader size={40} color={'#DA972E'} />
      </div>
    )

  return <ProductsTable data={data?.data || []} />
}

export default ProductsWrapper
