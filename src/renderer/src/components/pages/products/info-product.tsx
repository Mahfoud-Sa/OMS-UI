import { zodResolver } from '@hookform/resolvers/zod'
import BackBtn from '@renderer/components/layouts/back-btn'
import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { toast } from '@renderer/components/ui/use-toast'
import { getApi, putApi } from '@renderer/lib/http'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import * as z from 'zod'

const schema = z.object({
  name: z
    .string({ message: 'مطلوب' })
    .min(3, 'يجب أن يكون أكبر من 3 أحرف')
    .max(100, 'يجب أن يكون أقل من 100 حرف')
})

export type Schema = z.infer<typeof schema>

const InfoProduct = () => {
  const [isEdit, setIsEdit] = useState(false)
  const { id } = useParams()
  const queryClient = useQueryClient()

  const {
    data,
    isPending: isPendingProducts,
    isSuccess
  } = useQuery({
    queryKey: ['products', id],
    queryFn: () => getApi<Schema>(`Products/${id}`)
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Schema) => {
      await putApi(`/Products/${id}`, data)
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: `تم تعديل ${form.getValues('name')} بنجاح`
      })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'فشلت العملية',
        description: 'تأكد من صحة البيانات قد تكون مكرره أو لا يوجد أتصال بالشبكة'
      })
    }
  })

  const form = useForm<Schema>({
    resolver: zodResolver(schema)
    // defaultValues: isSuccess ? data?.data : undefined
  })

  useEffect(() => {
    if (isSuccess) {
      form.reset({
        name: data.data.name
      })
    }
  }, [data?.data])

  const onSubmit = (data: Schema) => mutate(data)

  if (isPendingProducts)
    return (
      <div className="flex justify-center items-center bg-white rounded-lg min-h-[800px] shadow-sm">
        <Loader size={50} color="#DA972E" />
      </div>
    )

  return (
    <section className="p-5">
      <BackBtn href="/products" />
      <div className="mt-10">
        <Form {...form}>
          <form className="flex gap-4 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex justify-between">
                <h1 className="text-2xl font-bold">المعلومات العامة</h1>
                <Button type="button" onClick={() => setIsEdit((prev) => !prev)}>
                  {!isEdit ? 'تعديل' : 'عرض'}
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={!isEdit}
                          {...field}
                          placeholder="أسم المنتج"
                          martial
                          label="أسم المنتج"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {isEdit && (
              <div className="flex justify-end">
                <Button type="submit" disabled={isPending} size="lg">
                  {isPending ? <Loader color={'#fff'} size={15} /> : 'حفظ'}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </section>
  )
}

export default InfoProduct
