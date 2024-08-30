import { zodResolver } from '@hookform/resolvers/zod'
import InformationCard from '@renderer/components/layouts/InformationCard'
import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import { Textarea } from '@renderer/components/ui/textarea'
import { toast } from '@renderer/components/ui/use-toast'
import { getApi, putApi } from '@renderer/lib/http'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { z } from 'zod'

const schema = z.object({
  factoryName: z
    .string()
    .min(3, 'يجب أن يكون أكبر من 3 أحرف')
    .max(100, 'يجب أن يكون أقل من 100 حرف'),
  factoryLocation: z
    .string()
    .min(3, 'يجب أن يكون أكبر من 3 أحرف')
    .max(100, 'يجب أن يكون أقل من 100 حرف'),
  creationDate: z.string().min(10, 'يجب أن يكون تاريخ صالح'),
  totalTeams: z.string().min(3, 'يجب أن يكون أكبر من 1 حرف'),
  notes: z.string().optional(),
  logoSrc: z.string().url('يجب ان تكون الصورة صحيحة').optional()
})

type Schema = z.infer<typeof schema>

const getFactoryDetails = async (factoryId?: string): Promise<Schema> => {
  if (!factoryId) throw new Error('Factory ID is required')
  const response = await getApi(`/factory/${factoryId}`)
  return response?.data as Schema // Extract the data from the AxiosResponse
}

const FactoryDetails: React.FunctionComponent = () => {
  const { factoryId } = useParams<{ factoryId: string }>()
  const [isEdit, setIsEdit] = React.useState(false)
  if (!factoryId) setIsEdit(false)
  const [currentTab, setCurrentTab] = React.useState('account')
  const {
    data: factory,
    isLoading,
    error
  } = useQuery<Schema, Error>({
    queryKey: ['factory', factoryId],
    queryFn: () => getFactoryDetails(factoryId)
  })
  if (error) {
    console.error(error)
  }

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: factory
  })
  const { errors } = form.formState
  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast({
        title: 'خطأ في التحقق',
        description: 'يرجى التحقق من الحقول المدخلة',
        variant: 'destructive'
      })
    }
  }, [errors])

  const handleNext = () => {
    if (currentTab === 'reports') {
      return
    } else if (currentTab === 'account') setCurrentTab('password')
    else if (currentTab === 'password') setCurrentTab('reports')
  }

  const handleBack = () => {
    if (currentTab === 'account') return
    else if (currentTab === 'password') setCurrentTab('account')
    else if (currentTab === 'reports') setCurrentTab('password')
  }
  const queryClient = useQueryClient()
  // update method
  const { mutate, isPending } = useMutation({
    mutationFn: (data: Schema) => {
      return putApi(`/factory/${factoryId}`, data)
    },
    onSuccess: () => {
      toast({
        title: 'تم الحفظ بنجاح',
        description: `تم إتمام العملية بنجاح`,
        variant: 'success'
      })
      queryClient.invalidateQueries({ queryKey: ['factory', factoryId] })
    },
    onError: (error, variables, context) => {
      console.log(error)
      toast({
        title: 'فشلت عملية الحفظ',
        description: `حصل خطأ ما`,
        variant: 'destructive'
      })
    }
  })

  const onSubmit = (data: Schema) => {
    console.log(data)
    // Assume this is your API utility function
    mutate(data)
  }

  return (
    <>
      <section>
        {factoryId && (
          <InformationCard
            id={factoryId}
            logoSrc={factory?.logoSrc || 'https://via.placeholder.com/100'}
            actionType="method"
            buttonAction={() => console.log('Button action')}
            buttonText="اطبع التقرير"
            infoItems={[
              {
                text: factory?.factoryName || 'Factory Name'
              },
              {
                text: factory?.creationDate || '2021-09-01',
                iconSrc: 'calendarTick'
              },
              {
                text: factory?.factoryLocation || 'Factory Location',
                iconSrc: 'mapPin'
              }
            ]}
          />
        )}
      </section>
      <section className="bg-white p-5">
        {factoryId && (
          <div className="flex justify-end">
            <Button type="button" onClick={() => setIsEdit((prev) => !prev)}>
              {!isEdit ? 'تعديل' : 'الغاء التعديل'}
            </Button>
          </div>
        )}
        <Form {...form}>
          <main className="flex flex-col text-base font-medium text-zinc-700">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs value={currentTab} defaultValue="account">
                <TabsList
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    backgroundColor: 'transparent'
                  }}
                >
                  <TabsTrigger value="account">المعلومات الاساسية</TabsTrigger>
                  <TabsTrigger value="password">خطوط الانتاج</TabsTrigger>
                  <TabsTrigger value="reports">التقارير</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                  <section className="flex flex-col w-full max-md:max-w-full">
                    <div className="flex flex-wrap gap-3 items-center w-full max-md:max-w-full">
                      <FormField
                        control={form.control}
                        name="factoryName"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                disabled={!isEdit}
                                {...field}
                                placeholder="اسم المصنع"
                                label="اسم المصنع"
                              />
                            </FormControl>
                            <FormMessage>{fieldState?.error?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="creationDate"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="date"
                                disabled={!isEdit}
                                {...field}
                                placeholder="تاريخ الانشاء"
                                label="تاريخ الانشاء"
                              />
                            </FormControl>
                            <FormMessage>{fieldState?.error?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="factoryLocation"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                disabled={!isEdit}
                                {...field}
                                placeholder="موقع المصنع"
                                label="موقع المصنع"
                              />
                            </FormControl>
                            <FormMessage>{fieldState?.error?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="items-center mt-5">
                      <FormField
                        control={form.control}
                        name="totalTeams"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea disabled={!isEdit} {...field} placeholder="عدد الفرق" />
                            </FormControl>
                            <FormMessage>{fieldState?.error?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>
                  {!isEdit && currentTab === 'reports' && (
                    <div className="flex justify-end">
                      <Button type="submit" className="bg-green-500 hover:bg-green-700" size="lg">
                        حفظ
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="password">Change your password here.</TabsContent>
                <TabsContent value="reports">Change your reports here.</TabsContent>
              </Tabs>
              <div className="flex mt-2 flex-row gap-2 justify-end">
                {currentTab !== 'account' && (
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
            </form>
          </main>
        </Form>
      </section>
    </>
  )
}

export default FactoryDetails
