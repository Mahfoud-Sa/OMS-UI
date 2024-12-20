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
import { toast } from '@renderer/components/ui/use-toast_1'
import { getApi, patchApi } from '@renderer/lib/http'
import { Factory, FactoryInterface, ProductionLineProps, ProductionTeam } from '@renderer/types/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const schema = z.object({
  receivedAt: z.string({ message: 'مطلوب' }).optional(),
  productionTeamId: z.string({ message: 'مطلوب' })
})

export type Schema = z.infer<typeof schema>
type Props = {
  itemId: string
  timeLineId: string
  disable?: boolean
}
const EditTimeLineDialog = ({ itemId, timeLineId, disable }: Props) => {
  const [factoryId, setFactoryId] = useState<number | null>(null)
  const [productionLinesData, setProductionLines] = useState<ProductionLineProps[]>([])
  const [productionTeams, setProductionTeams] = useState<ProductionTeam[]>([])
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

  const { data: factoryData, isSuccess: isFactoryDataSuccess } = useQuery({
    queryKey: ['Factory', factoryId],
    queryFn: () =>
      factoryId
        ? getApi<{
            factory: FactoryInterface
            productionLines: ProductionLineProps[]
            productionTeams: ProductionTeam[]
          }>(`/Factories/${factoryId}`, {}).then((response) => {
            return response.data
          })
        : Promise.resolve(undefined),
    enabled: !!factoryId
  })

  useEffect(() => {
    if (isFactoryDataSuccess && factoryData) {
      setProductionLines(factoryData.productionLines || [])
    }
  }, [isFactoryDataSuccess, factoryData])

  const getProductionTeams = (line: ProductionLineProps) => {
    const productionLine = productionLinesData.find((pl) => pl.id === line.id)
    if (productionLine) {
      setProductionTeams(productionLine.teams || [])
    }
  }

  const form = useForm<Schema>({
    resolver: zodResolver(schema)
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Schema) => {
      await patchApi(`/OrderItems/${itemId}/Timelines/${timeLineId}`, {
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
      setProductionLines([])
      setProductionTeams([])
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
          <DialogTitle>تعديل مسار</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id={`form-edit-${itemId}`}
            onSubmit={form.handleSubmit((data) =>
              mutate({
                ...data,
                receivedAt: new Date(new Date().getTime() + 3 * 60 * 60 * 1000).toISOString() // Adding 3 hours
              })
            )}
          >
            <div className="grid grid-cols-1 gap-3">
              <Combobox
                options={factories?.data.factories || []}
                valueKey="id"
                disabled={factories?.data.factories.length == 0}
                displayKey="name"
                placeholder="أختر مصنع"
                emptyMessage="��م يتم العثور علئ مصنع"
                onSelect={(factory) => {
                  setFactoryId(factory?.id)
                  // reset the production line and team
                  setProductionLines([])
                  form.setValue('productionTeamId', '')
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
                  getProductionTeams(line as ProductionLineProps)
                  // reset the production team
                  form.setValue('productionTeamId', '')
                }}
              />
              <FormField
                name="productionTeamId"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormControl>
                      <Combobox
                        disabled={productionTeams.length == 0}
                        options={productionTeams || []}
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
              {/* <FormField
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
              /> */}
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
