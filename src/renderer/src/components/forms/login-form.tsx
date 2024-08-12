import { zodResolver } from '@hookform/resolvers/zod'
import { postApi } from '@renderer/lib/http'
import { cn } from '@renderer/lib/utils'
import { LogInResponse } from '@renderer/types/api'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useSignIn } from 'react-auth-kit'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import * as z from 'zod'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { useToast } from '../ui/use-toast'

const Schema = z.object({
  email: z.string().email({ message: 'يرجى أدخال أسم المستخدم' }),
  password: z.string().min(1, { message: 'يرجى أدخال كلمة المرور' })
})

type UserFormValue = z.infer<typeof Schema>

const LoginForm = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const signIn = useSignIn()

  const form = useForm<UserFormValue>({
    resolver: zodResolver(Schema)
  })
  const [delayedSubmitting, setDelayedSubmitting] = useState(form.formState.isSubmitting)

  // login
  const onSubmit = async (data: UserFormValue) => {
    try {
      const res = await postApi<LogInResponse>('/login', {
        ...data,
        twoFactorCode: 'string',
        twoFactorRecoveryCode: 'string'
      })

      if ([200, 201].includes(res?.status as number)) {
        const signInResult = signIn({
          token: res.data.accessToken,
          expiresIn: res.data.expiresIn,
          tokenType: res.data.tokenType
          // authState:res.data["key"],
        })
        console.log(signInResult)
        if (signInResult) {
          toast({
            title: 'مرحباً مجدداً',
            description: 'تم تسجيل الدخول بنجاح',
            variant: 'success'
          })
          navigate('/')
        } else {
          toast({
            title: 'حصل خطأ ما',
            description: 'حاول تسجيل الدخول مجدداً',
            variant: 'destructive'
          })
        }
      }
    } catch (error) {
      toast({
        title: 'حصل خطأ',
        description: 'حاول تسجيل الدخول مجدداً',
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
                name="email"
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

            <Link to="#" className="text-sm font-medium text-primary">
              نسيت كلمة المرور ؟
            </Link>
            <Button
              // onClick={(e) => e.preventDefault()}
              className="!mt-4 !h-12 w-full hover:bg-[#ca8d2a]"
              type="submit"
            >
              تسجيل الدخول
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default LoginForm
