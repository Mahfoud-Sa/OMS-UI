import { StructureTable } from '@renderer/components/tables/structure-table'
import { Button } from '@renderer/components/ui/button'
import { Card, CardContent } from '@renderer/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { useToast } from '@renderer/components/ui/use-toast'
import { Issue, getIssues } from '@renderer/services/issues.service'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Eye, MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function IssuesPage() {
  const { toast } = useToast()
  const navigate = useNavigate()

  const { data: issues, isLoading } = useQuery({
    queryKey: ['issues'],
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

  const columns: ColumnDef<Issue>[] = [
    {
      accessorKey: 'id',
      header: 'الرقم',
      cell: ({ row }) => <div className="font-medium">{row.original.id}</div>
    },
    {
      accessorKey: 'title',
      header: 'العنوان',
      cell: ({ row }) => <div>{row.original.title}</div>
    },
    {
      accessorKey: 'billNo',
      header: 'رقم الفاتورة',
      cell: ({ row }) => <div>{row.original.billNo}</div>
    },
    {
      accessorKey: 'status',
      header: 'الحالة',
      cell: ({ row }) => (
        <div className="flex justify-center">
          <div
            className={`px-2 py-1 rounded-full text-center text-xs w-24 ${
              row.original.status === 'open'
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {row.original.status === 'open' ? 'مفتوح' : 'تمت المعالجة'}
          </div>
        </div>
      )
    },
    {
      id: 'actions',
      header: 'الإجراءات',
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">فتح القائمة</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetails(row.original.id)}>
                <Eye className="ml-2 h-4 w-4" />
                <span>عرض التفاصيل</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ]

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">جاري التحميل...</div>
  }

  return (
    <div className="container mx-auto py-4">
      <Card>
        <CardContent className="p-6">
          {issues && issues.length > 0 ? (
            <StructureTable columns={columns} data={issues || []} tableHeight="400px" />
          ) : (
            <div className="text-center py-8">
              <p>لا توجد مشكلات</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
