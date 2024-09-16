import { zodResolver } from '@hookform/resolvers/zod'
import ProfileUploader from '@renderer/components/file-uploader/ProfileUploader'
import BackBtn from '@renderer/components/layouts/back-btn'
import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import Dropdown from '@renderer/components/ui/dropdown'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { toast } from '@renderer/components/ui/use-toast'
import { postApi } from '@renderer/lib/http'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as z from 'zod'
import imageProfile from '../../../assets/images/profile.jpg'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes

const schema = z.object({
  Username: z
    .string({ message: 'مطلوب' })
    .min(3, 'يجب أن يكون أكبر من 3 أحرف')
    .max(100, 'يجب أن يكون أقل من 100 حرف')
    .regex(/^[a-z]+$/, {
      message: 'يجب ان تكون حروف إنجليزية صغيرة وبدون مسافة'
    }),
  FirstName: z
    .string({ message: 'مطلوب' })
    .min(3, 'يجب أن يكون أكبر من 3 أحرف')
    .max(100, 'يجب أن يكون أقل من 100 حرف'),
  LastName: z.string().optional(),
  Password: z
    .string({ message: 'مطلوب' })
    .min(6, 'يجب أن يكون أكبر من 6 أحرف')
    .max(10, 'يجب أن يكون أقل من 10 حرف'),
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

const NewUser = ({ initValues }: { initValues?: Schema }) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  //   const { data: departments } = useQuery<Department[]>({
  //     queryKey: ['departments'],
  //     queryFn: () => getApi('/Department')
  //   })

  const [showPassword, setShowPassword] = useState(false)
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: initValues
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Schema) => {
      const formData = new FormData()
      formData.set('firstName', data.FirstName)

      data.LastName && formData.set('Lastname', data.LastName)
      formData.set('userName', data.Username)
      formData.set('password', data.Password)
      data.EmployDate && formData.set('employDate', data.EmployDate)
      data.PhoneNumber && formData.set('phoneNumber', data.PhoneNumber)
      formData.set('workPlace', data.WorkPlace)
      formData.set('userRole', data.UserRole)
      data.UserType && formData.set('userType', data.UserType)
      if (data.ImageFile) {
        formData.set('imageFile', data.ImageFile)
      }

      await postApi('/users', formData)
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: `تم إضافة ${form.getValues('Username')} بنجاح`
      })
      // form.setValue('EmployDate', '')
      // form.setValue('ImageFile', undefined)
      // form.setValue('Username', '')
      // form.setValue('LastName', '')
      // form.setValue('FirstName', '')
      // form.setValue('Password', '')
      // form.setValue('WorkPlace', '')
      // form.setValue('PhoneNumber', '')
      // form.setValue('UserRole', '')
      // form.setValue('UserType', '')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      navigate('/users')
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

  return (
    <section className="p-5">
      <BackBtn href="/users" />
      <div className="mt-10">
        <Form {...form}>
          <form className="flex gap-4 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h1 className="text-2xl font-bold">المعلومات الشخصية</h1>

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
                        <Input {...field} placeholder="الاسم الاول" martial label="الاسم الاول" />
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
                        <Input {...field} placeholder="اسم العائلة" martial label="اسم العائلة" />
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
                        <Input {...field} placeholder="اسم المستخدم" martial label="اسم المستخدم" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="كلمة السر"
                            martial
                            type={showPassword ? 'text' : 'password'}
                            label={
                              <span>
                                كلمة السر
                                <span className="text-lg font-bold text-red-600">*</span>
                              </span>
                            }
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

                <FormField
                  control={form.control}
                  name="PhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="رقم الهاتف" martial label="رقم الهاتف" />
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
                        <Input {...field} placeholder="مكان العمل" martial label="مكان العمل" />
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
              <h1 className="text-2xl font-bold">الصلاحيات</h1>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <FormField
                  name="UserRole"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormControl>
                        <Dropdown
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
                  name="UserType"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormControl>
                        <Dropdown
                          label="المسمى الوظيفي"
                          getLabel={(option: { label: string; value: string }) =>
                            option.label || ''
                          }
                          getValue={(option: { label: string; value: string }) =>
                            option.value || ''
                          }
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
                          value={value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending} size="lg">
                {isPending ? <Loader color={'#fff'} size={15} /> : 'حفظ'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  )
}

export default NewUser
