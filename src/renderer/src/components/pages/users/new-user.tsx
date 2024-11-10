import { zodResolver } from '@hookform/resolvers/zod'
import { localizeRoles } from '@renderer/components/constant'
import ProfileUploader from '@renderer/components/file-uploader/ProfileUploader'
import TrushSquare from '@renderer/components/icons/trush-square'
import BackBtn from '@renderer/components/layouts/back-btn'
import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import { Combobox } from '@renderer/components/ui/combobox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger
} from '@renderer/components/ui/dialog'
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
import { getApi, postApi } from '@renderer/lib/http'
import { Role } from '@renderer/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Eye, EyeOff, PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
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
  PhoneNumber: z
    .string()
    .regex(/^\+9665\d{8}$/, 'يجب أدخال رقم الهاتف بشكل صحيح')
    .optional(),
  UserType: z.string({ message: 'مطلوب' }),
  EmployDate: z.string().optional(),
  WorkPlace: z.string({ message: 'مطلوب' }),
  UserRole: z.array(z.object({ id: z.string(), name: z.string() }), { message: 'مطلوب' }),
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

const NewUser = ({ initValues }: { initValues?: Schema }) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [userType, setUserType] = useState<null | string>()
  const [userRoles, setUserRoles] = useState<Role[]>([])
  const [role, setRole] = useState<Role | undefined>(undefined)

  const { data: AllRoles } = useQuery({
    queryKey: ['AllRoles'],
    queryFn: () => getApi<{ roles: Role[] }>('/Roles')
  })

  const { data: userTypeRole, refetch } = useQuery({
    queryKey: ['UserTypeRoles', userType],
    queryFn: () => getApi<Role[]>(`/${userType}`),
    enabled: false
  })

  useEffect(() => {
    if (userTypeRole) {
      setUserRoles(userTypeRole.data)
      form.setValue('UserRole', userTypeRole.data)
    }
  }, [userTypeRole])

  useEffect(() => {
    if (userType) {
      refetch()
    }
  }, [userType])

  const [showPassword, setShowPassword] = useState(false)
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: initValues
  })
  const userRoleWatcher = form.watch('UserRole')

  useEffect(() => {
    // Clear the error when designs change
    if (form.formState.errors.UserRole && userRoleWatcher && userRoleWatcher.length > 0) {
      form.clearErrors('UserRole')
    }
  }, [userRoleWatcher, form.formState.errors.UserRole, form.clearErrors])

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Schema) => {
      const formData = new FormData()
      formData.append('firstName', data.FirstName)

      data.LastName && formData.append('Lastname', data.LastName)
      formData.append('userName', data.Username)
      formData.append('password', data.Password)
      data.EmployDate && formData.append('employDate', data.EmployDate)
      data.PhoneNumber && formData.append('phoneNumber', data.PhoneNumber)
      formData.append('workPlace', data.WorkPlace)
      // console.log(data.UserRole)
      userRoles.forEach((el) => {
        formData.append('roles', el.name)
      })
      formData.append('userType', data.UserType)
      if (data.ImageFile) {
        formData.append('imageFile', data.ImageFile)
      }

      await postApi('/users', formData)
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: `تم إضافة ${form.getValues('Username')} بنجاح`
      })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      navigate('/users')
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

  const handleRemoveRole = (id: string) => {
    const filterUserRoles = userRoles.filter((el) => el.id != id)

    form.setValue('UserRole', filterUserRoles)

    setUserRoles(filterUserRoles)
  }

  const handleAddRole = (role: Role) => {
    const findUserRole = userRoles.find((el) => el.id == role.id)
    if (!findUserRole) {
      const newUserRoles = [...userRoles, role]
      toast({
        variant: 'success',
        title: `تم إضافة ${localizeRoles[role?.name]} بنجاح`
      })
      setRole(undefined)
      form.setValue('UserRole', newUserRoles)

      setUserRoles(newUserRoles)
    } else {
      toast({
        variant: 'destructive',
        title: `لم يتم الاضافة  ${localizeRoles[role?.name]} موجود بالفعل`
      })
    }
  }

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
                          maxLength={16}
                          className="flex-row-reverse rounded-sm"
                          labels={{
                            SA: 'السعودية'
                          }}
                          title="رقم العميل"
                          placeholder="5********"
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
                          onChange={(value) => {
                            onChange(value)
                            if (value == 'مشرف') {
                              setUserType('Roles/Type/admin')
                            } else if (value == 'بائع') {
                              setUserType('Roles/Type/retailer')
                            } else {
                              setUserType('Roles/Type/ordersManager')
                            }
                          }}
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
              <div>
                <div className="flex justify-between items-center mt-3">
                  <h1 className="text-xl font-bold">الأدوار</h1>
                  <div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="link"
                          className="text-lg text-primary flex items-center gap-1"
                        >
                          <PlusCircle />
                          إضافة دور
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader className="!text-center text-primary text-lg font-bold">
                          إضافة دور
                        </DialogHeader>
                        <Combobox
                          options={AllRoles?.data.roles || []}
                          valueKey="id"
                          displayKey="name"
                          placeholder="أختر دور"
                          emptyMessage="لم يتم العثور علئ الدور"
                          onSelect={(role) => setRole(role as Role)}
                          localize={localizeRoles}
                        />

                        <DialogFooter>
                          <Button
                            disabled={!role}
                            type="button"
                            onClick={() => {
                              handleAddRole(role!)
                            }}
                          >
                            إضافة
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div>
                  {form.formState.errors.UserRole && (
                    <p className="text-destructive">يجب أن يكون لديك دور واحد على الأقل</p>
                  )}
                </div>
              </div>
              <div>
                {userRoles.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الرقم</TableHead>
                        <TableHead className="text-right">اسم الدور</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userRoles.map((ur, index) => (
                        <TableRow key={index}>
                          <TableCell>{(index + 1).toString().padStart(2, '0')}</TableCell>
                          <TableCell>{localizeRoles[ur.name]}</TableCell>
                          <TableCell className="flex justify-end ">
                            <Button
                              type="button"
                              onClick={() => handleRemoveRole(ur.id)}
                              variant="ghost"
                            >
                              <TrushSquare />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
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
