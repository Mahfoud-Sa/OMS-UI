import { zodResolver } from '@hookform/resolvers/zod'
import BarCharter from '@renderer/components/charts/BarChart'
import LineCharter from '@renderer/components/charts/LineChart'
import MixedBarChartHoriz from '@renderer/components/charts/MixedBarChartHoriz'
import { Icons } from '@renderer/components/icons/icons'
import InformationCard from '@renderer/components/layouts/InformationCard'
import Loader from '@renderer/components/layouts/loader'
import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import { Textarea } from '@renderer/components/ui/textarea'
import { toast } from '@renderer/components/ui/use-toast'
import { deleteApi, getApi, postApi, putApi } from '@renderer/lib/http'
import {
  LineChartResponse,
  MixedBarCharterProps,
  NoneMixedBarCharterProps,
  ProductionLineProps,
  ProductionTeam
} from '@renderer/types/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Edit } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { z } from 'zod'
import ProductionLineDialog from '../_components/production-lines-dialog'
import UpdateProductionTeamDialog from '../_components/production-team-dialog'
import { StructureTable } from '../_components/structure-table'

const schema = z.object({
  name: z.string().min(3, 'يجب أن يكون أكبر من 3 أحرف').max(100, 'يجب أن يكون أقل من 100 حرف'),
  location: z.string().min(3, 'يجب أن يكون أكبر من 3 أحرف').max(100, 'يجب أن يكون أقل من 100 حرف'),
  createdAt: z.string().min(10, 'يجب أن يكون تاريخ صالح'),
  notes: z.string().optional(),
  productionLines: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string(),
      phone: z.string().optional(),
      teamsCount: z.number(),
      teams: z.array(
        z.object({
          id: z.string().optional(),
          name: z.string(),
          phone: z.string(),
          employsCount: z.number()
        })
      )
    })
  ),
  productionLineTeamsToBeDeleted: z
    .array(
      z.object({
        productionLineId: z.string(),
        teams: z.array(z.string())
      })
    )
    .optional(),
  productionLinesToBeDeleted: z.array(z.string()).optional(),
  image: z.string().url('يجب ان تكون الصورة صحيحة').optional()
})

type Schema = z.infer<typeof schema>

const getFactoryDetails = async (factoryId?: string): Promise<Schema> => {
  if (!factoryId) throw new Error('Factory ID is required')
  const response = await getApi(`/Factories/${factoryId}`)
  return response?.data as Schema // Extract the data from the AxiosResponse
}

const FactoryDetails: React.FunctionComponent = () => {
  const { factoryId } = useParams<{ factoryId: string }>()
  const [isEdit, setIsEdit] = React.useState(false)
  if (!factoryId) setIsEdit(false)
  const [currentTab, setCurrentTab] = React.useState('account')
  const [openDialog, setOpenDialog] = React.useState(false)
  const [productionLineToBeEdited, setProductionLineToBeEdited] =
    React.useState<ProductionLineProps>()
  const [openUpdateTeamDialog, setOpenUpdateTeamDialog] = React.useState(false)
  const [teamToBeEdited, setTeamToBeEdited] = React.useState<ProductionTeam | undefined>(undefined)
  const [productionLineId, setProductionLineId] = React.useState('')
  const [selectedYear, setSelectedYear] = React.useState(0)
  const [hasManyValues, setHasManyValues] = React.useState(false)

  const { data: factory, error } = useQuery<Schema, Error>({
    queryKey: ['factory', factoryId],
    queryFn: () => getFactoryDetails(factoryId)
  })
  if (error) {
    console.error(error)
  }

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: factory || {}
  })

  const { errors } = form.formState

  React.useEffect(() => {
    if (factory) {
      // convert createdAt to a date
      console.log(factory)
      const creationDate = new Date(factory.createdAt)
      console.log(creationDate)

      // Extract year, month, and day
      const year = creationDate.getFullYear()
      const month = String(creationDate.getMonth() + 1).padStart(2, '0') // Months are zero-based
      const day = String(creationDate.getDate()).padStart(2, '0')

      // Format the date as yyyy/mm/dd
      const formattedDate = `${year}-${month}-${day}`
      console.log(formattedDate)
      factory.createdAt = formattedDate
      console.log(factory)

      form.reset(factory)
      console.log(form.getValues())
    }
  }, [factory, form])
  const { mutate: addProductionLineWithTeamsMutate } = useMutation({
    mutationFn: async ({
      productionLineData,
      teams
    }: {
      productionLineData: { name; teamsCount: number; factoryId: string | undefined }
      teams: ProductionTeam[]
    }) => {
      const response = await postApi('/ProductionLines', productionLineData)
      const newProductionLine = response.data as ProductionLineProps
      // loop through the teams and create them
      for (const team of teams) {
        console.log(team)
        await postApi('/ProductionTeams', { ...team, productionLineId: newProductionLine.id })
      }
    },
    onSuccess: () => {
      toast({
        title: 'تم الاضافة',
        description: `تم اضافة خط الانتاج بنجاح`,
        variant: 'success'
      })
      queryClient.invalidateQueries({ queryKey: ['factory', factoryId] })
    },
    onError: () => {
      toast({
        title: 'فشلت عملية الاضافة',
        description: `حصل خطأ ما`,
        variant: 'destructive'
      })
    }
  })
  const { mutate: deleteProductionLineMutate } = useMutation({
    mutationFn: async (id: string) => {
      await deleteApi(`/ProductionLines/${id}`)
    },
    onSuccess: () => {
      toast({
        title: 'تم الحذف',
        description: `تم حذف خط الانتاج بنجاح`,
        variant: 'success'
      })
      queryClient.invalidateQueries({ queryKey: ['factory', factoryId] })
    },
    onError: () => {
      toast({
        title: 'فشلت عملية الحذف',
        description: `حصل خطأ ما`,
        variant: 'destructive'
      })
    }
  })
  const { mutate: editProductionLineMutate } = useMutation({
    mutationFn: async ({
      id,
      productionLineData,
      teams
    }: {
      id: string
      productionLineData: { name; teamsCount: number; factoryId: string | undefined }
      teams: ProductionTeam[]
    }) => {
      await putApi(`/ProductionLines/${id}`, productionLineData)
      // loop through the teams first get the one with newTeam === true and create it and update the rest
      const newTeams = teams.filter((team) => team.newTeam)
      // add new teams
      for (const team of newTeams) {
        await postApi('/ProductionTeams', { ...team, productionLineId: id })
      }
    },
    onSuccess: () => {
      toast({
        title: 'تم التحديث',
        description: `تم تحديث خط الانتاج بنجاح`,
        variant: 'success'
      })
      queryClient.invalidateQueries({ queryKey: ['factory', factoryId] })
    },
    onError: () => {
      toast({
        title: 'فشلت عملية التحديث',
        description: `حصل خطأ ما`,
        variant: 'destructive'
      })
    }
  })
  const { mutate: deleteProductionTeamMutate } = useMutation({
    mutationFn: async (id: string) => {
      await deleteApi(`/ProductionTeams/${id}`)
    },
    onSuccess: () => {
      toast({
        title: 'تم الحذف',
        description: `تم حذف فريق الانتاج بنجاح`,
        variant: 'success'
      })
      queryClient.invalidateQueries({ queryKey: ['factory', factoryId] })
    },
    onError: () => {
      toast({
        title: 'فشلت عملية الحذف',
        description: `حصل خطأ ما`,
        variant: 'destructive'
      })
    }
  })
  const { mutate: editProductionTeamMutate } = useMutation({
    mutationFn: async ({
      id,
      data
    }: {
      id: string
      data: { name: string; phone: string; productionLineId: string }
    }) => {
      await putApi(`/ProductionTeams/${id}`, data)
    },
    onSuccess: () => {
      toast({
        title: 'تم التحديث',
        description: `تم تحديث خط الانتاج بنجاح`,
        variant: 'success'
      })
      queryClient.invalidateQueries({ queryKey: ['factory', factoryId] })
    },
    onError: () => {
      toast({
        title: 'فشلت عملية التحديث',
        description: `حصل خطأ ما`,
        variant: 'destructive'
      })
    }
  })

  // table structure

  const deleteProductionLine = async (id: string) => {
    deleteProductionLineMutate(id)
  }
  const deleteProductionTeam = async (productionLineTeamId: string) => {
    deleteProductionTeamMutate(productionLineTeamId)
  }
  const editProductionTeam = async (
    id: string,
    name: string,
    phone: string,
    productionLineId: string
  ) => {
    const team = { name, phone, productionLineId }
    console.log(team)
    console.log(id)
    editProductionTeamMutate({ id, data: team })
  }

  // Add a method to open the dialog with the selected team
  const handleEditTeam = (team: ProductionTeam, productionLineId: string) => {
    setProductionLineId(productionLineId)
    setTeamToBeEdited(team)
    setOpenUpdateTeamDialog(true)
  }

  const columns: ColumnDef<ProductionLineProps, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'خط الانتاج',
      cell: (info) => {
        const { original } = info.row
        return original ? (
          <>
            <div>{original.name}</div>
            <div style={{ fontSize: '0.8em', color: 'gray' }}>#{original.id}</div>
          </>
        ) : null
      }
    },
    {
      accessorKey: 'phone',
      header: 'رقم التواصل مع الفرق',
      cell: (info) => {
        const { original } = info.row
        // Return an empty string or placeholder for the phone column
        return original.phone ? original.phone : ''
      }
    },
    {
      accessorKey: 'teamsCount',
      header: 'عدد الفرق',
      cell: (info) => info.row.original.teamsCount || info.row.original.teams?.length
    },
    {
      id: 'actions',
      cell: (info) => {
        const { original } = info.row
        return original && isEdit ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Icons.ellipsis className="object-contain shrink-0 w-6 aspect-square" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <a
                    onClick={() => {
                      console.log(original)
                      setProductionLineToBeEdited(original)
                      setOpenDialog(true)
                    }}
                  >
                    <DropdownMenuItem>تعديل</DropdownMenuItem>
                  </a>
                  <DropdownMenuItem
                    onClick={() => {
                      deleteProductionLine(original.id || '')
                    }}
                    className="bg-orange-500 text-white"
                  >
                    حذف
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : null
      }
    },
    {
      id: 'expand',
      cell: (info) => {
        const { original } = info.row
        return original ? (
          <span
            className="mx-2"
            onClick={() => {
              info.row.toggleExpanded()
            }}
            {...info.row.getToggleExpandedHandler()}
          >
            {info.row.original.teams && info.row.original.teams.length > 0
              ? info.row.getIsExpanded()
                ? '▼'
                : '▶'
              : null}
          </span>
        ) : null
      }
    }
  ]
  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast({
        title: 'خطأ في التحقق',
        description: 'يرجى التحقق من الحقول المدخلة',
        variant: 'destructive'
      })
    }
  }, [errors])

  const handleNext = () => {
    if (currentTab === 'reports') {
      return
    } else if (currentTab === 'account') setCurrentTab('productionLines')
    else if (currentTab === 'productionLines') setCurrentTab('reports')
  }

  const handleBack = () => {
    if (currentTab === 'account') return
    else if (currentTab === 'productionLines') setCurrentTab('account')
    else if (currentTab === 'reports') setCurrentTab('productionLines')
  }
  const queryClient = useQueryClient()
  // update method
  const { mutate, isPending } = useMutation({
    mutationFn: (data: Schema) => {
      return putApi(`/Factories/${factoryId}`, data)
    },
    onSuccess: () => {
      toast({
        title: 'تم الحفظ بنجاح',
        description: `تم إتمام العملية بنجاح`,
        variant: 'success'
      })
      queryClient.invalidateQueries({ queryKey: ['factory', factoryId] })
    },
    onError: (error) => {
      console.log(error)
      toast({
        title: 'فشلت عملية الحفظ',
        description: `حصل خطأ ما`,
        variant: 'destructive'
      })
    }
  })
  const addProductionLineWithTeams = async (name: string, teams: ProductionTeam[]) => {
    const productionLine = {
      name,
      teamsCount: teams.length,
      factoryId: factoryId
    }

    await addProductionLineWithTeamsMutate({ productionLineData: productionLine, teams })
    setProductionLineToBeEdited(undefined)
  }
  const editProductionLineWithTeams = async (id: string, name: string, teams: ProductionTeam[]) => {
    // update the production line information then add new teams then update the teams information.
    const productionLine = {
      name,
      teamsCount: teams.length,
      factoryId: factoryId
    }
    await editProductionLineMutate({ id, productionLineData: productionLine, teams })
    setProductionLineToBeEdited(undefined)
  }
  const handleManyValues = (hasMany: boolean) => {
    console.log(hasMany)
    setHasManyValues(hasMany)
  }

  const onSubmit = (data: Schema) => {
    console.log(data)
    // Assume this is your API utility function
    mutate(data)
  }

  return (
    <>
      <section>
        {factoryId && (
          <InformationCard
            id={factoryId}
            logoSrc={factory?.image || 'https://via.placeholder.com/100'}
            actionType="method"
            buttonAction={() => setIsEdit((prev) => !prev)}
            buttonText={!isEdit ? 'تعديل' : 'الغاء التعديل'}
            buttonIcon={Edit}
            infoItems={[
              {
                text: factory?.name || 'Factory Name'
              },
              {
                text: factory?.createdAt || '2021-09-01',
                iconSrc: 'calendarTick'
              },
              {
                text: factory?.location || 'Factory Location',
                iconSrc: 'mapPin'
              }
            ]}
          />
        )}
      </section>
      <section className="bg-white p-5">
        <Form {...form}>
          <main className="flex flex-col text-base font-medium text-zinc-700">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs value={currentTab} defaultValue="account">
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
                      if (isEdit) return
                      setCurrentTab('account')
                    }}
                    value="account"
                  >
                    المعلومات الاساسية
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => {
                      if (isEdit) return
                      setCurrentTab('productionLines')
                    }}
                    value="productionLines"
                  >
                    خطوط الانتاج
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => {
                      if (isEdit) return
                      setCurrentTab('reports')
                    }}
                    value="reports"
                  >
                    التقارير
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                  <section className="flex flex-col w-full max-md:max-w-full">
                    <div className="flex flex-wrap gap-3 items-center w-full max-md:max-w-full">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                disabled={!isEdit}
                                {...field}
                                placeholder="اسم المصنع"
                                label="اسم المصنع"
                              />
                            </FormControl>
                            <FormMessage>{fieldState?.error?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="createdAt"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="date"
                                disabled
                                {...field}
                                placeholder="تاريخ الانشاء"
                                label="تاريخ الانشاء"
                              />
                            </FormControl>
                            <FormMessage>{fieldState?.error?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                disabled={!isEdit}
                                {...field}
                                placeholder="موقع المصنع"
                                label="موقع المصنع"
                              />
                            </FormControl>
                            <FormMessage>{fieldState?.error?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="items-center mt-5">
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea disabled={!isEdit} {...field} placeholder="ملاحظات" />
                            </FormControl>
                            <FormMessage>{fieldState?.error?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>
                </TabsContent>
                <TabsContent value="productionLines">
                  {isEdit && (
                    <ProductionLineDialog
                      addProductionLineWithTeams={addProductionLineWithTeams}
                      editProductionLineWithTeams={editProductionLineWithTeams}
                      openDialog={openDialog}
                      onClose={() => {
                        console.log('closed')
                        setOpenDialog(false)
                        setProductionLineToBeEdited(undefined)
                      }}
                      productionLine={productionLineToBeEdited}
                      isEdit={!!productionLineToBeEdited}
                    />
                  )}
                  <StructureTable<ProductionLineProps, unknown>
                    columns={columns}
                    data={factory?.productionLines ? factory?.productionLines : []}
                    title="Factories"
                    onDeleteProductionLineTeam={(teamId) => {
                      deleteProductionTeam(teamId)
                    }}
                    onEditProductionLineTeam={handleEditTeam}
                    displayActions={isEdit}
                  />
                </TabsContent>
                <TabsContent value="reports">
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
                        id={factoryId || ''}
                        productName={form.getValues('name')}
                        label="مبيعات المصنع"
                        queryFunction={(id: string, year: number) => {
                          return getApi<NoneMixedBarCharterProps[]>(
                            `Factories/${id}/charts/bar?year=${year}`
                          )
                        }}
                      />
                    </div>
                    <div className={hasManyValues ? 'grid grid-rows-2' : 'grid grid-cols-2 gap-2'}>
                      <div>
                        <MixedBarChartHoriz
                          year={selectedYear}
                          id={factoryId || ''}
                          label="مبيعات خطوط الانتاج"
                          queryFunction={async (id, year, month) => {
                            return await getApi<MixedBarCharterProps[]>(
                              `Factories/${id}/charts/horizontal-bar?year=${year}&month=${month}`
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
                          id={factoryId || ''}
                          onManyValues={handleManyValues}
                          label="مبيعات خطوط الانتاج"
                          queryFunction={async (id, year) => {
                            return await getApi<LineChartResponse[]>(
                              `Factories/${id}/charts/line?year=${year}`
                            )
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              {isEdit && (
                <div className="flex mt-2 flex-row gap-2 justify-end">
                  {currentTab !== 'account' && (
                    <div className="hover:marker:" onClick={handleBack}>
                      <div className="flex justify-end">
                        <Button type="button" size="lg">
                          السابق
                        </Button>
                      </div>
                    </div>
                  )}
                  {currentTab !== 'reports' && (
                    <div className="hover:marker:" onClick={handleNext}>
                      <div className="flex justify-end">
                        <Button type="button" size="lg">
                          التالي
                        </Button>
                      </div>
                    </div>
                  )}
                  {currentTab === 'reports' && isEdit && (
                    <div className="hover:marker:" onClick={handleNext}>
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
                    </div>
                  )}
                </div>
              )}
            </form>
          </main>
        </Form>
      </section>
      <UpdateProductionTeamDialog
        editProductionTeam={editProductionTeam}
        onClose={() => setOpenUpdateTeamDialog(false)}
        productionTeam={teamToBeEdited}
        openDialog={openUpdateTeamDialog}
        productionLineId={productionLineId}
      />
    </>
  )
}

export default FactoryDetails
