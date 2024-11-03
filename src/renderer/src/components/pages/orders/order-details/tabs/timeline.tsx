import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import { toast } from '@renderer/components/ui/use-toast_1'
import { getApi, patchApi } from '@renderer/lib/http'
import { Item } from '@renderer/types/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Check, LucideHand, Printer, X } from 'lucide-react'
import moment from 'moment'
import 'moment/dist/locale/ar-ma'
import { useNavigate, useParams } from 'react-router-dom'
import AddTimeLineDialog from '../_components/AddTimeLineDialog'

const Timeline = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  moment.locale('ar-ma')

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
        variant: 'success',
        title: `تم الغاء الطلب بنجاح`
      })
      navigate('/orders')
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
      await patchApi(`/Orders/${id}`, { orderState: 3 })
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: `تم تسليم الطلب بنجاح`
      })
      navigate('/orders')
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
          disabled={cancelOrderIsPending || completeOrderIsPending}
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
          className="flex  gap-2 bg-green-600 hover:bg-green-700 "
          disabled={completeOrderIsPending || cancelOrderIsPending}
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
        <Button className="flex gap-2">
          طباعة
          <Printer />
        </Button>
      </div>

      {data.data.map((item, index) => (
        <div key={index} className="my-2 shadow-sm border rounded-sm p-3">
          <div className="flex justify-between items-center">
            <h1 className="font-bold test-lg">أسم المنتج: {item.name || item.fabric}</h1>
            <AddTimeLineDialog id={item.id.toString()} />
          </div>
          <h1 className="font-medium test-sm">أسم المصنع: {item.factoryName || item.id}</h1>
          <div className="flex gap-3 flex-wrap my-2 shadow-sm border px-3 pt-3  rounded-sm">
            {item.timelines.map((timeline, index) => (
              <div key={`${index}`}>
                {(timeline.status == 0 || timeline.status == 2) && (
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

                {timeline.status == 3 && (
                  <div className="flex gap-2 pb-2">
                    <div className=" flex justify-center items-center bg-green-600 h-[45px] w-[45px] rounded-full">
                      <Check size={25} stroke="#fff" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-medium">{timeline.productionLineName}</h3>
                      <p className="text-[#ABB7C2] text-sm">
                        {`${'انتهت خلال'}
                        ${moment(new Date(timeline.receivedAt)).from(
                          moment(new Date(timeline.deliveredAt)),
                          true
                        )}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

export default Timeline
