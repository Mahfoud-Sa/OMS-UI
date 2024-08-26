import { zodResolver } from '@hookform/resolvers/zod'
import ProfileUploader from '@renderer/components/file-uploader/ProfileUploader'
import BackBtn from '@renderer/components/layouts/back-btn'
import InformationCard from '@renderer/components/layouts/InformationCard'
import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import Dropdown from '@renderer/components/ui/dropdown'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import * as z from 'zod'
import imageProfile from '../../../assets/images/profile.jpg'
import './info-user.css'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes

const schema = z.object({
  Username: z
    .string({ message: 'مطلوب' })
    .min(3, 'يجب أن يكون أكبر من 3 أحرف')
    .max(100, 'يجب أن يكون أقل من 100 حرف'),
  FirstName: z
    .string({ message: 'مطلوب' })
    .min(3, 'يجب أن يكون أكبر من 3 أحرف')
    .max(100, 'يجب أن يكون أقل من 100 حرف'),
  LastName: z
    .string({ message: 'مطلوب' })
    .min(3, 'يجب أن يكون أكبر من 3 أحرف')
    .max(100, 'يجب أن يكون أقل من 100 حرف'),
  Password: z
    .string({ message: 'مطلوب' })
    .min(3, 'يجب أن يكون أكبر من 3 أحرف')
    .max(10, 'يجب أن يكون أقل من 10 حرف')
    .optional(),
  PhoneNumber: z.string({ message: 'مطلوب' }),
  UserType: z.string({ message: 'مطلوب' }), // 1 = Admin , 2 = b, 3= منسق طلبات
  EmployDate: z.string({ message: 'مطلوب' }),
  WorkPlace: z
    .string({ message: 'مطلوب' })
    .min(3, 'يجب أن يكون أكبر من 3 أحرف')
    .max(10, 'يجب أن يكون أقل من 10 حرف'),
  UserRole: z.string({ message: 'مطلوب' }),
  ImageFile: z
    .instanceof(File)
    .refine(
      (file) => {
        return file.size <= MAX_FILE_SIZE
      },
      {
        message: `جم الصور يجب أن يكون أقل من 5 ميجابايت`
      }
    )
    .optional()
})

export type Schema = z.infer<typeof schema>

const InfoUser = () => {
  const [isEdit, setIsEdit] = useState(false)
  const { id } = useParams()
  const [currentTab, setCurrentTab] = useState('personalInfo')

  const { data, isPending } = useQuery({
    queryKey: ['users', id],
    queryFn: () => getApi<Schema>(`users/${id}`)
  })

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: data?.data
  })

  const onSubmit = () => {
    console.log('form.getValues()', form.getValues())
  }

  const userTypes = [
    { label: 'آدمن', value: 1 },
    { label: 'بائع', value: 2 },
    { label: 'منسق طلبات', value: 3 }
  ]
  const getLabelByValue = (value: number) => {
    const userType = userTypes.find((type) => {
      return type.value === value
    })

    return userType ? userType.label : 'Unknown'
  }
  const handleNext = () => {
    if (currentTab === 'permissions') {
      return
    } else if (currentTab === 'personalInfo') setCurrentTab('workInfo')
    else if (currentTab === 'workInfo') setCurrentTab('permissions')
  }

  const handleBack = () => {
    if (currentTab === 'personalInfo') return
    else if (currentTab === 'permissions') setCurrentTab('workInfo')
    else if (currentTab === 'workInfo') setCurrentTab('personalInfo')
  }

  if (isPending)
    return (
      <div className="flex justify-center items-center bg-white rounded-lg min-h-[800px] shadow-sm">
        <Loader size={50} color="#DA972E" />
      </div>
    )

  return (
    <section className="p-5">
      <BackBtn href="/users" />
      <InformationCard
        displayButton={false}
        logoSrc={imageProfile}
        infoItems={[
          {
            text: form.getValues('FirstName') + ' ' + form.getValues('LastName') || 'الاسم الاول'
          },
          {
            text: form.getValues('Username') || 'الاسم الاول',
            iconSrc: 'user'
          },
          {
            text: getLabelByValue(Number(form.getValues('UserType'))) || 'المسمى الوظيفي',
            iconSrc: 'briefcaseBusiness'
          }
        ]}
        id={id || ''}
        className="mb-14"
      />

      <div className="mt-10">
        <Form {...form}>
          <form className="flex gap-4 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="bg-white p-5 custom-margin rounded-lg shadow-sm">
              <div className="flex justify-end">
                <Button type="button" onClick={() => setIsEdit((prev) => !prev)}>
                  {!isEdit ? 'تعديل' : 'عرض'}
                </Button>
              </div>

              <Tabs value={currentTab} defaultValue="personalInfo" className="custom-margin">
                <TabsList
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    backgroundColor: 'transparent'
                  }}
                >
                  <TabsTrigger value="personalInfo">المعلومات الشخصية</TabsTrigger>
                  <TabsTrigger value="workInfo">معلومات العمل</TabsTrigger>
                  <TabsTrigger value="permissions">الصلاحيات</TabsTrigger>
                </TabsList>

                <TabsContent value="personalInfo">
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="col-span-3 mb-1">
                      <FormField
                        control={form.control}
                        name="ImageFile"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div>
                                <ProfileUploader
                                  className="h-[180px] w-[180px]"
                                  inputId="file"
                                  setValue={form.setValue}
                                  onChange={async (files) => {
                                    try {
                                      if (!files?.[0]) return
                                      field.onChange(files[0])
                                    } catch (error) {
                                      JSON.stringify(error)
                                    }
                                  }}
                                  defaultImage={imageProfile}
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
                      name="FirstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              disabled={!isEdit}
                              {...field}
                              placeholder="الاسم الاول"
                              martial
                              label="الاسم الاول"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="LastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              disabled={!isEdit}
                              {...field}
                              placeholder="اسم العائلة"
                              martial
                              label="اسم العائلة"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="Username"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              disabled={!isEdit}
                              {...field}
                              placeholder="اسم المستخدم"
                              martial
                              label="اسم المستخدم"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="PhoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEdit}
                              placeholder="رقم الهاتف"
                              martial
                              label="رقم الهاتف"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="workInfo">
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <FormField
                      control={form.control}
                      name="WorkPlace"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              disabled={!isEdit}
                              {...field}
                              placeholder="مكان العمل"
                              martial
                              label="مكان العمل"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="EmployDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              disabled={!isEdit}
                              type="date"
                              {...field}
                              placeholder="تاربخ التوظيف"
                              martial
                              label="تاربخ التوظيف"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="permissions">
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <FormField
                      name="UserType"
                      control={form.control}
                      render={({ field: { onChange, value } }) => (
                        <FormItem>
                          <FormControl>
                            <Dropdown
                              disabled={!isEdit}
                              label="نوع المستخدم"
                              getLabel={(option) => option.label}
                              getValue={(option) => option.value}
                              onChange={onChange}
                              groups={[
                                {
                                  label: 'نوع المستخدم',
                                  options: [
                                    {
                                      label: 'آدمن',
                                      value: 1
                                    },
                                    {
                                      label: 'بائع',
                                      value: 2
                                    },
                                    {
                                      label: 'منسق طلبات',
                                      value: 3
                                    }
                                  ]
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
                      name="UserRole"
                      control={form.control}
                      render={({ field: { onChange, value } }) => (
                        <FormItem>
                          <FormControl>
                            <Dropdown
                              disabled={!isEdit}
                              label="المسمى الوظيفي"
                              getLabel={(option: { label: string; id: string }) =>
                                option.label || ''
                              }
                              getValue={(option: { label: string; id: string }) => option.id || ''}
                              onChange={onChange}
                              groups={[
                                {
                                  label: 'المسمى الوظيفي',
                                  options: [
                                    {
                                      label: 'مدير',
                                      id: '1'
                                    },
                                    {
                                      label: 'موظف',
                                      id: '2'
                                    },
                                    {
                                      label: 'منسق',
                                      id: '3'
                                    }
                                  ]
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
                </TabsContent>
              </Tabs>
            </div>
            <div className="flex flex-row gap-2 justify-end">
              {currentTab !== 'personalInfo' && (
                <div className="hover:marker:" onClick={handleBack}>
                  <div className="flex justify-end">
                    <Button type="button" size="lg">
                      السابق
                    </Button>
                  </div>
                </div>
              )}
              {currentTab !== 'permissions' && (
                <div className="hover:marker:" onClick={handleNext}>
                  <div className="flex justify-end">
                    <Button type="button" size="lg">
                      التالي
                    </Button>
                  </div>
                </div>
              )}
              {isEdit && currentTab === 'permissions' && (
                <div className="flex justify-end">
                  <Button type="submit" size="lg">
                    حفظ
                  </Button>
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>
    </section>
  )
}

export default InfoUser
