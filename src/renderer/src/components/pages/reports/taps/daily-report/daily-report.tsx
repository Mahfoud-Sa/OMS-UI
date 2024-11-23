import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import * as XLSX from 'xlsx'
import FilterSheetDaily from './components/filter-sheet'
import DailyReportTable from './daily-report-table'

export interface DailyReportProps {
  createAt: string
  total: number
}

const DailyReport = () => {
  const [openSheet, setOpenSheet] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const [editedFilterOptions, setEditedFilterOptions] = useState({
    factory: searchParams.get('factory') || '',
    productionLine: searchParams.get('productionLine') || '',
    productionTeam: searchParams.get('productionTeam') || '',
    date: {
      from: '2020-01-02',
      to: '2025-01-02'
    }
  })
  const [filterOptions, setFilterOptions] = useState({
    factory: searchParams.get('factory') || '',
    productionLine: searchParams.get('productionLine') || '',
    productionTeam: searchParams.get('productionTeam') || '',
    date: {
      from: searchParams.get('from') || '2020-01-02',
      to: searchParams.get('to') || '2025-01-02'
    }
  })

  const startDate = filterOptions.date.from
  const endDate = filterOptions.date.to
  const factoryId = filterOptions.factory
  const productionId = filterOptions.productionLine
  const teamId = filterOptions.productionTeam

  const { data, isPending } = useQuery({
    queryKey: ['orders', 'daily-report', startDate, endDate, factoryId, productionId, teamId],
    queryFn: () =>
      getApi<DailyReportProps[]>(`/Reporters/Daily`, {
        params: {
          startDate,
          endDate,
          ...(factoryId && { factoryId }),
          ...(productionId && { productionId }),
          ...(teamId && { teamId })
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
        from: moment(data.date.from).format('MM-DD-YYYY') || '02/01/2020',
        to: moment(data.date.to).format('MM-DD-YYYY') || '02/01/2025'
      }
    }
    setFilterOptions(filters)
    console.log(filters)
  }

  const handleExportToExcel = () => {
    if (!data) return

    const exportData = data.data.map((item) => ({
      التاريخ: moment(item.createAt).format('YYYY-MM-DD'),
      'عدد المنتجات لهذا اليوم': item.total
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daily Report')
    const formattedStartDate = moment(startDate).format('YYYY-MM-DD')
    const formattedEndDate = moment(endDate).format('YYYY-MM-DD')

    const fileName = `التقرير اليومي_${formattedStartDate}_الى_${formattedEndDate}.xlsx`
    XLSX.writeFile(workbook, fileName)
  }

  return (
    <>
      <section>
        <div className="flex gap-3 flex-row h-[50px] px-4">
          <Button onClick={() => setOpenSheet(true)} className="w-full h-full" variant="outline">
            فلترة
          </Button>
          <Button onClick={handleExportToExcel} className="w-full h-full" variant="default">
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
      <FilterSheetDaily
        filterOptions={editedFilterOptions}
        setFilterOptions={setEditedFilterOptions}
        open={openSheet}
        onClose={() => setOpenSheet(false)}
        onApply={handleApplyFilters}
      />
    </>
  )
}

export default DailyReport
