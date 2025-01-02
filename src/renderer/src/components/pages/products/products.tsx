import CreateBtn from '@renderer/components/layouts/create-btn'
import { getApi } from '@renderer/lib/http'
import { gotRole } from '@renderer/lib/utils'
import { useQuery } from '@tanstack/react-query'
import ProductsSearch from './_components/products-search'
import ProductsWrapper from './_components/products-wrapper'
import Statistics from './_components/statistics'

const Products = () => {
  const { data } = useQuery({
    queryKey: ['StatisticsProducts'],
    queryFn: () => getApi<number>(`/Products/total`)
  })

  return (
    <section>
      <Statistics total={data?.data || 0} />
      <div className="bg-white rounded-lg min-h-[500px] p-7 shadow-sm mt-6">
        <div className="flex gap-3 flex-row h-[50px]">
          <ProductsSearch />
          <CreateBtn
            disable={!gotRole('Add Product')}
            title={'إضافة منتج'}
            href={'new'}
            className="w-[200px]"
          />
        </div>

        <ProductsWrapper />
      </div>
    </section>
  )
}

export default Products
