import { zodResolver } from '@hookform/resolvers/zod'
import { localizeRoles } from '@renderer/components/constant'
import ProfileUploader from '@renderer/components/file-uploader/ProfileUploader'
import InformationCard from '@renderer/components/layouts/InformationCard'
import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import Dropdown from '@renderer/components/ui/dropdown'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { PhoneInput } from '@renderer/components/ui/phone-input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/ui/table'
import { toast } from '@renderer/components/ui/use-toast_1'
import { getApi, postApi, putApi } from '@renderer/lib/http'
import { User } from '@renderer/types/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Eye, EyeOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuthUser } from 'react-auth-kit'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
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
  Password: z.string({ message: 'مطلوب' }).optional(),
  PhoneNumber: z
    .string()
    .regex(/^\+9665\d{8}$/, 'يجب أدخال رقم الهاتف بشكل صحيح')
    .optional(),
  userType: z.string().optional(),
  EmployDate: z.string().optional(),
  WorkPlace: z.string({ message: 'مطلوب' }),

  ImageFile: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: 'حجم الصور يجب أن يكون أقل من 5 ميجابايت'
    })
    .refine((file) => file.type.startsWith('image/'), {
      message: 'يجب أن تكون الصورة من نوع صورة (JPEG, PNG, GIF, إلخ)'
    })
    .optional()
})
export type Schema = z.infer<typeof schema>

const UserProfile = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [userRoles, setUserRoles] = useState<string[]>([])
  const authUser = useAuthUser()

  const [isEdit, setIsEdit] = useState(false)
  const [oldImage, setOldImage] = useState('')
  const queryClient = useQueryClient()
  const { id } = useParams()

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ['users', id],
    queryFn: () => getApi<User>(`/Account/Profile`)
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
        PhoneNumber: data.data.phoneNumber,
        userType: data.data.userType
      })
      setUserRoles(data.data.roles)
      console.log(data.data.roles)
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
      data.PhoneNumber && formData.set('phoneNumber', data.PhoneNumber)
      formData.set('workPlace', data.WorkPlace)
      data.userType && formData.set('userType', data.userType)
      if (data.ImageFile) {
        formData.set('imageFile', data.ImageFile)
      }

      await putApi(`/Account/Profile`, formData)
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: `تم تعديل ${form.getValues('Username')} بنجاح`
      })

      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error: any) => {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'فشلت العملية',
        description: 'تأكد من صحة البيانات قد تكون مكرره أو لا يوجد أتصال بالشبكة'
      })
    }
  })

  const { mutate: mutateChangPassWord, isPending: isPendingChangPassWord } = useMutation({
    mutationFn: async (data: string) => {
      const formData = new FormData()
      formData.append('adminPassword', data)
      await postApi(`/Users/${authUser()?.id}/RecetPassword`, formData)
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: `تم تغيير كلمة السر بنجاح يرجى تسجيل الدخول مرة أخرى`
      })
      form.setValue('Password', '')
    },
    onError: (error: any) => {
      console.error(error)
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
            text: form.getValues('userType') || 'المسمى الوظيفي',
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
              {userRoles.includes('Update Profile') && (
                <Button type="button" onClick={() => setIsEdit((prev) => !prev)}>
                  {!isEdit ? 'تعديل' : 'عرض'}
                </Button>
              )}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {isEdit && (
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
              )}

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
                      <PhoneInput
                        value={field.value}
                        onChange={(value) => {
                          console.log(value)
                          form.setValue('PhoneNumber', value)
                        }}
                        countries={['SA']}
                        defaultCountry="SA"
                        maxLength={13}
                        className="flex-row-reverse rounded-sm"
                        labels={{
                          SA: 'السعودية'
                        }}
                        title="رقم العميل"
                        placeholder="5********"
                        disabled={!isEdit}
                      />
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
          {userRoles.includes('Change Password') && (
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

                <Button
                  type="button"
                  disabled={!isEdit || isPendingChangPassWord}
                  onClick={() => mutateChangPassWord(form.getValues('Password')!)}
                  className="w-[100px] h-[56px]"
                >
                  {isPendingChangPassWord ? <Loader color={'#fff'} size={15} /> : ' إعادة ضبط'}
                </Button>
              </div>
            </div>
          )}

          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold">الصلاحيات</h1>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <FormField
                name="userType"
                control={form.control}
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormControl>
                      <Dropdown
                        disabled={true}
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
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الرقم</TableHead>
                      <TableHead className="text-right">اسم الدور</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userRoles.map((ur, index) => (
                      <TableRow key={index}>
                        <TableCell>{(index + 1).toString().padStart(2, '0')}</TableCell>
                        <TableCell>{localizeRoles[ur]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            {isEdit && (
              <Button type="submit" disabled={isPendingSubmit} size="lg">
                {isPendingSubmit ? <Loader color={'#fff'} size={15} /> : 'حفظ'}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </section>
  )
}

export default UserProfile
