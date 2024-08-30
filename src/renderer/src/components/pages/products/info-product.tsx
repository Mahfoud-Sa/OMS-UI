import { zodResolver } from '@hookform/resolvers/zod'
import BackBtn from '@renderer/components/layouts/back-btn'
import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
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
  const [currentTab, setCurrentTab] = useState('general')

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
  const { errors } = form.formState
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast({
        title: 'خطأ في التحقق',
        description: 'يرجى التحقق من الحقول المدخلة',
        variant: 'destructive'
      })
    }
  }, [errors])

  useEffect(() => {
    if (isSuccess) {
      form.reset({
        name: data.data.name
      })
    }
  }, [data?.data])

  const handleNext = () => {
    if (currentTab === 'reports') {
      return
    } else if (currentTab === 'general') setCurrentTab('productStats')
    else if (currentTab === 'productStats') setCurrentTab('reports')
  }

  const handleBack = () => {
    if (currentTab === 'general') return
    else if (currentTab === 'productStats') setCurrentTab('general')
    else if (currentTab === 'reports') setCurrentTab('productStats')
  }

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
              <div className="flex justify-end">
                <Button type="button" onClick={() => setIsEdit((prev) => !prev)}>
                  {!isEdit ? 'تعديل' : 'الغاء التعديل'}
                </Button>
              </div>

              <Tabs value={currentTab} defaultValue="general">
                <TabsList
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    backgroundColor: 'transparent'
                  }}
                >
                  <TabsTrigger value="general">المعلومات العامة</TabsTrigger>
                  <TabsTrigger value="productStats">احصائيات الصنف</TabsTrigger>
                  <TabsTrigger value="reports">تقارير المنتج</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
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
                </TabsContent>
                <TabsContent value="productStats">
                  <div className="">
                    <h1 className="text-2xl font-bold">احصائيات الصنف</h1>
                    {/* Add your productStats form fields here */}
                  </div>
                </TabsContent>
                <TabsContent value="reports">
                  <div className="">
                    <h1 className="text-2xl font-bold">تقارير المنتج</h1>
                    {/* Add your reports form fields here */}
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex mt-2 flex-row gap-2 justify-end">
                {currentTab !== 'general' && (
                  <div className="hover:marker:" onClick={handleBack}>
                    <div className="flex justify-end">
                      <Button type="button" size="lg">
                        السابق
                      </Button>
                    </div>
                  </div>
                )}
                {currentTab !== 'reports' && (
                  <div className="hover:marker:" onClick={handleNext}>
                    <div className="flex justify-end">
                      <Button type="button" size="lg">
                        التالي
                      </Button>
                    </div>
                  </div>
                )}
                {currentTab === 'reports' && isEdit && (
                  <div className="hover:marker:" onClick={handleNext}>
                    <div className="flex justify-end">
                      <Button
                        disabled={isPending}
                        className="bg-green-500 hover:bg-green-700"
                        type="submit"
                        size="lg"
                      >
                        {isPending ? <Loader color="black" /> : 'حفظ'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </section>
  )
}

export default InfoProduct
