import BackBtn from '@renderer/components/layouts/back-btn'
import { Button } from '@renderer/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { useToast } from '@renderer/components/ui/use-toast'
import {
  Issue,
  IssueStatuses,
  getIssueById,
  updateIssueStatus
} from '@renderer/services/issues.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

export default function IssueDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: issue, isLoading } = useQuery<Issue | undefined>({
    queryKey: ['issue', id],
    queryFn: async () => {
      if (!id) return undefined

      try {
        return await getIssueById(parseInt(id))
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'خطأ',
          description: 'حدث خطأ أثناء تحميل بيانات المشكلة'
        })
        throw error
      }
    },
    enabled: !!id
  })

  const updateStatusMutation = useMutation({
    mutationFn: async () => {
      if (!id) return
      return await updateIssueStatus(parseInt(id), IssueStatuses.RESOLVED)
    },
    onSuccess: () => {
      toast({
        title: 'تم بنجاح',
        description: 'تم تحديث حالة المشكلة بنجاح',
        variant: 'default'
      })
      queryClient.invalidateQueries({ queryKey: ['issue', id] })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحديث حالة المشكلة'
      })
    }
  })

  const handleStatusUpdate = () => {
    updateStatusMutation.mutate()
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">جاري التحميل...</div>
  }

  if (!issue) {
    return (
      <div className="container mx-auto py-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-2">المشكلة غير موجودة</h2>
              <p className="text-gray-500 mb-4">لم يتم العثور على المشكلة المطلوبة</p>
              <Button onClick={() => navigate('/issues')}>
                <ArrowRight className="ml-2 h-4 w-4" />
                العودة إلى قائمة المشكلات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4">
      <div className="mb-3 flex items-start justify-between">
        <BackBtn href="/issues" />
      </div>

      <Card>
        <CardHeader className="bg-primary-foreground">
          <CardTitle className="text-xl">تفاصيل المشكلة - {issue.id}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">معلومات أساسية</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-gray-500">الرقم:</span>
                  <span className="col-span-2">{issue.id}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-gray-500">العنوان:</span>
                  <span className="col-span-2">{issue.title}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-gray-500">رقم الفاتورة:</span>
                  <span className="col-span-2">{issue.billNo}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-gray-500">الحالة:</span>
                  <span className="col-span-2">
                    <div
                      className={`px-2 py-1 rounded-full text-center text-xs w-24 ${
                        issue.status === IssueStatuses.OPEN
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {issue.status === IssueStatuses.OPEN ? 'مفتوح' : 'تمت المعالجة'}
                    </div>
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">التواريخ</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-gray-500">تاريخ الإنشاء:</span>
                  <span className="col-span-2">
                    {new Date(issue.createdAt).toLocaleDateString('ar-SA')}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-gray-500">آخر تحديث:</span>
                  <span className="col-span-2">
                    {new Date(issue.updatedAt).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-2">الوصف</h3>
            <div className="p-4 bg-gray-50 rounded-md">{issue.description}</div>
          </div>

          <div className="mt-8 flex justify-end">
            {issue.status === IssueStatuses.OPEN && (
              <Button
                variant="default"
                onClick={handleStatusUpdate}
                disabled={updateStatusMutation.isPending}
                className="ml-2"
              >
                <CheckCircle className="ml-2 h-4 w-4" />
                {updateStatusMutation.isPending ? 'جاري المعالجة...' : 'تأكيد المعالجة'}
              </Button>
            )}
            {/* <Button variant="outline" onClick={() => navigate('/issues')} className="ml-2">
              <ArrowRight className="ml-2 h-4 w-4" />
              العودة
            </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
