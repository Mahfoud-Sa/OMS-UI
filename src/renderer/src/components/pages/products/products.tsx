import CreateBtn from '@renderer/components/layouts/create-btn'
import ProductsSearch from './_components/products-search'
import ProductsWrapper from './_components/products-wrapper'
import Statistics from './_components/statistics'

const Products = () => {
  return (
    <section>
      <Statistics total={3000} />
      <div className="bg-white rounded-lg min-h-[500px] p-7 shadow-sm mt-6">
        <div className="flex gap-3 flex-row h-[50px]">
          <ProductsSearch />
          <CreateBtn title={'إضافة منتج'} href={'new'} className="w-[200px]" />
        </div>

        <ProductsWrapper />
      </div>
    </section>
  )
}

export default Products
