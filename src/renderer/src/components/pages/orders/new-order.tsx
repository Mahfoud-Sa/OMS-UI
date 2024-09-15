import { zodResolver } from '@hookform/resolvers/zod'
import ProfileUploader from '@renderer/components/file-uploader/ProfileUploader'
import BackBtn from '@renderer/components/layouts/back-btn'
import { Button } from '@renderer/components/ui/button'
import Dropdown from '@renderer/components/ui/dropdown'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { Textarea } from '@renderer/components/ui/textarea'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import preview from '../../../assets/images/preview.jpg'

const schema = z.object({
  name: z.string(),
  file: z.instanceof(File).optional()
})

export type Schema = z.infer<typeof schema>

const NewOrder = ({ initValues }: { initValues?: Schema }) => {
  //   const { data: departments } = useQuery<Department[]>({
  //     queryKey: ['departments'],
  //     queryFn: () => getApi('/Department')
  //   })

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: initValues
  })

  const onSubmit = () => {}

  return (
    <section className="p-5">
      <BackBtn href="/orders" />
      <div className="mt-10">
        <Form {...form}>
          <form className="flex gap-4 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h1 className="text-2xl font-bold">البيانات الأساسية</h1>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="col-span-3 mb-1">
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div>
                            <ProfileUploader
                              className="h-[180px] w-[180px]"
                              inputId="file"
                              defaultImage={preview}
                              setValue={form.setValue}
                              onChange={async (files) => {
                                try {
                                  if (!files?.[0]) return
                                  field.onChange(files[0])
                                } catch (error) {
                                  JSON.stringify(error)
                                }
                              }}
                            />
                            <FormMessage />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="رقم العميل" martial label="رقم العميل" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="name"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormControl>
                        <Dropdown
                          label="اسم البائع"
                          getLabel={(option: { name: string; id: string }) => option.name || ''}
                          getValue={(option: { name: string; id: string }) => option.id || ''}
                          onChange={onChange}
                          groups={[
                            {
                              label: 'اسم البائع',
                              options: []
                            }
                          ]}
                          value={value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="اسم الفرع" martial label="اسم الفرع" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="اسم العميل" martial label="اسم العميل" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="name"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormControl>
                        <Dropdown
                          label="فرقة العمل"
                          getLabel={(option: { name: string; id: string }) => option.name || ''}
                          getValue={(option: { name: string; id: string }) => option.id || ''}
                          onChange={onChange}
                          groups={[
                            {
                              label: 'فرقة العمل',
                              options: []
                            }
                          ]}
                          value={value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h1 className="text-2xl font-bold">قائمة الأصناف</h1>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormControl>
                        <Dropdown
                          label="اسم الصنف"
                          getLabel={(option: { name: string; id: string }) => option.name || ''}
                          getValue={(option: { name: string; id: string }) => option.id || ''}
                          onChange={onChange}
                          groups={[
                            {
                              label: 'اسم الصنف',
                              options: []
                            }
                          ]}
                          value={value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="name"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormControl>
                        <Dropdown
                          label="نوع الصنف"
                          getLabel={(option: { name: string; id: string }) => option.name || ''}
                          getValue={(option: { name: string; id: string }) => option.id || ''}
                          onChange={onChange}
                          groups={[
                            {
                              label: 'نوع الصنف',
                              options: []
                            }
                          ]}
                          value={value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="نوع القماش" martial label="نوع القماش" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="الكمية"
                          martial
                          label="الكمية"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="ملاحظة على الصنف"
                            martial
                            label="ملاحظة على الصنف"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormControl>
                          <Textarea
                            className="bg-white"
                            rows={15}
                            {...field}
                            placeholder="ملاحظات عامة"
                          ></Textarea>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg">
                حفظ
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  )
}

export default NewOrder
