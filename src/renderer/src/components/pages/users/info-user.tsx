import { zodResolver } from '@hookform/resolvers/zod'
import { localizeRoles } from '@renderer/components/constant'
import ProfileUploader from '@renderer/components/file-uploader/ProfileUploader'
import TrushSquare from '@renderer/components/icons/trush-square'
import BackBtn from '@renderer/components/layouts/back-btn'
import InformationCard from '@renderer/components/layouts/InformationCard'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import { toast } from '@renderer/components/ui/use-toast_1'
import { getApi, putApi } from '@renderer/lib/http'
import { gotRole } from '@renderer/lib/utils'
import { Role } from '@renderer/types'
import { User } from '@renderer/types/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
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
  LastName: z.string().optional(),
  PhoneNumber: z
    .string()
    .regex(/^\+9665\d{8}$/, 'يجب أدخال رقم الهاتف بشكل صحيح')
    .optional(),
  UserType: z.string({ message: 'مطلوب' }),
  EmployDate: z.string().optional(),
  WorkPlace: z.string({ message: 'مطلوب' }),
  UserRole: z
    .array(z.object({ id: z.string(), name: z.string() }))
    .min(1, 'يجب أن يكون لديك دور واحد على الأقل'),
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

const InfoUser = () => {
  const [isEdit, setIsEdit] = useState(false)
  const [oldImage, setOldImage] = useState('')
  const [userType, setUserType] = useState<null | string>()
  const [userRoles, setUserRoles] = useState<Role[]>([])
  const [role, setRole] = useState<Role | undefined>(undefined)
  const queryClient = useQueryClient()

  const { id } = useParams()
  const [currentTab, setCurrentTab] = useState('personalInfo')

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ['users', id],
    queryFn: () => getApi<User>(`/users/${id}`)
  })

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
      setUserRoles([...userRoles, ...userTypeRole.data])

      form.setValue('UserRole', userTypeRole.data)
    }
  }, [userTypeRole])

  useEffect(() => {
    if (userType) {
      refetch()
    }
  }, [userType])

  const form = useForm<Schema>({
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    if (isSuccess) {
      const newUserRoles = data.data.roles.map((el, index) => {
        return {
          id: index.toString(),
          name: el
        }
      })
      form.reset({
        FirstName: data.data.firstName,
        LastName: data.data.lastName,
        Username: data.data.userName,
        WorkPlace: data.data.workPlace,
        EmployDate: data.data.employDate,
        UserRole: newUserRoles,
        UserType: data.data.userType,
        PhoneNumber: data.data.phoneNumber
      })
      setOldImage(data.data.imagePath)

      setUserRoles(newUserRoles)
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
      userRoles.forEach((el) => {
        formData.append('newRoles', el.name)
      })
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
  const isImportant = (role: string) => {
    /* if role is in [
0
:
"Get Products"
1
:
"Get Order"
2
:
"Get Orders"
3
:
"Get Factories"
4
:
"Add Order"
5
:
"Get Factory"
6
:
"Add Factory"
7
:
"Add Product"
8
:
"Get Product"]' then the roles is important and return a text for that*/
    if (
      [
        'Get Products',
        'Get Order',
        'Get Orders',
        'Get Factories',
        'Add Order',
        'Get Factory',
        'Add Factory',
        'Add Product',
        'Get Product'
      ].includes(role)
    ) {
      return 'هذا الصلاحية مهمة لاضافة الطلب'
    }
    return ''
  }

  const handleAddRole = (role: Role) => {
    const findUserRole = userRoles.find((el) => el.name == role.name)
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

  if (isPending)
    return (
      <div className="flex justify-center items-center bg-white rounded-lg min-h-[800px] shadow-sm">
        <Loader size={50} color="#DA972E" />
      </div>
    )

  return (
    <section className="p-5">
      <div className="mb-3 flex items-start justify-between">
        <BackBtn href={`/users`} />
      </div>
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

      <div className="mt-10">
        <Form {...form}>
          <form className="flex gap-4 flex-col" id="form-1" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex justify-end">
                <Button type="button" onClick={() => setIsEdit((prev) => !prev)}>
                  {!isEdit ? 'تعديل' : 'عرض'}
                </Button>
              </div>

              <Tabs value={currentTab} defaultValue="personalInfo">
                <TabsList
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    backgroundColor: 'transparent'
                  }}
                >
                  <TabsTrigger onClick={() => setCurrentTab('personalInfo')} value="personalInfo">
                    المعلومات الشخصية
                  </TabsTrigger>
                  <TabsTrigger onClick={() => setCurrentTab('workInfo')} value="workInfo">
                    معلومات العمل
                  </TabsTrigger>
                  <TabsTrigger onClick={() => setCurrentTab('permissions')} value="permissions">
                    الصلاحيات
                  </TabsTrigger>
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
                            <PhoneInput
                              type="tel"
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
                      render={({ field: { onChange } }) => (
                        <FormItem>
                          <FormControl>
                            <Dropdown
                              disabled={!isEdit}
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
                              value={data?.data.userType}
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
                          <DialogTrigger asChild disabled={!isEdit}>
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
                              options={
                                AllRoles?.data.roles.filter(
                                  (role) =>
                                    ![
                                      'Roles',
                                      'Delete Factory',
                                      'Delete Product',
                                      'Delete Order'
                                    ].includes(role.name)
                                ) || []
                              }
                              valueKey="id"
                              displayKey="name"
                              localize={localizeRoles}
                              placeholder="أختر دور"
                              emptyMessage="لم يتم العثور علئ الدور"
                              onSelect={(role) => setRole(role as Role)}
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
                        <p className="text-destructive">{form.formState.errors.UserRole.message}</p>
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
                            <TableHead className="text-right">الملاحظة</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userRoles.map((ur, index) => (
                            <TableRow key={index}>
                              <TableCell>{(index + 1).toString().padStart(2, '0')}</TableCell>
                              <TableCell>{localizeRoles[ur.name]}</TableCell>
                              <TableCell>{isImportant(ur.name)}</TableCell>
                              <TableCell className="flex justify-end ">
                                <Button
                                  type="button"
                                  onClick={() => handleRemoveRole(ur.id)}
                                  variant="ghost"
                                  disabled={!isEdit}
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
                </TabsContent>
              </Tabs>
            </div>
            <div className="flex flex-row gap-2 justify-end">
              {isEdit && (
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    form="form-1"
                    disabled={isPendingSubmit || !gotRole('Update User')}
                    size="lg"
                  >
                    {isPendingSubmit ? <Loader color={'#fff'} size={15} /> : 'حفظ'}
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
