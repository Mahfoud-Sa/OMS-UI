import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { useRouter } from 'next/navigation'
import { deleteApi } from '../../lib/http'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../ui/alert-dialog'
import { toast } from '../ui/use-toast'

interface DeleteDialogProps {
  title?: string
  description?: string
  url: string
  disabled?: boolean
  keys?: string[]
}

export default function DeleteDialog({
  title,
  description,
  url,
  disabled = false,
  keys
}: DeleteDialogProps) {
  // const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteApi(`${url}`),
    onSuccess: () => {
      toast({
        title: 'تمت العملية بنجاح',
        description: 'تم حذف البيانات بنجاح',
        variant: 'success'
      })

      if (keys) {
        queryClient.invalidateQueries({ queryKey: keys })
      }
    },
    onError(error) {
      toast({
        title: 'فشلت العملية',
        description: error?.toString(),
        variant: 'destructive'
      })
    }
    // onSettled: () => router.refresh()
  })

  if (isPending) {
    toast({
      title: 'جاري الحدف',
      description: 'يرجئ الانتظار قليل',
      variant: 'default'
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={`m-0 w-full rounded px-2 py-1.5 text-right text-red-500 hover:bg-gray-100 ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
        disabled={disabled}
      >
        حذف
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="*:text-right">
          <AlertDialogTitle>{title || 'هل أنت متأكد؟'}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || 'لا يمكنك التراجع فيما بعد. سوف يتم حذف البيانات بشكل نهائي.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel className="text-muted-foregrounds">إلغاء</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-500"
            onClick={() => {
              mutate()
            }}
          >
            حذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
