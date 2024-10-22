'use client'

import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import AsyncSelect from 'react-select/async'

interface Orders {
  orders: {
    customerName: string
  }[]
}
interface Order {
  customerName: string
}

const OrdersSearch = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  // const queryClient = useQueryClient()

  const pathname = location.pathname
  const selectedVal = searchParams.get('query')

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => getApi<Orders>('/Orders')
  })

  const loadOptions = async (value: string) => {
    if (!value) return []
    const data = await getApi<Orders>('/Orders', {
      params: {
        query: value
      }
    })
    return data.data.orders || []
  }

  const customComponents = {
    DropdownIndicator: () => null,
    IndicatorSeparator: () => null
  }

  const onChange = (val: { customerName: string } | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (val?.customerName) {
      params.set('query', val.customerName)
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
        value={selectedVal?.length ? { customerName: selectedVal } : undefined}
        defaultOptions={orders?.data.orders}
        loadOptions={loadOptions}
        onChange={onChange}
        getOptionLabel={({ customerName }) => customerName}
        getOptionValue={({ customerName }) => customerName}
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
