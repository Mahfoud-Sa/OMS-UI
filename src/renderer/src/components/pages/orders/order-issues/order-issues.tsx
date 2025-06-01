import { zodResolver } from '@hookform/resolvers/zod'
import BackBtn from '@renderer/components/layouts/back-btn'
import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { Textarea } from '@renderer/components/ui/textarea'
import { toast } from '@renderer/components/ui/use-toast_1'
import { getApi, postApi } from '@renderer/lib/http'
import { Order } from '@renderer/types/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as z from 'zod'

const issueSchema = z.object({
  title: z.string().optional(),
  description: z.string()
})

type IssueFormValues = z.infer<typeof issueSchema>

const OrderIssues = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const form = useForm<IssueFormValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  })

  // Fetch the order details to get the billNo
  const { data: orderData, isLoading: orderLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getApi<Order>(`/Orders/${id}`)
  })

  if (!orderLoading) {
    console.log('Order Data:', orderData)
  }
  const { mutate: submitIssue, isPending: isSubmitting } = useMutation({
    mutationFn: (values: IssueFormValues) => {
      return postApi('/Issues', {
        ...values,
        orderId: id,
        billNo: orderData?.data.billNo || ''
      })
    },
    onSuccess: () => {
      toast({
        title: 'تم الإبلاغ بنجاح',
        description: 'تم إرسال البلاغ بنجاح',
        variant: 'success'
      })
      navigate(`/orders/${id}`)
    },
    onError: (error) => {
      console.error('Error submitting issue:', error)
      toast({
        title: 'فشل الإبلاغ',
        description: 'حدث خطأ أثناء إرسال البلاغ',
        variant: 'destructive'
      })
    }
  })

  const onSubmit = (values: IssueFormValues) => {
    submitIssue(values)
  }

  if (orderLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader color="black" />
      </div>
    )
  }

  return (
    <section className="p-5">
      <div className="mb-3 flex items-start justify-between">
        <BackBtn href={`/orders/${id}`} />
      </div>

      <div className="bg-white rounded-lg p-7 shadow-sm mt-6">
        <h1 className="text-2xl font-bold mb-6">الإبلاغ عن مشكلة</h1>
        <Suspense fallback={<Loader color="black" />}>
          <p className="mb-4">
            رقم الفاتوره: <span className="font-bold">{orderData?.data.billNo}</span>
          </p>
        </Suspense>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="عنوان المشكلة" martial label="عنوان المشكلة" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="وصف المشكلة"
                      className="min-h-[200px]"
                      rows={8}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary-dark"
              >
                {isSubmitting ? <Loader color="white" /> : 'إرسال البلاغ'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  )
}

export default OrderIssues
