import { zodResolver } from '@hookform/resolvers/zod'
import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import { Textarea } from '@renderer/components/ui/textarea'
import { toast } from '@renderer/components/ui/use-toast'
import { postApi } from '@renderer/lib/http'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useForm } from 'react-hook-form'
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
  logoSrc: z.string().url('يجب أن يكون رابط صالح').optional()
})

type Schema = z.infer<typeof schema>

const NewFactory: React.FunctionComponent = () => {
  const [currentTab, setCurrentTab] = React.useState('account')

  const form = useForm<Schema>({
    resolver: zodResolver(schema)
    // defaultValues: factory
    // Uncomment and set default values if available
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
    if (currentTab === 'productionLines') {
      return
    } else if (currentTab === 'account') setCurrentTab('productionLines')
  }

  const handleBack = () => {
    if (currentTab === 'account') return
    else if (currentTab === 'productionLines') setCurrentTab('account')
  }
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: (data: Schema) => {
      return postApi('/api/factories', data)
    },
    onSuccess: () => {
      toast({
        title: 'تم الحفظ بنجاح',
        description: `تم إتمام العملية بنجاح`,
        variant: 'success'
      })
      queryClient.invalidateQueries({ queryKey: ['factories'] })
    },
    onError: () => {
      toast({
        title: 'فشلت عملية الحفظ',
        description: `حصل خطأ ما`,
        variant: 'destructive'
      })
    }
  })

  const onSubmit = (data: Schema) => {
    console.log(data)
    mutate(data)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <section className="bg-white p-5">
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
                <TabsTrigger value="productionLines">خطوط الانتاج</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <main className="flex flex-col text-base font-medium text-zinc-700">
                  <section className="flex flex-col w-full max-md:max-w-full">
                    <div className="flex flex-wrap gap-3 items-center w-full max-md:max-w-full">
                      <FormField
                        control={form.control}
                        name="factoryName"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="اسم المصنع" label="اسم المصنع" />
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
                              <Input {...field} placeholder="موقع المصنع" label="موقع المصنع" />
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
                              <Textarea {...field} placeholder="ملاحظات" />
                            </FormControl>
                            <FormMessage>{fieldState?.error?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>
                </main>
              </TabsContent>
              <TabsContent value="productionLines">Change your productionLines here.</TabsContent>
            </Tabs>
          </section>
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
            {currentTab !== 'productionLines' && (
              <div className="hover:marker:" onClick={handleNext}>
                <div className="flex justify-end">
                  <Button type="button" size="lg">
                    التالي
                  </Button>
                </div>
              </div>
            )}
            {currentTab === 'productionLines' && (
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
            )}
          </div>
        </form>
      </Form>
    </>
  )
}

export default NewFactory
