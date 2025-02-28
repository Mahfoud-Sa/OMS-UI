'use client'

import { getApi } from '@renderer/lib/http'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import AsyncSelect from 'react-select/async'

interface Orders {
  orders: {
    customerName: string
    billNo: string
  }[]
}
interface Order {
  customerName: string
  billNo: string
}

const OrdersSearch = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  // const queryClient = useQueryClient()

  const pathname = location.pathname
  const selectedVal = searchParams.get('query')

  // const { data: orders } = useQuery({
  //   queryKey: ['orders'],
  //   queryFn: () => getApi<Orders>('/Orders')
  // })

  const loadOptions = async (value: string) => {
    if (!value) return []
    console.log(value)
    const data = await getApi<Orders>('/Orders', {
      params: {
        query: value,
        size: 100000000
      }
    })
    return data.data.orders || []
  }

  const customComponents = {
    DropdownIndicator: () => null,
    IndicatorSeparator: () => null
  }

  const onChange = (val: { billNo: string } | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (val?.billNo) {
      params.set('query', val.billNo)
    } else {
      params.delete('query')
    }
    params.set('page', '1')

    // queryClient.invalidateQueries({ queryKey: ['products'] })
    navigate(`${pathname}?${params.toString()}`, { replace: true })
  }

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      border: 'none',
      boxShadow: 'none',
      backgroundColor: '#fff'
    }),
    input: (provided: any) => ({
      ...provided,
      margin: 0
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999
    }),
    placeholder: (provided: any) => ({
      ...provided,
      fontWeight: 'bold',
      color: '#4B4846'
    }),
    singleValue: (provided: any) => ({
      ...provided
    })
  }

  return (
    <section className="flex w-full items-center justify-center rounded-lg border border-[#7d7875]">
      <Search className="mr-2 text-gray-500" />
      <AsyncSelect<Order>
        placeholder="ابحث عن.."
        loadingMessage={() => 'جارٍ البحث ...'}
        noOptionsMessage={() => 'لا توجد نتائج'}
        cacheOptions
        instanceId="products-search"
        value={selectedVal?.length ? ({ billNo: selectedVal } as Order) : undefined}
        // defaultOptions={orders?.data.orders}
        loadOptions={loadOptions}
        onChange={onChange}
        getOptionLabel={({ billNo }) => billNo}
        getOptionValue={({ billNo }) => billNo}
        components={customComponents}
        isClearable
        menuIsOpen={isMenuOpen}
        onInputChange={(value) => {
          setIsMenuOpen(value.length > 0)
        }}
        styles={customStyles}
        className="flex-grow"
      />
    </section>
  )
}

export default OrdersSearch
