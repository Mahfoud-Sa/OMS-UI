import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import { getApi, postApi } from '@renderer/lib/http'
import { cn } from '@renderer/lib/utils'
import { LogInResponse, User } from '@renderer/types/api'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useSignIn } from 'react-auth-kit'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as z from 'zod'
import Loader from '../layouts/loader'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { useToast } from '../ui/use-toast_1'

const passwordSchema = z
  .object({
    newPassword: z.string().min(8, { message: 'كلمة المرور يجب أن تكون على الأقل 8 أحرف' }),
    confirmNewPassword: z.string().min(8, { message: 'كلمة المرور يجب أن تكون على الأقل 8 أحرف' })
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmNewPassword']
  })

type PasswordFormValues = z.infer<typeof passwordSchema>

const PasswordChangeDialog = ({
  isOpen,
  onClose,
  onSubmit
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (newPassword: string, confirmPassword: string) => Promise<void>
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema)
  })

  const handleSubmit = async (data: PasswordFormValues) => {
    setIsSubmitting(true)
    await onSubmit(data.newPassword, data.confirmNewPassword)
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="text-center">
          <DialogTitle>تعيين كلمة المرور</DialogTitle>
        </DialogHeader>

        <label className="text-center">عيين كلمة المرور الخاصة بك</label>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="relative my-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        label={'كلمة المرور الجديدة'}
                        placeholder="New Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute left-3 top-1/2 -translate-y-1/2 transform cursor-pointer p-2 text-lg"
              >
                {showPassword ? (
                  <EyeOff size={23} color="#434749" />
                ) : (
                  <Eye size={23} color="#434749" />
                )}
              </button>
            </div>
            <div className="relative my-4">
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm New Password"
                        label={'تاكيد كلمة المرور الجديدة'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute left-3 top-1/2 -translate-y-1/2 transform cursor-pointer p-2 text-lg"
              >
                {showPassword ? (
                  <EyeOff size={23} color="#434749" />
                ) : (
                  <Eye size={23} color="#434749" />
                )}
              </button>
            </div>
            <DialogFooter>
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader color="#fff" size={20} /> : 'حفظ'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

const Schema = z.object({
  username: z.string().min(1, { message: 'يرجى أدخال أسم المستخدم' }),
  password: z.string().min(1, { message: 'يرجى أدخال كلمة المرور' })
})

type UserFormValue = z.infer<typeof Schema>

const LoginForm = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isPasswordChangeRequired, setIsPasswordChangeRequired] = useState(false)
  const signIn = useSignIn()

  const form = useForm<UserFormValue>({
    resolver: zodResolver(Schema)
  })
  const [delayedSubmitting, setDelayedSubmitting] = useState(form.formState.isSubmitting)

  const { mutateAsync } = useMutation({
    mutationFn: async (id: string) => {
      return await getApi<User>(`/users/${id}`)
    },
    retry: 3 // Retries the mutation 3 times before failing
  })

  // login
  const onSubmit = async (data: UserFormValue) => {
    try {
      setDelayedSubmitting(true)
      const res = await postApi<LogInResponse>(
        '/Account/Login',
        {
          ...data
        },
        {
          headers: {
            Authorization: ''
          }
        }
      )

      if (res?.status === 200 && res.data.message === 'Password change required') {
        setIsPasswordChangeRequired(true)
        return
      }

      if ([200, 201].includes(res?.status as number)) {
        signIn({
          token: res.data.token,
          expiresIn: 8640,
          tokenType: 'Bearer'
        })
        const userData = await mutateAsync(res?.data.id || '0')

        const signInResult = signIn({
          token: res.data.token,
          expiresIn: 8640,
          tokenType: 'Bearer',
          authState: {
            ...userData.data
          }
        })

        console.log(signInResult)
        if (signInResult) {
          toast({
            title: 'مرحباً مجدداً',
            description: 'تم تسجيل الدخول بنجاح',
            variant: 'success'
          })
          navigate('/orders')
        } else {
          toast({
            title: 'حصل خطأ ما',
            description: 'حاول تسجيل الدخول مجدداً',
            variant: 'destructive'
          })
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      if (error.status === 400 || error.status === 401) {
        toast({
          title: 'حصل خطأ',
          description: 'أسم المستخدم أو كلمة المرور غير صحيحة',
          variant: 'destructive'
        })
      } else if (error.response) {
        // Server responded with a status other than 2xx
      } else if (error.request) {
        // Request was made but no response received
        toast({
          title: 'حصل خطأ',
          description: 'لم يتم تلقي رد من الخادم. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.',
          variant: 'destructive'
        })
      }
      // if the evn is development you can login using default token
      // if (process.env.NODE_ENV === 'development') {
      //   signIn({
      //     token: 'default-token',
      //     expiresIn: 360000,
      //     tokenType: 'Bearer'
      //   })
      //   navigate('/')
      // }
    } finally {
      setDelayedSubmitting(false)
    }
  }

  const handlePasswordChangeSubmit = async (newPassword: string, confirmPassword: string) => {
    try {
      const res = await postApi(`/Account/ChangePassword/${form.getValues('username')}`, {
        newPassword,
        confirmPassword
      })

      if (res?.status === 200) {
        toast({
          title: 'تم تغيير كلمة المرور',
          description: 'تم تغيير كلمة المرور بنجاح. يرجى تسجيل الدخول بكلمة المرور الجديدة',
          variant: 'success'
        })
        alert('تم تغيير كلمة المرور بنجاح')
        setIsPasswordChangeRequired(false)
      } else {
        toast({
          title: 'حصل خطأ',
          description: 'لم يتم تغيير كلمة المرور. يرجى المحاولة مرة أخرى',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Password change error:', error)
      toast({
        title: 'Error',
        description: 'There was an error changing your password. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="flex justify-center mt-4">
      <div className="w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn('w-full space-y-4', {
              'pointer-events-none opacity-50': delayedSubmitting
            })}
          >
            <div className="w-full mb-3 flex flex-col gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="">
                      <Input
                        martial
                        label="أسم المستخدم"
                        placeholder="أسم المستخدم"
                        {...field}
                        className="bg-primary/5"
                        InputClassName="!h-12 w-[382px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          martial
                          label="كلمة المرور"
                          placeholder="كلمة المرور"
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                          disabled={delayedSubmitting}
                          className="bg-primary/5"
                          InputClassName="!h-12 w-[382px]"
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
                  </FormItem>
                )}
              />
            </div>

            <Button
              className="!mt-4 !h-12 w-full hover:bg-[#ca8d2a]"
              type="submit"
              disabled={delayedSubmitting}
            >
              {delayedSubmitting ? (
                <Loader color="#fff" size={20} /> // You can replace this with an actual loader component or spinner
              ) : (
                'تسجيل الدخول'
              )}
            </Button>
          </form>
        </Form>
        <PasswordChangeDialog
          isOpen={isPasswordChangeRequired}
          onClose={() => setIsPasswordChangeRequired(false)}
          onSubmit={handlePasswordChangeSubmit}
        />
      </div>
    </div>
  )
}

export default LoginForm
