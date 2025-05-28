import Loader from '@renderer/components/layouts/loader'
import { getApi } from '@renderer/lib/http'
import { Order } from '@renderer/types/api'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import { useState } from 'react'
import { useAuthUser } from 'react-auth-kit'
import { useSearchParams } from 'react-router-dom'
import FilterSheet from './filter-sheet'
import OrdersTable from './table'

type Props = {
  status: null | 0 | 1 | 2 | 3 | 4 | 6
  openSheet?: boolean
  setOpenSheet?: (value: boolean) => void
}

const OrdersWrapper = ({ status, openSheet, setOpenSheet }: Props) => {
  const authUser = useAuthUser()
  const userType = authUser()?.userType as string
  const [searchParams] = useSearchParams()
  const [isAsc, setAsc] = useState<boolean>(false)
  const [filterOptions, setFilterOptions] = useState({
    minCostPrice: '',
    maxCostPrice: '',
    createdBefore: '',
    createdAfter: '',
    minSellingPrice: '',
    maxSellingPrice: '',
    factoryId: ''
  })
  const [editedFilterOptions, setEditedFilterOptions] = useState({
    minCostPrice: '',
    maxCostPrice: '',
    createdBefore: '',
    createdAfter: '',
    minSellingPrice: '',
    maxSellingPrice: '',
    factoryId: ''
  })

  const query = searchParams.get('query')
  const page = searchParams.get('page')

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['orders', status, query, page, isAsc, filterOptions],
    // 5 seconds cache
    gcTime: 5000,
    staleTime: 5000,
    queryFn: () =>
      getApi<{
        total: number
        orders: Order[]
        pageNumber: number
        pageSize: number
        pages: number
      }>(
        `/Orders${userType === 'بائع' ? '/User' : userType === 'منسق طلبات' ? '/OrderManager' : ''}`,
        {
          params: {
            query,
            page,
            size: 15,
            orderState: status,
            ascending: isAsc,
            ...filterOptions
          }
        }
      )
  })

  if (isPending)
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <Loader size={40} color={'#DA972E'} />
      </div>
    )

  if (isError) return <div>{error.message}</div>

  const handleApplyFilters = (data) => {
    const newFilterOptions = {
      ...filterOptions,
      createdBefore: data.createdBefore ? moment(data.createdBefore).format('MM-DD-YYYY') : '',
      createdAfter: data.createdAfter ? moment(data.createdAfter).format('MM-DD-YYYY') : '',
      ...data
    }

    Object.keys(newFilterOptions).forEach((key) => {
      if (!newFilterOptions[key]) {
        delete newFilterOptions[key]
      }
    })

    setFilterOptions(newFilterOptions)
  }

  return (
    <>
      <section>
        <OrdersTable
          setAsc={(value) => {
            console.log(value)
            setAsc(value)
          }}
          isAsc={isAsc}
          data={data?.data || { orders: [], pageNumber: 0, pageSize: 0, pages: 0, total: 0 }}
        />
      </section>
      <FilterSheet
        filterOptions={editedFilterOptions}
        setFilterOptions={setEditedFilterOptions}
        open={openSheet || false}
        onClose={() => setOpenSheet && setOpenSheet(false)}
        onApply={handleApplyFilters}
      />
    </>
  )
}

export default OrdersWrapper
