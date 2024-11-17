import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import * as XLSX from 'xlsx'
import FilterSheet from './components/filter-sheet'
import ItemProductionReportTable from './item-production-report-table'
export interface ItemProductionReportProps {
  orderId: number
  createAt: string
  factory: string
  line: string
  team: string
}

const ItemProductionReport = () => {
  const [openSheet, setOpenSheet] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const [filterOptions, setFilterOptions] = useState({
    factory: searchParams.get('factory') || '',
    productionLine: searchParams.get('productionLine') || '',
    productionTeam: searchParams.get('productionTeam') || '',
    product: searchParams.get('product') || '1',
    date: {
      from: searchParams.get('from') || '2020-02-01',
      to: searchParams.get('to') || '2025-02-01'
    }
  })
  const [editedFilterOptions, setEditedFilterOptions] = useState({
    factory: searchParams.get('factory') || '',
    productionLine: searchParams.get('productionLine') || '',
    productionTeam: searchParams.get('productionTeam') || '',
    product: searchParams.get('product') || '1',
    date: {
      from: searchParams.get('from') || '02-01-2020',
      to: searchParams.get('to') || '02-01-2025'
    }
  })

  const startDate = filterOptions.date.from
  const endDate = filterOptions.date.to
  const factoryId = filterOptions.factory
  const lineId = filterOptions.productionLine
  const teamId = filterOptions.productionTeam
  const productId = filterOptions.product

  const { data, isPending } = useQuery({
    queryKey: ['orders', startDate, endDate, factoryId, lineId, teamId, productId],
    queryFn: () => {
      const params: any = {
        startDate,
        endDate
      }
      if (factoryId) params.factoryId = factoryId
      if (lineId) params.productionId = lineId
      if (teamId) params.teamId = teamId
      if (productId) params.productId = productId
      params.productId = productId || 0

      return getApi<{
        total: number
        result: ItemProductionReportProps[]
        pageNumber: number
        pageSize: number
        pages: number
      }>(`/Reporters/OrderProduction`, { params })
    }
  })

  useEffect(() => {
    setSearchParams({
      factory: filterOptions.factory,
      productionLine: filterOptions.productionLine,
      productionTeam: filterOptions.productionTeam,
      product: filterOptions.product,
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

  const handleExportToExcel = () => {
    if (!data) return

    const exportData = data.data.result.map((item) => ({
      'رقم الطلب': item.orderId,
      'تاريخ الإنشاء': moment(item.createAt).format('YYYY-MM-DD'),
      المصنع: item.factory,
      الخط: item.line,
      الفريق: item.team
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daily Report')
    const formattedStartDate = moment(startDate).format('YYYY-MM-DD')
    const formattedEndDate = moment(endDate).format('YYYY-MM-DD')

    const fileName = `تقرير انتاج الصنف_${formattedStartDate}_الى_${formattedEndDate}.xlsx`
    XLSX.writeFile(workbook, fileName)
  }

  const handleApplyFilters = (data) => {
    const filters = {
      factory: data.factory,
      productionLine: data.productionLine,
      productionTeam: data.productionTeam,
      product: data.product,
      date: {
        from: moment(data.date.from).format('MM-DD-YYYY') || '02/01/2020',
        to: moment(data.date.to).format('MM-DD-YYYY') || '02/01/2025'
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
          <Button onClick={handleExportToExcel} className="w-full h-full" variant="default">
            تصدير
          </Button>
        </div>
        <ItemProductionReportTable
          data={{
            orders: data?.data.result || [],
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

export default ItemProductionReport
