import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterSheet from './components/filter-sheet'
import ReceiptDatesReportTable from './receipt-dates-report-table'
export interface ReceiptDatesReportProps {
  orderId: number
  name: string
  createAt: string
  factory: string
  line: string
  team: string
  deliveryAt: string
}

const ReceiptDatesReport = () => {
  const [openSheet, setOpenSheet] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const [filterOptions, setFilterOptions] = useState({
    factory: searchParams.get('factory') || '1',
    productionLine: searchParams.get('productionLine') || '1',
    productionTeam: searchParams.get('productionTeam') || '1',
    date: {
      from: searchParams.get('from') || '02-01-2020',
      to: searchParams.get('to') || '02-01-2025'
    }
  })
  const [editedFilterOptions, setEditedFilterOptions] = useState({
    factory: searchParams.get('factory') || '1',
    productionLine: searchParams.get('productionLine') || '1',
    productionTeam: searchParams.get('productionTeam') || '1',
    date: {
      from: searchParams.get('from') || '02-01-2020',
      to: searchParams.get('to') || '02-01-2025'
    }
  })

  const startDate = filterOptions.date.from
  const endDate = filterOptions.date.to
  const factoryId = filterOptions.factory
  const productionId = filterOptions.productionLine
  const teamId = filterOptions.productionTeam

  const { data, isPending } = useQuery({
    queryKey: ['orders', startDate, endDate, factoryId, productionId, teamId],
    queryFn: () =>
      getApi<ReceiptDatesReportProps[]>(`/Reporters/DeliveryDates`, {
        params: {
          startDate,
          endDate,
          factoryId,
          productionId,
          teamId
        }
      })
  })

  useEffect(() => {
    setSearchParams({
      factory: filterOptions.factory,
      productionLine: filterOptions.productionLine,
      productionTeam: filterOptions.productionTeam,
      from: filterOptions.date.from,
      to: filterOptions.date.to
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
      }
    }
    setFilterOptions(filters)
    console.log(filters)
  }

  return (
    <>
      <section>
        <div className="flex gap-3 flex-row h-[50px] px-4">
          <Button onClick={() => setOpenSheet(true)} className="w-full h-full" variant="outline">
            فلترة
          </Button>
          <Button onClick={() => setOpenSheet(true)} className="w-full h-full" variant="default">
            تصدير
          </Button>
        </div>
        <ReceiptDatesReportTable
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
        filterOptions={editedFilterOptions}
        setFilterOptions={setEditedFilterOptions}
        open={openSheet}
        onClose={() => setOpenSheet(false)}
        onApply={handleApplyFilters}
      />
    </>
  )
}

export default ReceiptDatesReport
