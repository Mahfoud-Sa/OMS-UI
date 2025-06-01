import BackBtn from '@renderer/components/layouts/back-btn'
import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from '@renderer/components/ui/table_custom'
import { getApi } from '@renderer/lib/http'
import { Order } from '@renderer/types/api'
import { useQuery } from '@tanstack/react-query'
import { Printer } from 'lucide-react'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import print_logo from '../.,/../../../../../assets/images/print_logo.svg'

const PrintItemBill = () => {
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
          className="bg-white rounded-lg shadow-sm p-5 w-[210mm] print:shadow-none print-container"
          ref={contentRef}
          dir="rtl"
        >
          <header className="flex justify-between flex-wrap items-center mb-2 print-header print:sticky print:top-0 print:bg-white print:mb-4 print:pb-2 print:border-b">
            <p className="text-3xl font-bold">فاتورة المنتج</p>
            <img src={print_logo} className="size-[65px]" />
          </header>
          <section className="print-body mt-4">
            <div className="flex justify-between mt-4 print:mb-4">
              <div className="flex gap-x-2">
                <div>
                  <p className="font-semibold">أسم العميل: </p>
                  <p>{data.data.customerName}.</p>
                  <p className="font-semibold">المصنع: </p>
                  <p>{data.data.items[0]?.factoryName}.</p>
                </div>
                <div>
                  <p className="font-semibold">خط الانتاج:</p>
                  <p>{data.data.items[0]?.timelines[0]?.productionLineName || ''}.</p>
                  <p className="mt-2 font-semibold">الفرقة:</p>
                  <p>{data.data.items[0]?.timelines[0]?.productionTeamName || ''}.</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p>
                  <span className="font-semibold">الرقم التسلسلي</span> :{' '}
                  <span>{data.data.id}</span>
                </p>
                <p>
                  <span className="font-semibold">رقم الفاتوره</span> :{' '}
                  <span>{data.data.billNo}</span>
                </p>
                <p>
                  <span className="font-semibold">تاريخ الطلب</span> :{' '}
                  {new Date(data.data.createAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">تاريخ التسليم المتوقع</span> :{' '}
                  {new Date(data.data.readyAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">تاريخ التسليم</span> :{' '}
                  {data.data.deliveryAt
                    ? new Date(data.data.deliveryAt).toLocaleDateString()
                    : 'لم يسلم بعد'}
                </p>
              </div>
            </div>
            <div className="mt-4 print:mt-0">
              <Table className="!overflow-hidden border-collapse">
                <TableHeader className="print:table-header-group border-r">
                  <TableRow>
                    <TableCell className="text-right font-bold border-r">اسم المنتج</TableCell>
                    <TableCell className="text-right font-bold border-r">التصميم</TableCell>
                    <TableCell className="text-right font-bold border-r">الكمية</TableCell>
                    <TableCell className="text-right font-bold border-r">قماش</TableCell>
                    <TableCell className="text-right font-bold border-r">الوصف</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className=" border-r">{item.productName}</TableCell>
                      <TableCell className=" border-r">{item.productDesignName}</TableCell>
                      <TableCell className=" border-r">{item.quantity}</TableCell>
                      <TableCell className=" border-r">{item.fabric}</TableCell>
                      <TableCell className=" border-r align-top">
                        <div className="space-y-2">
                          {item.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${item.productName} ${index + 1}`}
                              className="w-40 h-40 object-fill"
                            />
                          ))}
                          {item.note && <p className="text-sm">{item.note}</p>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrintItemBill
