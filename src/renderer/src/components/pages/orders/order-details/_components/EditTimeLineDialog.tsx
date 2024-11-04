import { zodResolver } from '@hookform/resolvers/zod'
import { DialogTitle } from '@radix-ui/react-dialog'
import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import { Combobox } from '@renderer/components/ui/combobox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger
} from '@renderer/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { toast } from '@renderer/components/ui/use-toast_1'
import { getApi, putApi } from '@renderer/lib/http'
import { Factory, ProductionLines, ProductionTeam } from '@renderer/types/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const schema = z.object({
  receivedAt: z.string({ message: 'مطلوب' }),
  productionTeamId: z.string({ message: 'مطلوب' })
})

export type Schema = z.infer<typeof schema>
type Props = {
  itemId: string
  timeLineId: string
  disable?: boolean
}
const EditTimeLineDialog = ({ itemId, timeLineId, disable }: Props) => {
  const [productionLinesData, setProductionLinesData] = useState<ProductionLines[]>([])
  const [productionTeamsData, setProductionTeamsData] = useState<ProductionTeam[]>([])
  const queryClient = useQueryClient()
  const { data: factories } = useQuery({
    queryKey: ['Factories'],
    queryFn: () =>
      getApi<{ factories: Factory[] }>('/Factories', {
        params: {
          size: 100000000
        }
      })
  })
  const { data: productionLines } = useQuery({
    queryKey: ['ProductionLines'],
    queryFn: () => getApi<ProductionLines[]>('/productionLines')
  })
  const { data: productionTeams } = useQuery({
    queryKey: ['production_teams'],
    queryFn: () => getApi<ProductionTeam[]>('/ProductionTeams')
  })

  const form = useForm<Schema>({
    resolver: zodResolver(schema)
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Schema) => {
      await putApi(`/OrderItems/${itemId}/Timelines/${timeLineId}`, {
        ...data,
        productionTeamId: +data.productionTeamId,
        status: 0
      })
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: `تم تعديل المسار بنجاح`
      })
      setProductionLinesData([])
      setProductionTeamsData([])
      form.reset({
        receivedAt: undefined,
        productionTeamId: undefined
      })
      queryClient.invalidateQueries({ queryKey: ['time_line'] })
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={disable}
          variant={'outline'}
          className="text-base  text-blue-700 flex items-center gap-1"
        >
          <Edit size={16} />
          تعديل المسار
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="!text-center text-primary text-lg font-bold">
          <DialogTitle>إضافة مسار</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id={`form-edit-${itemId}`}
            onSubmit={form.handleSubmit((data) =>
              mutate({
                ...data,
                receivedAt: new Date(data.receivedAt).toISOString()
              })
            )}
          >
            <div className="grid grid-cols-1 gap-3">
              <Combobox
                options={factories?.data.factories || []}
                valueKey="id"
                displayKey="name"
                placeholder="أختر مصنع"
                emptyMessage="لم يتم العثور علئ مصنع"
                onSelect={(factory) => {
                  const newProductionLinesData = productionLines?.data.filter(
                    (el) => el.factoryId == (factory?.id as number)
                  )
                  if (newProductionLinesData) {
                    setProductionLinesData(newProductionLinesData)
                  }
                }}
              />
              <Combobox
                disabled={productionLinesData.length == 0}
                options={productionLinesData || []}
                valueKey="id"
                displayKey="name"
                placeholder="أختر مسار"
                emptyMessage="لم يتم العثور علئ مسار"
                onSelect={(line) => {
                  const newProductionTeamsData = productionTeams?.data.filter(
                    (el) => +el?.id! == (line?.id as number)
                  )
                  if (newProductionTeamsData) {
                    setProductionTeamsData(newProductionTeamsData)
                  }
                }}
              />
              <FormField
                name="productionTeamId"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormControl>
                      <Combobox
                        disabled={productionTeamsData.length == 0}
                        options={productionTeamsData || []}
                        valueKey="id"
                        displayKey="name"
                        placeholder="أختر فريق"
                        emptyMessage="لم يتم العثور علئ الفريق"
                        onSelect={(team) =>
                          form.setValue('productionTeamId', String(team?.id) as string)
                        }
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
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button form={`form-edit-${itemId}`} className="w-full" type="submit">
            {isPending ? <Loader color={'#fff'} size={15} /> : 'إضافة'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditTimeLineDialog
