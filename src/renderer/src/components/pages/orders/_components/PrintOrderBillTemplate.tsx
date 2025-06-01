/* eslint-disable react/prop-types */
import print_logo from '@renderer/assets/images/print_logo.svg'
import Loader from '@renderer/components/layouts/loader'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHeader,
    TableRow
} from '@renderer/components/ui/table'
import { getApi } from '@renderer/lib/http'
import { Order } from '@renderer/types/api'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

interface PrintOrderBillTemplateProps {
  orderId: number | string
  onLoaded?: () => void
}

const PrintOrderBillTemplate: React.FC<PrintOrderBillTemplateProps> = ({ orderId, onLoaded }) => {
  const { data, isPending, isError, isSuccess } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getApi<Order>(`/Orders/${orderId}`),
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  // Call onLoaded when the data is successfully loaded
  useEffect(() => {
    if (isSuccess && onLoaded) {
      onLoaded()
    }
  }, [isSuccess, onLoaded])

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <Loader size={40} color="#DA972E" />
      </div>
    )
  }

  if (isError || !data) {
    return <div>حدث خطأ أثناء تحميل بيانات الطلب</div>
  }

  const order = data.data

  return (
    <div className="bg-white p-5 w-[210mm]" dir="rtl">
      <header className="flex justify-between flex-wrap items-center mb-2 print-header">
        <p className="text-3xl font-bold">فاتورة الطلب</p>
        <img src={print_logo} className="size-[65px]" />
      </header>
      <section className="print-body mt-7">
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="font-semibold">أسم العميل</p>
            <p>{order.customerName}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p>
              <span className="font-semibold">الرقم التسلسلي</span> : <span>{order.id}</span>
            </p>
            <p>
              <span className="font-semibold">رقم الفاتوره</span> :{' '}
              <span>{order.billNo.split('-').reverse().join('-')}</span>
            </p>
            <p>
              <span className="font-semibold">تاريخ الطلب</span> :{' '}
              {new Date(order.createAt).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">تاريخ التسليم المتوقع</span> :{' '}
              {new Date(order.readyAt).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">تاريخ التسليم</span> :{' '}
              {order.deliveryAt ? new Date(order.deliveryAt).toLocaleDateString() : 'لم يسلم بعد'}
            </p>
          </div>
        </div>
        <div className="mt-6 print:mt-0">
          <Table>
            <TableHeader className="hidden print:table-header-group bg-transparent">
              <TableRow>
                <TableCell className="h-[2.3cm] border-none"></TableCell>
              </TableRow>
            </TableHeader>
            <TableHeader className="pt-32">
              <TableRow>
                <TableCell className="text-right font-bold">اسم المنتج</TableCell>
                <TableCell className="text-right font-bold">الكمية</TableCell>
                <TableCell className="text-right font-bold">التصميم</TableCell>
                <TableCell className="text-right font-bold">قماش</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.productDesignName}</TableCell>
                  <TableCell className="text-right">{item.fabric} </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="hidden print:table-footer-group bg-transparent">
              <TableRow>
                <TableCell className="h-[2.3cm] border-none"></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <div className="mt-4 print:mt-0">
          <h4 className="font-semibold">ملاحظة التوصيل:</h4>
          <p> {order.deliveryNote}.</p>

          <h4 className="font-semibold mt-3">ملاحظة الطلب:</h4>
          <p>{order.note}.</p>
          <h4 className="font-semibold mt-3">توقيع العميل:</h4>
          <div className="mt-2 h-[100px] w-[300px] bg-gray-100 rounded-lg"></div>
        </div>
        <div className="flex justify-end">
          <p className="p-2 rounded w-[200px]">
            <span className="font-bold text-lg">قيمة الشراء</span> : {order.sellingPrice} ر.س
          </p>
        </div>
        <div className="flex justify-end">
          <p className="p-2 rounded w-[200px]">
            <span className="font-bold text-lg">قيمة التكلفة</span> : {order.costPrice} ر.س
          </p>
        </div>
        <div className="flex justify-end">
          <p className="bg-[#DA972E26] p-2 rounded w-[200px]">
            <span className="font-bold text-lg">فرق التكلفة</span> :{' '}
            {order.sellingPrice - order.costPrice} ر.س
          </p>
        </div>
      </section>
    </div>
  )
}

export default PrintOrderBillTemplate
