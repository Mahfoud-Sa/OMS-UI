import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import AsyncSelect from 'react-select/async'
interface Users {
  users: {
    firstName: string
  }[]
}
interface User {
  firstName: string
}
const ProductsSearch = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  // const queryClient = useQueryClient()

  const pathname = location.pathname
  const selectedVal = searchParams.get('query')

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => getApi<Users>('/users')
  })

  const loadOptions = async (value: string) => {
    if (!value) return []
    const data = await getApi<Users>('/users', {
      params: {
        firstName: value
      }
    })
    return data.data.users || []
  }

  const customComponents = {
    DropdownIndicator: () => null,
    IndicatorSeparator: () => null
  }

  const onChange = (val: { firstName: string } | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (val?.firstName) {
      params.set('query', val.firstName)
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
      <AsyncSelect<User>
        placeholder="ابحث عن.."
        loadingMessage={() => 'جارٍ البحث ...'}
        noOptionsMessage={() => 'لا توجد نتائج'}
        cacheOptions
        instanceId="products-search"
        value={selectedVal?.length ? { firstName: selectedVal } : undefined}
        defaultOptions={users?.data.users}
        loadOptions={loadOptions}
        onChange={onChange}
        getOptionLabel={({ firstName }) => firstName}
        getOptionValue={({ firstName }) => firstName}
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

export default ProductsSearch
