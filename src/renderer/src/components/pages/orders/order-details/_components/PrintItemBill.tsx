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
import { cn } from '@renderer/lib/utils'
import { Item, Order } from '@renderer/types/api'
import { useQuery } from '@tanstack/react-query'
import { Mail, MapPin, Phone, Printer } from 'lucide-react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import print_logo from '../.,/../../../../../assets/images/print_logo.svg'

const PrintItemBill = () => {
  const { id, itemId } = useParams()
  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({ contentRef })
  const [item, setItem] = useState<Item | null>(null)
  const { data, isPending, isError, error, isSuccess } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getApi<Order>(`/Orders/${id}`)
  })

  useEffect(() => {
    if (data) {
      if (itemId) {
        const newItem = data.data.items.find((item) => item.id == +itemId)
        if (newItem) {
          setItem(newItem)
        }
      }
    }
  }, [isSuccess])

  if (isPending)
    return (
      <div className="flex justify-center items-center bg-white rounded-lg min-h-[800px] shadow-sm">
        <Loader size={50} color="#DA972E" />
      </div>
    )

  if (isError) return <p>{error.message}</p>

  return (
    <div className="">
      <BackBtn href={`/orders/${id}`} />
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
            <p className="text-3xl font-bold">فاتورة المنتج</p>
            <img src={print_logo} className="size-[65px]" />
          </header>
          <section className="print-body mt-7">
            <div className="flex justify-between mt-4">
              <div className="flex gap-x-2">
                <div>
                  <p className="font-semibold">أسم العميل</p>
                  <p>{data.data.customerName}</p>
                  <p className="mt-2 font-semibold">رقم العميل</p>
                  <p style={{ direction: 'ltr' }}>{data.data.customerNo}</p>
                  <p className="font-semibold">المصنع</p>
                  <p>{item?.factoryName}</p>
                </div>
                <div>
                  <p className=" font-semibold">خط الإنتاج</p>
                  <p>{item?.timelines[item.timelines.length - 1].productionLineName || ''}</p>
                  <p className="mt-2 font-semibold">الفرقة</p>
                  <p>{item?.timelines[item.timelines.length - 1].productionTeamName || ''}</p>
                </div>
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
                  {new Date(data.data.deliveryAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-6 print:mt-3">
              <Table className="!overflow-hidden">
                <TableHeader className="pt-32">
                  <TableRow>
                    <TableCell className=" text-right font-bold">رقم</TableCell>
                    <TableCell className="text-right font-bold">وصف المنتج</TableCell>
                    <TableCell className="text-right font-bold">الكمية</TableCell>
                    <TableCell className="text-right font-bold">التصميم</TableCell>
                    <TableCell className="text-right font-bold">قماش</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">01</TableCell>
                    <TableCell>{item?.productName}</TableCell>
                    <TableCell>{item?.quantity}</TableCell>
                    <TableCell>{item?.productDesignName}</TableCell>
                    <TableCell>{item?.fabric} </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 print:mt-0">
              <h4 className="font-semibold mt-3">ملاحظة المنتج</h4>
              <p>{item?.note}</p>
            </div>
            <div className="mt-4 print:mt-0">
              <h4 className="font-semibold my-2">صور المنتج</h4>
              {item?.images && item?.images.length > 0 ? (
                <div
                  className={cn('grid grid-cols-2 gap-2', {
                    'grid-cols-1 gap-0': item?.images.length == 1
                  })}
                >
                  {item?.images.map((url, index) => (
                    <Fragment key={index}>
                      <img
                        className={cn('w-full h-[200px] object-fill', {
                          'h-[300px]': item?.images.length == 1
                        })}
                        src={url}
                        alt="item_image"
                      />
                    </Fragment>
                  ))}
                </div>
              ) : (
                <p className="text-sm">لا يوجد صور للمنتج</p>
              )}
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

export default PrintItemBill
