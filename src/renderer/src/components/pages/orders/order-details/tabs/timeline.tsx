import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import { toast } from '@renderer/components/ui/use-toast_1'
import { getApi, patchApi } from '@renderer/lib/http'
import { gotRole } from '@renderer/lib/utils'
import { Item, Order, Roles } from '@renderer/types/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, LucideHand, PackageCheck, TruckIcon, X } from 'lucide-react'
import moment from 'moment'
import 'moment/dist/locale/ar-ma'
import { useParams } from 'react-router-dom'
import AddTimeLineDialog from '../_components/AddTimeLineDialog'
import EditTimeLineDialog from '../_components/EditTimeLineDialog'

const Timeline = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()

  moment.locale('ar-ma')

  const { data: order } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getApi<Order>(`/Orders/${id}`)
  })

  const { data, isPending, error, isError } = useQuery({
    queryKey: ['time_line', id],
    queryFn: () => getApi<Item[]>(`/Orders/${id}/OrderItems`)
  })

  const { mutate: cancelOrderMutate, isPending: cancelOrderIsPending } = useMutation({
    mutationFn: async () => {
      await patchApi(`/Orders/${id}`, { orderState: 4 })
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: `تم الغاء الطلب بنجاح`
      })
      queryClient.invalidateQueries({ queryKey: ['time_line'] })
      queryClient.invalidateQueries({ queryKey: ['order', id] })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'فشلت العملية',
        description: 'تأكد من صحة البيانات قد تكون مكرره أو لا يوجد أتصال بالشبكة'
      })
    }
  })
  const { mutate: completeOrderMutate, isPending: completeOrderIsPending } = useMutation({
    mutationFn: async () => {
      await patchApi(`/Orders/${id}`, { orderState: 2 })
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: `تم اكمال الطلب بنجاح`
      })
      queryClient.invalidateQueries({ queryKey: ['time_line'] })
      queryClient.invalidateQueries({ queryKey: ['order', id] })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'فشلت العملية',
        description: 'تأكد من صحة البيانات قد تكون مكرره أو لا يوجد أتصال بالشبكة'
      })
    }
  })
  const { mutate: inDeliveryOrderMutate, isPending: inDeliveryOrderIsPending } = useMutation({
    mutationFn: async () => {
      await patchApi(`/Orders/${id}`, { orderState: 6 })
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: `تم نقل الطبدية إلى قيد التوصيل بنجاح`
      })
      queryClient.invalidateQueries({ queryKey: ['time_line'] })
      queryClient.invalidateQueries({ queryKey: ['order', id] })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'فشلت العملية',
        description: 'تأكد من صحة البيانات قد تكون مكرره أو لا يوجد أتصال بالشبكة'
      })
    }
  })
  const { mutate: deliverOrderMutate, isPending: deliverOrderIsPending } = useMutation({
    mutationFn: async () => {
      await patchApi(`/Orders/${id}`, {
        orderState: 3,
        deliveryAt: new Date(new Date().getTime() + 3 * 60 * 60 * 1000).toISOString()
      })
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: `تم تسليم الطلب بنجاح`
      })
      queryClient.invalidateQueries({ queryKey: ['time_line'] })
      queryClient.invalidateQueries({ queryKey: ['order', id] })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'فشلت العملية',
        description: 'تأكد من صحة البيانات قد تكون مكرره أو لا يوجد أتصال بالشبكة'
      })
    }
  })

  if (isPending)
    return (
      <div className="flex justify-center items-center bg-white rounded-lg min-h-[800px] shadow-sm">
        <Loader size={50} color="#DA972E" />
      </div>
    )

  if (isError) return <p>{error.message}</p>

  return (
    <section>
      <div className="flex gap-2 justify-end">
        <Button
          className="flex bg-red-600 hover:bg-red-700  gap-2"
          disabled={
            cancelOrderIsPending ||
            completeOrderIsPending ||
            deliverOrderIsPending ||
            order?.data.orderState == 4 ||
            !gotRole(Roles.UpdateOrder)
          }
          onClick={() => cancelOrderMutate()}
        >
          {cancelOrderIsPending ? (
            <Loader color={'#fff'} size={15} />
          ) : (
            <>
              الغاء الطلبية
              <X />
            </>
          )}
        </Button>
        <Button
          className="flex  gap-2 bg-blue-400 hover:bg-blue-500 "
          disabled={
            completeOrderIsPending ||
            cancelOrderIsPending ||
            deliverOrderIsPending ||
            order?.data.orderState == 4 ||
            order?.data.orderState == 3 ||
            order?.data.orderState == 2 ||
            !gotRole(Roles.UpdateOrder)
          }
          onClick={() => completeOrderMutate()}
        >
          {completeOrderIsPending ? (
            <Loader color={'#fff'} size={15} />
          ) : (
            <>
              إنتهاء التصنيع
              <LucideHand />
            </>
          )}
        </Button>
        <Button
          className="flex  gap-2 bg-orange-400 hover:bg-orange-500 "
          disabled={
            completeOrderIsPending ||
            cancelOrderIsPending ||
            deliverOrderIsPending ||
            inDeliveryOrderIsPending ||
            order?.data.orderState == 4 ||
            order?.data.orderState == 3 ||
            !gotRole(Roles.UpdateOrder)
          }
          onClick={() => inDeliveryOrderMutate()}
        >
          {completeOrderIsPending ? (
            <Loader color={'#fff'} size={15} />
          ) : (
            <>
              قيد التوصيل
              <TruckIcon />
            </>
          )}
        </Button>
        <Button
          className="flex  gap-2 bg-green-600 hover:bg-green-700 "
          disabled={
            completeOrderIsPending ||
            cancelOrderIsPending ||
            deliverOrderIsPending ||
            order?.data.orderState == 4 ||
            order?.data.orderState == 3 ||
            !gotRole(Roles.UpdateOrder)
          }
          onClick={() => deliverOrderMutate()}
        >
          {deliverOrderIsPending ? (
            <Loader color={'#fff'} size={15} />
          ) : (
            <>
              تسليم الطلب
              <PackageCheck />
            </>
          )}
        </Button>
        {/* <Button className="flex gap-2">
          طباعة
          <Printer />
        </Button> */}
      </div>

      {data.data.map((item, index) => (
        <div key={index} className="my-2 shadow-sm border rounded-sm p-3 mt-5">
          <div className="flex justify-between items-center">
            <h1 className="font-bold test-lg">أسم المنتج: {item.productName || item.fabric}</h1>
            <AddTimeLineDialog
              disabled={
                order?.data.orderState == 4 ||
                order?.data.orderState == 3 ||
                order?.data.orderState === 2 ||
                !gotRole(Roles.UpdateOrder)
              }
              id={item.id.toString()}
            />
          </div>
          <h1 className="font-medium test-sm">أسم المصنع: {item.factoryName || item.id}</h1>
          <div className="flex gap-3 flex-wrap my-2 shadow-sm border px-3 pt-3  rounded-sm">
            {item.timelines.length > 0 ? (
              item.timelines.map((timeline, index) => (
                <div key={`${index}`}>
                  {[0, 1].includes(timeline.status) && (
                    <div className="flex gap-2 border-b-2 border-primary pb-2">
                      <div className=" font-bold flex justify-center items-center border-2 border-primary h-[45px] w-[45px] rounded-full text-primary">
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-base font-semibold text-primary">
                          {timeline.productionLineName}
                        </h3>
                        <p className="text-[#ABB7C2] text-sm">
                          بدء في {new Date(timeline.receivedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {[3, 2].includes(timeline.status) && (
                    <div className="flex gap-2 pb-2">
                      <div className=" flex justify-center items-center bg-green-600 h-[45px] w-[45px] rounded-full">
                        <Check size={25} stroke="#fff" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-base font-medium">{timeline.productionLineName}</h3>
                        <p className="text-[#ABB7C2] text-sm">
                          {`${'انتهت خلال'}
                          ${moment(new Date(timeline.deliveredAt)).from(
                            moment(new Date(timeline.receivedAt)),
                            true
                          )}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {timeline.status == 4 && (
                    <div className="flex gap-2 pb-2 items-center">
                      <div className=" flex justify-center items-center bg-red-600 h-[45px] w-[45px] rounded-full">
                        <X size={25} stroke="#fff" />
                      </div>
                      <div className="flex  gap-1">
                        <h3 className="text-base font-medium">{timeline.productionLineName}</h3>
                        {/* <p className="text-[#ABB7C2] text-sm">
                          {`${'انتهت خلال'}
                          ${moment(new Date(timeline.receivedAt)).from(
                            moment(new Date(timeline.deliveredAt)),
                            true
                          )}`}
                        </p> */}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="m-3 font-bold">لا يوجد خطوط إنتاج</div>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <>
              {item.file && (
                <a
                  href={item.file}
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg text-primary flex items-center gap-1"
                >
                  <span>عرض الملف</span>
                </a>
              )}

              {item.timelines.length > 0 && (
                <EditTimeLineDialog
                  disable={
                    order?.data.orderState == 4 ||
                    order?.data.orderState == 3 ||
                    order?.data.orderState === 2 ||
                    !gotRole(Roles.UpdateOrder)
                  }
                  itemId={item.id.toString()}
                  timeLineId={item.timelines[item.timelines.length - 1].id.toString()}
                />
              )}
            </>
          </div>
        </div>
      ))}
    </section>
  )
}

export default Timeline
