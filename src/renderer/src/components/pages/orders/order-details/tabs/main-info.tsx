import { zodResolver } from '@hookform/resolvers/zod'
import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { PhoneInput } from '@renderer/components/ui/phone-input'
import { Textarea } from '@renderer/components/ui/textarea'
import { toast } from '@renderer/components/ui/use-toast_1'
import { getApi, patchApi } from '@renderer/lib/http'
import { gotRole } from '@renderer/lib/utils'
import { Order, Roles } from '@renderer/types/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAuthUser } from 'react-auth-kit'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import * as z from 'zod'
const schema = z.object({
  costPrice: z.coerce
    .number({ message: 'يرجى إدخال رقم صحيح.' })
    .min(0, { message: 'يجب أن يكون المبلغ صفرًا أو أكثر.' })
    .optional(),
  deliveryNote: z.string().max(100, 'الملاحظة يجب ان تكون اقصر من ١٠٠ حرف').optional()
})

export type Schema = z.infer<typeof schema>

const MainInfo = () => {
  const queryClient = useQueryClient()
  const authUser = useAuthUser()
  const userType = authUser()?.userType as string
  const { id } = useParams()

  const { data, isPending, error, isError, isSuccess } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getApi<Order>(`/Orders/${id}`)
  })

  const form = useForm<Schema>({
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    if (data?.data) {
      form.reset({
        ...data.data,
        costPrice: data.data.costPrice
      })
    }
  }, [isSuccess])

  const { mutate, isPending: costPriceIsPending } = useMutation({
    mutationFn: async (data: Schema) => {
      await patchApi(`/Orders/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] })
      toast({
        variant: 'success',
        title: `تم التعديل الطلب بنجاح`
      })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'فشلت العملية',
        description: 'تأكد من صحة البيانات المدخله أو لا يوجد أتصال بالشبكة'
      })
    }
  })
  const { mutate: mutateDeliveryNote, isPending: deliveryNotePending } = useMutation({
    mutationFn: async (data: Schema) => {
      await patchApi(`/Orders/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] })
      toast({
        variant: 'success',
        title: `تم التعديل الطلب بنجاح`
      })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'فشلت العملية',
        description: 'تأكد من صحة البيانات المدخله أو لا يوجد أتصال بالشبكة'
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
    <section className="mt-3">
      <div className="grid grid-cols-3 gap-3">
        <Input disabled={true} value={data.data.id} martial label="رقم الطلب" />
        <Input
          disabled={true}
          value={data.data.billNo}
          placeholder="رقم الفاتورة"
          martial
          label="رقم الفاتورة"
        />
        <Input
          disabled={true}
          value={data.data.customerName}
          placeholder="اسم العميل"
          martial
          label="اسم العميل"
        />
        {/* <Input
          disabled={true}
          value={data.data.customerNo}
          placeholder="رقم العميل"
          martial
          label="رقم العميل"
        /> */}
        <PhoneInput
          value={data.data.customerNo}
          countries={['SA']}
          defaultCountry="SA"
          maxLength={16}
          className="flex-row-reverse rounded-sm"
          labels={{
            SA: 'السعودية'
          }}
          title="رقم العميل"
          placeholder="5********"
          disabled
        />
        <Input
          disabled={true}
          value={new Date(data.data.createAt).toISOString().split('T')[0]}
          placeholder="تاريخ الإنشاء"
          martial
          type="date"
          label="تاريخ الإنشاء"
        />
        {data.data.deliveryAt && (
          <Input
            type="date"
            disabled={true}
            value={new Date(data.data.deliveryAt).toISOString().split('T')[0]}
            placeholder="تاريخ التسليم "
            martial
            label="تاريخ التسليم"
          />
        )}
        <Input
          type="date"
          disabled={true}
          value={new Date(data.data.readyAt).toISOString().split('T')[0]}
          placeholder="تاريخ التسليم المتوقع"
          martial
          label="تاريخ التسليم المتوقع"
        />
        {/* TODO: this input should only appear to admin and retail user.*/}
        {['مشرف', 'بائع'].includes(userType) && (
          <Input
            disabled={true}
            value={data.data.sellingPrice}
            placeholder="سعر البيع"
            martial
            label="سعر البيع"
          />
        )}
        {/* TODO: this input should be based on user role/type/permission. its only for orders manager or admin
        and only be shown to admin.
        */}

        {['مشرف', 'منسق طلبات'].includes(userType) && (
          <Form {...form}>
            <form
              className="flex justify-between gap-x-1"
              onSubmit={form.handleSubmit((data) => mutate({ costPrice: data.costPrice }))}
            >
              <FormField
                control={form.control}
                name="costPrice"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        // disabled={true}
                        // value={data.data.costPrice}
                        {...field}
                        placeholder="سعر التكلفة"
                        martial
                        label="سعر التكلفة"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="h-[56px]"
                type="submit"
                disabled={costPriceIsPending || !gotRole(Roles.UpdateOrder)}
              >
                {costPriceIsPending ? <Loader color={'#fff'} size={15} /> : 'تعديل'}
              </Button>
            </form>
          </Form>
        )}

        <div className="col-span-3">
          <Label className="font-bold text-base">ملاحظات عامه</Label>
          <Textarea disabled={true} value={data.data.note} className="bg-white mt-2" rows={10} />
        </div>
        <Form {...form}>
          <form
            className="col-span-3"
            onSubmit={form.handleSubmit((data) =>
              mutateDeliveryNote({
                deliveryNote: data.deliveryNote
              })
            )}
          >
            <FormField
              control={form.control}
              name="deliveryNote"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="col-span-3">
                      <div className="gap-3 flex items-baseline">
                        <Label className="font-bold text-base">ملاحظات التوصيل</Label>
                        <Button
                          type="submit"
                          disabled={deliveryNotePending || !gotRole(Roles.UpdateOrder)}
                        >
                          {deliveryNotePending ? <Loader color={'#fff'} size={15} /> : 'تعديل'}
                        </Button>
                      </div>
                      <Textarea
                        disabled={deliveryNotePending}
                        className="bg-white mt-2"
                        rows={10}
                        {...field}
                        value={form.getValues('deliveryNote')}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </section>
  )
}

export default MainInfo
