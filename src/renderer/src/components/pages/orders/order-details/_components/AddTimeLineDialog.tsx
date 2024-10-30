import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger
} from '@renderer/components/ui/dialog'
import Dropdown from '@renderer/components/ui/dropdown'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { toast } from '@renderer/components/ui/use-toast'
import { getApi, postApi } from '@renderer/lib/http'
import { ProductionTeam } from '@renderer/types/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { PlusCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const schema = z.object({
  receivedAt: z.string({ message: 'مطلوب' }),
  deliveredAt: z.string({ message: 'مطلوب' }),
  productionTeamId: z.string({ message: 'مطلوب' })
})

export type Schema = z.infer<typeof schema>

const AddTimeLineDialog = () => {
  const { data: productionTeams } = useQuery({
    queryKey: ['production_teams'],
    queryFn: () => getApi<ProductionTeam[]>('/ProductionTeams')
  })

  const form = useForm<Schema>({
    resolver: zodResolver(schema)
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Schema) => {
      await postApi('/Products', data)
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: `تم إضافة المسار بنجاح`
      })
      form.setValue('deliveredAt', '')
      form.setValue('deliveredAt', '')
      //   queryClient.invalidateQueries({ queryKey: ['time_line'] })
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

  //   const onSubmit = () => {}

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-lg text-primary flex items-center gap-1">
          <PlusCircle />
          إضافة دور
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="!text-center text-primary text-lg font-bold">
          إضافة دور
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => 2)}>
            <div className="grid grid-cols-1 gap-2">
              <FormField
                name="productionTeamId"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormControl>
                      <Dropdown
                        label="فريق الإنتاج"
                        getLabel={(option) => option.name}
                        getValue={(option) => option.id!}
                        onChange={onChange}
                        groups={[
                          {
                            label: 'فريق الإنتاج',
                            options: productionTeams?.data || []
                          }
                        ]}
                        value={value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receivedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        placeholder="تاريخ البدء"
                        martial
                        label="تاريخ البدء"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveredAt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        placeholder="تاريخ الأنتهاء"
                        martial
                        label="تاريخ الأنتهاء"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button>إضافة</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddTimeLineDialog
