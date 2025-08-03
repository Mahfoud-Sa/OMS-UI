import { zodResolver } from '@hookform/resolvers/zod'
import BackBtn from '@renderer/components/layouts/back-btn'
import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { toast } from '@renderer/components/ui/use-toast_1'
import { getApi, postApi } from '@renderer/lib/http'
import { User } from '@renderer/types/api'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Select, { SingleValue } from 'react-select'
import * as z from 'zod'

const schema = z.object({
  userId: z.string().nonempty('مطلوب'),
  adminPassword: z.string().nonempty('مطلوب'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  employDate: z.string().optional()
})

export type Schema = z.infer<typeof schema>

const fetchUsers = async () => {
  const response = await getApi<{
    users: User[]
    total: number
    page_number: number
    size: number
    pages: number
  }>('/users?pageSize=10000000')
  return response.data.users
}

const fetchUser = async (userId: string) => {
  const response = await getApi<User>(`/users/${userId}`)
  return response.data
}

const ResetPassword = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const form = useForm<Schema>({
    resolver: zodResolver(schema)
  })

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  })

  const userId = form.watch('userId')
  const { isSuccess, data } = useQuery<User, Error>({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId
  })

  // Set selected user when query is successful
  useEffect(() => {
    if (isSuccess && data) {
      setSelectedUser(data)
    }
  }, [isSuccess, data])

  const handleUserChange = (option) => {
    console.log('Option:', option)
    form.setValue('userId', option)
  }

  const onSubmit = async (data: Schema) => {
    try {
      const formData = new FormData()
      formData.append('adminPassword', data.adminPassword)
      const response = await postApi(`/Users/${data.userId}/RecetPassword`, formData)
      if (response.status === 200) {
        toast({
          title: 'تم تغيير كلمة المرور بنجاح',
          variant: 'success'
        })
        setShowDialog(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <section className="p-5">
      <div className="mb-3 flex items-start justify-between">
        <BackBtn href={`/users`} />
      </div>
      <div className="mt-10">
        <Form {...form}>
          <form className="flex gap-4 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="bg-white p-5 rounded-lg shadow-sm min-h-[400px]">
              <h1 className="font-bold">إعادة تعيين كلمة المرور</h1>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {users && users.length > 0 && (
                  <FormField
                    control={form.control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select<User>
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                height: '5.2vh',
                                borderRadius: '0.5rem'
                              })
                            }}
                            {...field}
                            options={
                              users?.map((user) => ({
                                ...user,
                                label: user.userName,
                                value: user // Keep the entire user object
                              })) || []
                            }
                            onChange={(selectedOption: SingleValue<User>) => {
                              field.onChange(selectedOption?.userName)
                              handleUserChange(selectedOption?.id)
                            }}
                            value={users?.find((user) => user.id === field.value) || null}
                            placeholder="اختر المستخدم" // spell-checker: disable-line
                            isSearchable
                            getOptionLabel={(option) => option.userName}
                            getOptionValue={(option) => option.id}
                            pageSize={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          label={'الاسم الاول'}
                          {...field}
                          value={selectedUser?.firstName || ''}
                          disabled
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          label={'اسم العائلة'}
                          {...field}
                          value={selectedUser?.lastName || ''}
                          disabled
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          label={'رقم الهاتف'}
                          {...field}
                          value={selectedUser?.phoneNumber || ''}
                          disabled
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          label={'تارخ التوظيف'}
                          {...field}
                          value={selectedUser?.employDate || ''}
                          disabled
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                size="lg"
                className="hover:bg-orange-600"
                onClick={() => {
                  if (selectedUser) {
                    setShowDialog(true)
                  }
                }}
              >
                تأكيد
              </Button>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>تأكيد تغيير كلمة المرور</DialogTitle>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="adminPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          label={'كلمة مرور المشرف'}
                          {...field}
                          type="password"
                          placeholder="كلمة مرور المشرف"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button className="mx-2" type="button" variant={'outline'}>
                      الغاء
                    </Button>
                  </DialogClose>

                  <Button onClick={form.handleSubmit(onSubmit)} type="submit">
                    تأكيد
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </form>
        </Form>
      </div>
    </section>
  )
}

export default ResetPassword
