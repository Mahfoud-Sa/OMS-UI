import { zodResolver } from '@hookform/resolvers/zod'
import BackBtn from '@renderer/components/layouts/back-btn'
import { Button } from '@renderer/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import * as z from 'zod'

const schema = z
  .object({
    password: z.string(),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmPassword']
  })

export type Schema = z.infer<typeof schema>

const ResetPassword = ({ initValues }: { initValues?: Schema }) => {
  const { id } = useParams<{ id: string }>()
  const [showPassword, setShowPassword] = useState(false)
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: initValues
  })

  const onSubmit = (data: Schema) => {
    // Handle password reset logic here
    console.log('User ID:', id)
    console.log('Form Data:', data)
  }

  return (
    <section className="p-5">
      <BackBtn href="/users" />
      <div className="mt-10">
        <Form {...form}>
          <form className="flex gap-4 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="bg-white p-5 rounded-lg shadow-sm min-h-[300px]">
              <h1 className="font-bold">إعادة تعيين كلمة المرور</h1>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="كلمة السر الجديدة"
                            martial
                            type={showPassword ? 'text' : 'password'}
                            label={
                              <span>
                                كلمة السر الجديدة
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="تأكيد كلمة السر"
                            martial
                            type={showPassword ? 'text' : 'password'}
                            label={
                              <span>
                                تأكيد كلمة السر
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
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="lg" className="hover:bg-orange-600">
                إعادة تعيين
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  )
}

export default ResetPassword
