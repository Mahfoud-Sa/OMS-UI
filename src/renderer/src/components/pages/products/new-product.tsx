import { zodResolver } from '@hookform/resolvers/zod'
import TrushSquare from '@renderer/components/icons/trush-square'
import BackBtn from '@renderer/components/layouts/back-btn'
import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/ui/table'
import { toast } from '@renderer/components/ui/use-toast'
import { postApi } from '@renderer/lib/http'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '../../ui/dialog'

const schema = z.object({
  name: z
    .string({ message: 'مطلوب' })
    .min(3, 'يجب أن يكون أكبر من 3 أحرف')
    .max(100, 'يجب أن يكون أقل من 100 حرف'),
  designs: z.array(z.string()).min(1, { message: 'يجب أن يكون لديك تصميم واحد على الأقل' })
})

export type Schema = z.infer<typeof schema>

const NewProduct = () => {
  const queryClient = useQueryClient()
  const [designs, setDesigns] = useState<string[]>([])
  const [design, setDesign] = useState<string | null>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Schema) => {
      await postApi('/Products', data)
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: `تم إضافة ${form.getValues('name')} بنجاح`
      })
      form.setValue('name', '')
      queryClient.invalidateQueries({ queryKey: ['products'] })
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
  const form = useForm<Schema>({
    resolver: zodResolver(schema)
  })

  const onSubmit = (data: Schema) => mutate(data)

  const designsWatcher = form.watch('designs')

  useEffect(() => {
    // Clear the error when designs change
    if (form.formState.errors.designs && designsWatcher && designsWatcher.length > 0) {
      form.clearErrors('designs')
    }
  }, [designsWatcher, form.formState.errors.designs, form.clearErrors])

  const handleAddDesign = () => {
    if (design != null) {
      setDesigns([...designs, design])
      form.setValue('designs', designs)
      setDesign(null)

      console.log(form.getValues('designs'))
    }
  }

  const handleRemoveDesign = (indx: number) => {
    const filterDesign = designs.filter((_el, index) => index != indx)

    form.setValue('designs', filterDesign)

    setDesigns(filterDesign)

    console.log(form.getValues('designs'))
  }

  return (
    <section className="p-5">
      <BackBtn href="/products" />
      <div className="mt-10">
        <Form {...form}>
          <form className="flex gap-4 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h1 className="text-2xl font-bold">معلومات عامة</h1>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="أسم المنتج" martial label="أسم المنتج" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between items-center mt-3">
                <h1 className="text-xl font-bold">التصاميم</h1>
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="link"
                        className="text-lg text-primary flex items-center gap-1"
                      >
                        <PlusCircle />
                        إضافة تصميم
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader className="!text-center text-primary text-lg font-bold">
                        إضافة تصميم
                      </DialogHeader>
                      <Input
                        placeholder="اسم التصميم"
                        onChange={(e) => setDesign(e.target.value)}
                        martial
                        label="اسم التصميم"
                        value={design || ''}
                      />

                      <DialogFooter>
                        <Button type="button" onClick={() => handleAddDesign()}>
                          إضافة
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div>
                {designs.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الرقم</TableHead>
                        <TableHead className="text-right">اسم التصميم</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {designs.map((d, index) => (
                        <TableRow key={index}>
                          <TableCell>{(index + 1).toString().padStart(2, '0')}</TableCell>
                          <TableCell>{d}</TableCell>
                          <TableCell className="flex justify-end ">
                            <Button
                              type="button"
                              onClick={() => handleRemoveDesign(index)}
                              variant="ghost"
                            >
                              <TrushSquare />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {form.formState.errors.designs && (
                  <p className="text-destructive">يجب أن يكون لديك تصميم واحد على الأقل</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending} size="lg">
                {isPending ? <Loader color={'#fff'} size={15} /> : 'حفظ'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  )
}

export default NewProduct
