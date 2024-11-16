import { zodResolver } from '@hookform/resolvers/zod'
import BarCharter from '@renderer/components/charts/BarChart'
import LineCharter from '@renderer/components/charts/LineChart'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import { toast } from '@renderer/components/ui/use-toast_1'
import { getApi, putApi } from '@renderer/lib/http'
import {
  LineChartResponse,
  MixedBarCharterProps,
  NoneMixedBarCharterProps
} from '@renderer/types/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit, PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import * as z from 'zod'
import MixedBarChartHoriz from '../../charts/MixedBarChartHoriz'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '../../ui/dialog'

const schema = z.object({
  name: z
    .string({ message: 'مطلوب' })
    .min(3, 'يجب أن يكون أكبر من 3 أحرف')
    .max(100, 'يجب أن يكون أقل من 100 حرف'),
  designs: z
    .array(
      z.object({
        id: z.number().optional(),
        name: z.string(),
        isDelete: z.boolean()
      })
    )
    .optional()
})

export type Schema = z.infer<typeof schema>

const InfoProduct = () => {
  const [isEdit, setIsEdit] = useState(false)
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [currentTab, setCurrentTab] = useState('general')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [hasManyValues, setHasManyValues] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [designs, setDesigns] = useState<
    {
      isDelete: boolean
      name: string
      id?: number
    }[]
  >([])
  const [design, setDesign] = useState<string | null>(null)

  const {
    data,
    isPending: isPendingProducts,
    isSuccess
  } = useQuery({
    queryKey: ['products', id],
    queryFn: () => getApi<Schema>(`Products/${id}`)
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Schema) => {
      await putApi(`/Products/${id}`, data)
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: `تم تعديل ${form.getValues('name')} بنجاح`
      })
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
    // defaultValues: isSuccess ? data?.data : undefined
  })
  const { errors } = form.formState
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast({
        title: 'خطأ في التحقق',
        description: 'يرجى التحقق من الحقول المدخلة',
        variant: 'destructive'
      })
    }
  }, [errors])

  useEffect(() => {
    if (isSuccess) {
      const newData = data.data.designs?.map((el) => {
        return {
          name: el.name,
          id: el.id,
          isDelete: false
        }
      })
      form.reset({
        name: data.data.name,
        designs: newData
      })
      setDesigns([...newData!])
    }
  }, [data?.data])

  const handleAddDesign = () => {
    if (design != null) {
      setDesigns([...designs, { name: design, isDelete: false }])
    }
  }
  const handleEditDesign = (id: number) => {
    if (design != null) {
      setDesigns((prevDesigns) =>
        prevDesigns.map((d) => (d.id === id ? { ...d, name: design } : d))
      )
    }
  }

  const handleRemoveDesign = (indx: number) => {
    const filterDesign = designs
      .map((el, index) => {
        if (index == indx) {
          if (el.id != null) {
            el.isDelete = true
            return el
          }

          return null
        }
        return el
      })
      .filter((el) => el != null)

    form.setValue('designs', filterDesign)

    setDesigns(filterDesign)

    console.log(form.getValues('designs'))
  }

  const designsWatcher = form.watch('designs')

  useEffect(() => {
    // Clear the error when designs change
    if (form.formState.errors.designs && designsWatcher && designsWatcher.length > 0) {
      form.clearErrors('designs')
    }
  }, [designsWatcher, form.formState.errors.designs, form.clearErrors])

  useEffect(() => {
    form.setValue('designs', designs)
    setDesign(null)
    console.log(form.getValues('designs'))
  }, [designs])

  const handleManyValues = (hasMany: boolean) => {
    console.log(hasMany)
    setHasManyValues(hasMany)
  }

  const onSubmit = (data: Schema) => mutate(data)

  if (isPendingProducts)
    return (
      <div className="flex justify-center items-center bg-white rounded-lg min-h-[800px] shadow-sm">
        <Loader size={50} color="#DA972E" />
      </div>
    )

  return (
    <section className="p-5">
      <BackBtn href="/products" />
      <div className="mt-2">
        <Form {...form}>
          <form className="flex gap-4 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex justify-end">
                <Button type="button" onClick={() => setIsEdit((prev) => !prev)}>
                  {!isEdit ? 'تعديل' : 'الغاء التعديل'}
                </Button>
              </div>

              <Tabs value={currentTab} defaultValue="general">
                <TabsList
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    backgroundColor: 'transparent'
                  }}
                >
                  <TabsTrigger
                    onClick={() => {
                      setCurrentTab('general')
                    }}
                    value="general"
                  >
                    المعلومات العامة
                  </TabsTrigger>
                  {/* <TabsTrigger
                    onClick={() => {
                      setCurrentTab('productStats')
                    }}
                    value="productStats"
                  >
                    احصائيات المنتج
                  </TabsTrigger> */}
                  {/* <TabsTrigger
                    onClick={() => {
                      if (isEdit) return
                      setCurrentTab('reports')
                    }}
                    value="reports"
                  >
                    تقارير المنتج
                  </TabsTrigger> */}
                </TabsList>
                <TabsContent value="general">
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              disabled={!isEdit}
                              {...field}
                              placeholder="أسم المنتج"
                              martial
                              label="أسم المنتج"
                            />
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
                            disabled={!isEdit}
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
                    {designs.filter((el) => el.isDelete != true).length > 0 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right">الرقم</TableHead>
                            <TableHead className="text-right">اسم التصميم</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {designs.map(
                            (d, index) =>
                              !d.isDelete && (
                                <TableRow key={index}>
                                  <TableCell>{(index + 1).toString().padStart(2, '0')}</TableCell>
                                  <TableCell>{d.name}</TableCell>
                                  <TableCell className="flex justify-end ">
                                    <Dialog open={showDialog}>
                                      <DialogTrigger asChild>
                                        <Button
                                          type="button"
                                          onClick={() => {
                                            setDesign(d.name)
                                            setShowDialog(true)
                                          }}
                                          variant="ghost"
                                          disabled={!isEdit}
                                        >
                                          <Edit color="green" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader className="!text-center text-primary text-lg font-bold">
                                          تعديل تصميم
                                        </DialogHeader>
                                        <Input
                                          placeholder="اسم التصميم"
                                          onChange={(e) => setDesign(e.target.value)}
                                          martial
                                          label="اسم التصميم"
                                          value={design || ''}
                                        />

                                        <DialogFooter>
                                          <Button
                                            type="button"
                                            onClick={() => {
                                              handleEditDesign(d.id || 0)
                                              setShowDialog(false)
                                            }}
                                          >
                                            تعديل
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                    <Button
                                      type="button"
                                      onClick={() => handleRemoveDesign(index)}
                                      variant="ghost"
                                      disabled={!isEdit}
                                    >
                                      <TrushSquare />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              )
                          )}
                        </TableBody>
                      </Table>
                    )}
                    {form.formState.errors.designs && (
                      <p className="text-destructive">يجب أن يكون لديك تصميم واحد على الأقل</p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="productStats">
                  {/* a grid of one column inside it two rows, inside the second row two columns */
                  /* the first row contains a BarChart */
                  /* the second row contains two columns, the first column contains a PieChart */
                  /* the second column contains a LineChart */
                  /* the BarChart, PieChart, LineChart are imported from the library */
                  /* the data of the charts are fetched from the API */}
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      {/* <Skeleton className="h-36" /> */}
                      <BarCharter
                        onChangeYear={(year) => {
                          setSelectedYear(year)
                        }}
                        year={selectedYear}
                        id={id || ''}
                        productName={form.getValues('name')}
                        label="مبيعات المنتج"
                        queryFunction={(id: string, year: number) => {
                          return getApi<NoneMixedBarCharterProps[]>(
                            `Products/${id}/Chars/Bar?year=${year}`
                          )
                        }}
                      />
                    </div>
                    <div className={hasManyValues ? 'grid grid-rows-2' : 'grid grid-cols-2 gap-2'}>
                      <div>
                        <MixedBarChartHoriz
                          year={selectedYear}
                          id={id || ''}
                          label="مبيعات التصاميم"
                          queryFunction={async (id, year, month) => {
                            return await getApi<MixedBarCharterProps[]>(
                              `Products/${id}/Chars/HorizantalBar?year=${year}&month=${month}`
                            )
                          }}
                        />
                      </div>
                      <div>
                        <LineCharter
                          onChangeYear={(year) => {
                            setSelectedYear(year)
                          }}
                          year={selectedYear}
                          id={id || ''}
                          onManyValues={handleManyValues}
                          label="مبيعات التصاميم"
                          queryFunction={async (id, year) => {
                            return await getApi<LineChartResponse[]>(
                              `Products/${id}/Chars/Line?year=${year}`
                            )
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                {/* <TabsContent value="reports">
                  <div className="">
                    <h1 className="text-2xl font-bold">تقارير المنتج</h1>
                  </div>
                </TabsContent> */}
              </Tabs>
              {isEdit && (
                <div className="flex mt-2 flex-row gap-2 justify-end">
                  {isEdit && (
                    <div className="flex justify-end">
                      <Button
                        disabled={isPending}
                        className="bg-green-500 hover:bg-green-700"
                        type="submit"
                        size="lg"
                      >
                        {isPending ? <Loader color="black" /> : 'حفظ'}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>
    </section>
  )
}

export default InfoProduct
