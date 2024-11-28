import BackBtn from '@renderer/components/layouts/back-btn'
import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
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
import { Mail, MapPin, Phone, Printer } from 'lucide-react'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import print_logo from '../.,/../../../../../assets/images/print_logo.svg'
const PrintOrderBill = () => {
  const { id } = useParams()
  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({ contentRef })

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getApi<Order>(`/Orders/${id}`)
  })

  if (isPending)
    return (
      <div className="flex justify-center items-center bg-white rounded-lg min-h-[800px] shadow-sm">
        <Loader size={50} color="#DA972E" />
      </div>
    )

  if (isError) return <p>{error.message}</p>

  return (
    <div className="">
      <div className="mb-3 flex items-start justify-between">
        <BackBtn href={`/orders/${id}`} />
      </div>
      <div className="flex justify-center">
        <Button className="flex gap-2 mb-3 mt-4 w-[210mm]" onClick={() => reactToPrintFn()}>
          طباعة
          <Printer />
        </Button>
      </div>
      <div className="flex justify-center">
        <div
          className=" bg-white rounded-lg shadow-sm p-5 w-[210mm] print:shadow-none print-container"
          ref={contentRef}
          dir="rtl"
        >
          <header className="flex justify-between flex-wrap items-center mb-2 print-header">
            <p className="text-3xl font-bold">فاتورة الطلب</p>
            <img src={print_logo} className="size-[65px]" />
          </header>
          <section className="print-body mt-7">
            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="font-semibold">أسم العميل</p>
                <p>{data.data.customerName}</p>
                <p className="mt-2 font-semibold">رقم العميل</p>
                <p style={{ direction: 'ltr' }}>{data.data.customerNo}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p>
                  <span className="font-semibold">رقم الفاتوره</span> :{' '}
                  <span>{data.data.billNo.split('-').reverse().join('-')}</span>
                </p>
                <p>
                  <span className="font-semibold">تاريخ الطلب</span> :{' '}
                  {new Date(data.data.createAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">تاريخ التسليم</span> :{' '}
                  {data.data.deliveryAt
                    ? new Date(data.data.deliveryAt).toLocaleDateString()
                    : 'لم يسلم بعد'}
                </p>
              </div>
            </div>
            <div className="mt-6 print:mt-0">
              <Table>
                <TableHeader className="hidden print:table-header-group bg-transparent">
                  <TableRow>
                    <TableCell className="h-[2.3cm]  border-none "></TableCell>
                  </TableRow>
                </TableHeader>
                <TableHeader className="pt-32">
                  <TableRow>
                    <TableCell className=" text-right font-bold">رقم</TableCell>
                    <TableCell className="text-right font-bold">اسم المنتج</TableCell>
                    <TableCell className="text-right font-bold">الكمية</TableCell>
                    <TableCell className="text-right font-bold">التصميم</TableCell>
                    <TableCell className="text-right font-bold">قماش</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {(index + 1).toString().padStart(2, '0')}
                      </TableCell>

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
              <h4 className="font-semibold">ملاحظة التوصيل</h4>
              <p> {data.data.deliveryNote}</p>

              <h4 className="font-semibold mt-3">ملاحظة الطلب</h4>
              <p>{data.data.note}</p>
            </div>
            <div className="flex justify-end">
              <p className="p-2 rounded w-[200px]">
                <span className="font-bold text-lg">قيمة الشراء</span> : {data.data.sellingPrice}{' '}
                ر.س
              </p>
            </div>
            <div className="flex justify-end">
              <p className="p-2 rounded w-[200px]">
                <span className="font-bold text-lg">قيمة التكلفة</span> : {data.data.costPrice} ر.س
              </p>
            </div>
            <div className="flex justify-end">
              <p className="bg-[#DA972E26] p-2 rounded w-[200px]">
                <span className="font-bold text-lg">فرق التكلفة</span> :{' '}
                {data.data.sellingPrice - data.data.costPrice} ر.س
              </p>
            </div>
          </section>

          <footer className="footer flex w-full justify-between items-center mt-4 border-t pt-4 print-footer">
            <div className="flex items-center gap-2">
              <img src={print_logo} className=" size-[40px]" />
              <p>نظام إدارة الطلبات (OMS)</p>
            </div>
            <div className="flex items-center gap-5">
              <div className="text-[#434749] flex items-center gap-1">
                <MapPin size={17} />
                <span className="text-sm font-medium">الرياض - شارع الملك عبدالله</span>
              </div>
              <div className="text-[#434749] flex items-center gap-1">
                <Phone size={17} />
                <span>50555454</span>
              </div>
              <div className="text-[#434749] flex items-center gap-1">
                <Mail size={17} />
                <span>test@example.com</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default PrintOrderBill
