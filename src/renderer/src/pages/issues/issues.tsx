import { Button } from '@renderer/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@renderer/components/ui/table'
import { useToast } from '@renderer/components/ui/use-toast'
import { getIssues } from '@renderer/services/issues.service'
import { useQuery } from '@tanstack/react-query'
import { Eye, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Issues() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [pageSize] = useState(10)
  const [pageIndex, setPageIndex] = useState(0)

  const { data: issues, isLoading } = useQuery({
    queryKey: ['issues', pageIndex, pageSize],
    queryFn: async () => {
      try {
        return await getIssues()
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'خطأ',
          description: 'حدث خطأ أثناء تحميل البيانات'
        })
        throw error
      }
    }
  })

  const handleViewDetails = (issueId: number) => {
    navigate(`/issues/${issueId}`)
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">جاري التحميل...</div>
  }

  return (
    <div className="container mx-auto py-4">
      <Card>
        <CardHeader className="bg-primary-foreground">
          <CardTitle className="text-xl">المشكلات</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-right">الرقم</TableHead>
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">رقم الفاتورة</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="w-24 text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues?.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell className="font-medium">{issue.id}</TableCell>
                  <TableCell>{issue.title}</TableCell>
                  <TableCell>{issue.billNo}</TableCell>
                  <TableCell>
                    <div
                      className={`px-2 py-1 rounded-full text-center text-xs w-24 ${
                        issue.status === 'open'
                          ? 'bg-red-100 text-red-800'
                          : issue.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {issue.status === 'open'
                        ? 'مفتوح'
                        : issue.status === 'pending'
                          ? 'قيد المعالجة'
                          : 'مغلق'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">فتح القائمة</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(issue.id)}>
                          <Eye className="ml-2 h-4 w-4" />
                          <span>عرض التفاصيل</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {!issues?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    لا توجد مشكلات
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              disabled={pageIndex === 0}
            >
              السابق
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex((p) => p + 1)}
              disabled={!issues || issues.length < pageSize}
            >
              التالي
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
