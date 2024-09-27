import { zodResolver } from '@hookform/resolvers/zod'
import ProfileUploader from '@renderer/components/file-uploader/ProfileUploader'
import InformationCard from '@renderer/components/layouts/InformationCard'
import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import Dropdown from '@renderer/components/ui/dropdown'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { Input as Input2 } from '@renderer/components/ui/input_2'
import { toast } from '@renderer/components/ui/use-toast'
import { getApi, putApi } from '@renderer/lib/http'
import { User } from '@renderer/types/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Eye, EyeOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import * as z from 'zod'
import imageProfile from '../../../assets/images/profile.jpg'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes

const schema = z.object({
  Password: z
    .string({ message: 'مطلوب' })
    .min(6, 'يجب أن يكون أكبر من 6 أحرف')
    .max(10, 'يجب أن يكون أقل من 10 حرف'),
  Username: z
    .string({ message: 'مطلوب' })
    .min(3, 'يجب أن يكون أكبر من 3 أحرف')
    .max(100, 'يجب أن يكون أقل من 100 حرف'),
  FirstName: z
    .string({ message: 'مطلوب' })
    .min(3, 'يجب أن يكون أكبر من 3 أحرف')
    .max(100, 'يجب أن يكون أقل من 100 حرف'),
  LastName: z.string().optional(),
  PhoneNumber: z.string().optional(),
  UserType: z.string().optional(),
  EmployDate: z.string().optional(),
  WorkPlace: z.string({ message: 'مطلوب' }),
  UserRole: z.string({ message: 'مطلوب' }),
  ImageFile: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: 'حجم الصور يجب أن يكون أقل من 5 ميجابايت'
    })
    .optional()
})
export type Schema = z.infer<typeof schema>

const UserProfile = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [oldImage, setOldImage] = useState('')
  const queryClient = useQueryClient()
  const { id } = useParams()

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ['users', id],
    queryFn: () => getApi<User>(`/Account/Profile/1ec1ff9c-bcc7-4205-9fa6-ae8476215e0d`)
  })

  const form = useForm<Schema>({
    resolver: zodResolver(schema)
    // defaultValues: data?.data
  })

  useEffect(() => {
    if (isSuccess) {
      form.reset({
        FirstName: data.data.firstName,
        LastName: data.data.lastName,
        Username: data.data.userName,
        WorkPlace: data.data.workPlace,
        EmployDate: data.data.employDate,
        UserRole: data.data.roles[0] || '1',
        UserType: data.data.userType,
        PhoneNumber: data.data.phoneNumber.split('+966')[1]
      })
      setOldImage(data.data.imagePath)
    }
  }, [data?.data])

  const { mutate, isPending: isPendingSubmit } = useMutation({
    mutationFn: async (data: Schema) => {
      const formData = new FormData()
      formData.set('firstName', data.FirstName)
      data.LastName && formData.set('Lastname', data.LastName)
      formData.set('userName', data.Username)
      data.EmployDate && formData.set('employDate', data.EmployDate)
      data.PhoneNumber && formData.set('phoneNumber', `+966${data.PhoneNumber}`)
      formData.set('workPlace', data.WorkPlace)
      formData.set('userRole', data.UserRole)
      data.UserType && formData.set('userType', data.UserType)
      if (data.ImageFile) {
        formData.set('imageFile', data.ImageFile)
      }

      await putApi(`/users/${id}`, formData)
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: `تم تعديل ${form.getValues('Username')} بنجاح`
      })

      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'فشلت العملية',
        description: 'تأكد من صحة البيانات قد تكون مكرره أو لا يوجد أتصال بالشبكة'
      })
    }
  })

  const onSubmit = (data: Schema) => mutate(data)

  if (isPending)
    return (
      <div className="flex justify-center items-center bg-white rounded-lg min-h-[800px] shadow-sm">
        <Loader size={50} color="#DA972E" />
      </div>
    )

  return (
    <section className="p-5">
      <InformationCard
        displayButton={false}
        logoSrc={oldImage}
        infoItems={[
          {
            text: `${form.getValues('FirstName')} ${form.getValues('LastName')}` || 'الاسم الاول'
          },
          {
            text: form.getValues('Username') || 'أسم المستخدم',
            iconSrc: 'user'
          },
          {
            text: form.getValues('UserType') || 'المسمى الوظيفي',
            iconSrc: 'briefcaseBusiness'
          }
        ]}
        id={id || ''}
        className="mb-14 mt-4"
      />

      <Form {...form}>
        <form className="flex gap-4 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">المعلومات الشخصية</h1>
              <Button type="button" onClick={() => setIsEdit((prev) => !prev)}>
                {!isEdit ? 'تعديل' : 'عرض'}
              </Button>
            </div>

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
                            inputId="ImageFile"
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
                      <div className="flex items-center w-full flex-wrap gap-2">
                        <div className="w-[83%]">
                          <Input2
                            {...field}
                            placeholder="5XX XXX XXX"
                            martial={false}
                            label="رقم الهاتف"
                            disabled={!isEdit}
                          />
                        </div>

                        <div className="bg-[#e0e0e0] font-bold w-[15%] h-[56px] flex items-center justify-center rounded-sm">
                          966+
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold">معلومات العمل</h1>

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
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-3">تغير كلمة السر</h1>
            <div className="flex gap-3">
              <div className="w-[40%]">
                <FormField
                  control={form.control}
                  name="Password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            disabled={!isEdit}
                            placeholder="كلمة السر"
                            martial
                            type={showPassword ? 'text' : 'password'}
                            label={<span>كلمة السر</span>}
                          />
                          <button
                            type="button"
                            onClick={() => handleShowPassword()}
                            className="absolute left-3 top-1/2 -translate-y-1/2 transform cursor-pointer p-2 text-lg"
                          >
                            {showPassword ? (
                              <EyeOff size={23} color="#434749" />
                            ) : (
                              <Eye size={23} color="#434749" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="button" disabled={!isEdit} className="w-[100px] h-[56px]">
                إعادة ضبط
              </Button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold">الصلاحيات</h1>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <FormField
                name="UserRole"
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
                        value={data?.data.roles[0] || '1'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="UserType"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormControl>
                      <Dropdown
                        disabled={!isEdit}
                        label="المسمى الوظيفي"
                        getLabel={(option: { label: string; value: string }) => option.label || ''}
                        getValue={(option: { label: string; value: string }) => option.value || ''}
                        onChange={onChange}
                        groups={[
                          {
                            label: 'المسمى الوظيفي',
                            options: [
                              {
                                label: 'مشرف',
                                value: 'مشرف'
                              },
                              {
                                label: 'بائع',
                                value: 'بائع'
                              },
                              {
                                label: 'منسق طلبات',
                                value: 'منسق طلبات'
                              }
                            ]
                          }
                        ]}
                        value={data?.data.userType}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end">
            {isEdit && (
              <Button type="submit" disabled={isPending} size="lg">
                {isPending ? <Loader color={'#fff'} size={15} /> : 'حفظ'}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </section>
  )
}

export default UserProfile