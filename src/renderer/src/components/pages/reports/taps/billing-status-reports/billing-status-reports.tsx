import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DailyReportTable from '../daily-report/daily-report-table'
import FilterSheet from './components/filter-sheet'

const BillingStatusReports = () => {
  const [openSheet, setOpenSheet] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const [editFilterOptions, setEditFilterOptions] = useState({
    factory: searchParams.get('factory') || '',
    productionLine: searchParams.get('productionLine') || '',
    productionTeam: searchParams.get('productionTeam') || '',
    date: {
      from: searchParams.get('from') || '02/01/2020',
      to: searchParams.get('to') || '02/01/2025'
    },
    orderState: searchParams.get('orderState') || '5'
  })
  const [filterOptions, setFilterOptions] = useState({
    factory: searchParams.get('factory') || '',
    productionLine: searchParams.get('productionLine') || '',
    productionTeam: searchParams.get('productionTeam') || '',
    date: {
      from: searchParams.get('from') || '02/01/2020',
      to: searchParams.get('to') || '02/01/2025'
    },
    orderState: searchParams.get('orderState') || '5'
  })
  interface BillingStatusReportsProps {
    orderId: string
    createAt: string
    factory: string
    line: string
    team: string
  }

  const startDate = filterOptions.date.from
  const endDate = filterOptions.date.to
  const factory = filterOptions.factory
  const line = filterOptions.productionLine
  const team = filterOptions.productionTeam
  const orderState = filterOptions.orderState

  const { data, isPending } = useQuery({
    queryKey: ['orders', startDate, endDate, factory, line, team, orderState],
    queryFn: () =>
      getApi<BillingStatusReportsProps[]>(`/Reporters/OrdersStates`, {
        params: {
          startDate,
          endDate,
          factory,
          line,
          team,
          orderState
        }
      })
  })

  useEffect(() => {
    setSearchParams({
      factory: filterOptions.factory,
      productionLine: filterOptions.productionLine,
      productionTeam: filterOptions.productionTeam,
      from: filterOptions.date.from,
      to: filterOptions.date.to,
      orderState: filterOptions.orderState
    })
  }, [filterOptions, setSearchParams])

  if (isPending)
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <Loader size={40} color={'#DA972E'} />
      </div>
    )

  const handleApplyFilters = (data) => {
    const filters = {
      factory: data.factory,
      productionLine: data.productionLine,
      productionTeam: data.productionTeam,
      date: {
        from: moment(data.date.from).format('DD/MM/YYYY') || '02/01/2020',
        to: moment(data.date.to).format('DD/MM/YYYY') || '02/01/2025'
      },
      orderState: data.orderState || '5'
    }
    setFilterOptions(filters)
    console.log(filters)
  }

  return (
    <>
      <section>
        <div className="flex gap-3 justify-center flex-row h-[50px] px-4">
          <Button onClick={() => setOpenSheet(true)} className="w-full h-full" variant="outline">
            فلترة
          </Button>
          <Button onClick={() => setOpenSheet(true)} className="w-full h-full" variant="default">
            تصدير
          </Button>
        </div>
        <DailyReportTable
          data={{
            orders: data?.data || [],
            pageNumber: 0,
            pageSize: 0,
            pages: 0,
            total: 0
          }}
        />
      </section>
      <FilterSheet
        filterOptions={editFilterOptions}
        setFilterOptions={setEditFilterOptions}
        open={openSheet}
        onClose={() => setOpenSheet(false)}
        onApply={handleApplyFilters}
      />
    </>
  )
}

export default BillingStatusReports
