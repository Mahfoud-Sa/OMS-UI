import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import { getApi } from '@renderer/lib/http'
import { DailyReportInfo } from '@renderer/types/api'
import { useQuery } from '@tanstack/react-query'
import { Box, Boxes } from 'lucide-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import * as XLSX from 'xlsx'
import FilterSheet from './components/filter-sheet'
import ReceiptDatesReportTable from './receipt-dates-report-table'
export interface ReceiptDatesReportProps {
  id: number
  billNo: string
  name: string
  createAt: string
  costPrice: string
  sellingPrice: string
  deliveryAt: string
}

const ReceiptDatesReport: React.FC<DailyReportInfo> = ({ returnReportCards }: DailyReportInfo) => {
  const [openSheet, setOpenSheet] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const [filterOptions, setFilterOptions] = useState({
    factory: searchParams.get('factory') || '',
    productionLine: searchParams.get('productionLine') || '',
    productionTeam: searchParams.get('productionTeam') || '',
    date: {
      from: searchParams.get('from') || '02-01-2020',
      to: searchParams.get('to') || '02-01-2025'
    }
  })
  const [editedFilterOptions, setEditedFilterOptions] = useState({
    factory: searchParams.get('factory') || '',
    productionLine: searchParams.get('productionLine') || '',
    productionTeam: searchParams.get('productionTeam') || '',
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

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ['orders', 'receipt-dates', startDate, endDate, factoryId, productionId, teamId],
    queryFn: () =>
      getApi<ReceiptDatesReportProps[]>(`/Reporters/DeliveryDates`, {
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
  useEffect(() => {
    if (isSuccess && data) {
      const cards = [
        {
          title: `${moment(startDate).format('DD-MM-YYYY')} الى ${moment(endDate).format('DD-MM-YYYY')}`,
          value: `${data.data.length}`, // Replace with the actual icon component
          icon: Boxes,
          iconClassName: 'text-[#041016]', // Replace with the actual class name
          iconBgWrapperColor: 'bg-blue-100' // Replace with the actual color
        },
        {
          title: 'اجمالي قيمة قيمة البيع',
          value: data.data.reduce((acc, item) => acc + parseInt(item.sellingPrice), 0),
          icon: Box,
          iconClassName: 'text-[#041016]', // Replace with the actual class name
          iconBgWrapperColor: 'bg-blue-100' // Replace with the actual color
        },
        {
          title: 'اجمالي قيمة تكلفة الشراء',
          value: data.data.reduce((acc, item) => acc + parseInt(item.costPrice), 0),
          icon: Box,
          iconClassName: 'text-[#041016]', // Replace with the actual class name
          iconBgWrapperColor: 'bg-blue-100' // Replace with the actual color
        }
      ]
      returnReportCards(cards)
    }
  }, [isSuccess, data, returnReportCards])

  if (isPending)
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <Loader size={40} color={'#DA972E'} />
      </div>
    )

  const handleExportToExcel = () => {
    if (!data) return

    const exportData = data.data.map((item) => ({
      id: item.id,
      'رقم الفاتوره': item.billNo,
      الاسم: item.name,
      'تاريخ الانشاء': moment(item.createAt).format('YYYY-MM-DD'),
      'تاريخ التسليم': moment(item.deliveryAt).format('YYYY-MM-DD'),
      'تكلفة الشراء': item.costPrice,
      'تكلفة البيع': item.sellingPrice
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daily Report')
    const formattedStartDate = moment(startDate).format('YYYY-MM-DD')
    const formattedEndDate = moment(endDate).format('YYYY-MM-DD')

    const fileName = `تقرير تواريخ التسليم_${formattedStartDate}_الى_${formattedEndDate}.xlsx`
    XLSX.writeFile(workbook, fileName)
  }

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
