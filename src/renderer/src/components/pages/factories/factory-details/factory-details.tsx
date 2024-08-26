import { zodResolver } from '@hookform/resolvers/zod'
import InformationCard from '@renderer/components/layouts/InformationCard'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import { Textarea } from '@renderer/components/ui/textarea'
import { getApi } from '@renderer/lib/http'; // Assume this is your API utility function
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { z } from 'zod'

const schema = z.object({
  factoryName: z.string(),
  factoryLocation: z.string(),
  creationDate: z.string(),
  totalTeams: z.string(),
  productionLines: z.string(),
  notes: z.string(),
  logoSrc: z.string()
})

type Schema = z.infer<typeof schema>

const getFactoryDetails = async (factoryId?: string): Promise<Schema> => {
  if (!factoryId) throw new Error('Factory ID is required')
  const response = await getApi(`/factory/${factoryId}`)
  return response?.data as Schema // Extract the data from the AxiosResponse
}

const FactoryDetails: React.FunctionComponent = () => {
  const { factoryId } = useParams<{ factoryId: string }>()
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

  console.log(factoryId)

  const form = useForm<Schema>({
    resolver: zodResolver(schema)
    // defaultValues: factory
  })

  const onSubmit = (data: Schema) => {
    // Handle form submission
  }

  // if (isLoading) return <div>Loading...</div>
  // if error display empty form fields
  // if (error) {
  //   return (
  //     <section>
  //       <Form {...form}>
  //         <form onSubmit={form.handleSubmit(onSubmit)}>
  //           <section>
  //             <FormField
  //               control={form.control}
  //               name="factoryName"
  //               render={({ field, fieldState }) => (
  //                 <FormItem>
  //                   <FormControl>
  //                     <Input {...field} placeholder="Factory Name" label="Factory Name" />
  //                   </FormControl>
  //                   <FormMessage>{fieldState?.error?.message}</FormMessage>
  //                 </FormItem>
  //               )}
  //             />
  //           </section>
  //           <button type="submit">Submit</button>
  //         </form>
  //       </Form>
  //     </section>
  //   )
  // }

  return (
    // display factory details name and location and creation date in the top and under it display the tabs and the forms
    <>
      <section>
        <InformationCard
          id={factoryId || '1'}
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
      </section>
      <section className="bg-white p-5">
        <Tabs defaultValue="account">
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
            <Form {...form}>
              <main className="flex flex-col text-base font-medium text-zinc-700">
                <form onSubmit={form.handleSubmit(onSubmit)}>
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
                              <Input {...field} placeholder="تاريخ الانشاء" label="تاريخ الانشاء" />
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
                </form>
              </main>
            </Form>
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
          <TabsContent value="reports">Change your reports here.</TabsContent>
        </Tabs>
      </section>
    </>
  )
}

export default FactoryDetails
