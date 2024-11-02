import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import { toast } from '@renderer/components/ui/use-toast'
import { patchApi } from '@renderer/lib/http'
import { useMutation } from '@tanstack/react-query'
import { Check, LucideHand, Printer, X } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import AddTimeLineDialog from '../_components/AddTimeLineDialog'

const Timeline = () => {
  const { id } = useParams()
  const navigate = useNavigate()

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
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'فشلت العملية',
        description: 'تأكد من صحة البيانات قد تكون مكرره أو لا يوجد أتصال بالشبكة'
      })
    }
  })
  const { mutate: completeOrderMutate, isPending: completeOrderIsPending } = useMutation({
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
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'فشلت العملية',
        description: 'تأكد من صحة البيانات قد تكون مكرره أو لا يوجد أتصال بالشبكة'
      })
    }
  })

  return (
    <section>
      <div className="flex gap-2 justify-end">
        <Button
          className="flex bg-red-600 hover:bg-red-700  gap-2"
          disabled={cancelOrderIsPending}
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
          disabled={completeOrderIsPending}
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
      <div className="my-2 shadow-sm border rounded-sm p-3">
        <div className="flex justify-between items-center">
          <h1 className="font-bold test-lg">أسم المنتج: حمزة عمر بعلا</h1>
          <AddTimeLineDialog id="1" />
        </div>
        <div className="flex gap-3 flex-wrap my-2 shadow-sm border px-3 pt-3  rounded-sm">
          <div className="flex gap-2">
            <div className=" flex justify-center items-center bg-green-600 h-[50px] w-[50px] rounded-full">
              <Check size={25} stroke="#fff" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-medium">أستلام الطلب</h3>
              <p className="text-[#ABB7C2] text-sm">04:41:02</p>
            </div>
          </div>

          <div className="flex gap-2 border-b-2 border-primary pb-2">
            <div className=" font-bold flex justify-center items-center border-2 border-primary h-[45px] w-[45px] rounded-full text-primary">
              02
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold text-primary">أستلام الطلب</h3>
              <p className="text-[#ABB7C2] text-sm">02/25/2000</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Timeline
