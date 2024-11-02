import { zodResolver } from '@hookform/resolvers/zod'
import ProfileUploader from '@renderer/components/file-uploader/ProfileUploader'
import { Icons } from '@renderer/components/icons/icons'
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
import { toast } from '@renderer/components/ui/use-toast_1'
import { postApi } from '@renderer/lib/http'
import { ProductionLineProps, ProductionTeam } from '@renderer/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import imageProfile from '../../../../assets/images/profile.jpg'
import ProductionLineDialog from '../_components/production-lines-dialog'
import { StructureTable } from '../_components/structure-table'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes

const schema = z.object({
  name: z.string().min(3, 'يجب أن يكون أكبر من 3 أحرف').max(100, 'يجب أن يكون أقل من 100 حرف'),
  location: z.string().min(3, 'يجب أن يكون أكبر من 3 أحرف').max(100, 'يجب أن يكون أقل من 100 حرف'),
  createdAt: z.string(),
  notes: z.string(),
  productionLines: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string(),
      teamsCount: z.number(),
      teams: z.array(
        z.object({
          id: z.string().optional(),
          name: z.string(),
          phone: z.string()
        })
      )
    })
  ),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: 'حجم الصور يجب أن يكون أقل من 5 ميجابايت'
    })
    .optional()
})

type Schema = z.infer<typeof schema>

const NewFactory: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = React.useState('account')
  const [productionLinesArray, setProductionLinesArray] = useState<Schema['productionLines']>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [productionLineToBeEdited, setProductionLineToBeEdited] = useState<
    ProductionLineProps | undefined
  >(undefined)

  const addProductionLineWithTeams = (name: string, teams: ProductionTeam[]) => {
    const newProductionLine = {
      id: `${productionLinesArray.length + 1}`,
      name: name,
      phoneNumber: '', // Add appropriate value
      teamsCount: teams.length,
      teams: teams
    }
    console.log(newProductionLine)
    const newProductionLines = [...productionLinesArray, newProductionLine]
    setProductionLinesArray(newProductionLines)
    console.log(productionLinesArray)
    console.log(newProductionLine)
    form.setValue('productionLines', newProductionLines)
  }
  const editProductionLineWithTeams = (id: string, name: string, teams: ProductionTeam[]) => {
    const newProductionLine = {
      id,
      name: name,
      phoneNumber: '', // Add appropriate value
      teamsCount: teams.length,
      teams: teams
    }
    const newProductionLines = productionLinesArray.map((l) => {
      if (l.id === id) {
        return newProductionLine
      }
      return l
    })
    setProductionLinesArray(newProductionLines)
    console.log(productionLinesArray)
    console.log(newProductionLine)
  }

  const form = useForm<Schema>({
    resolver: zodResolver(schema)
  })
  form.setValue('createdAt', new Date().toISOString().split('T')[0])
  const { errors } = form.formState

  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log(errors)
      toast({
        title: 'خطأ في التحقق',
        description: 'يرجى التحقق من الحقول المدخلة',
        variant: 'destructive'
      })
    }
    console.log(form.getValues('createdAt'))
  }, [errors])

  const handleNext = () => {
    if (currentTab === 'productionLines') {
      return
    } else if (currentTab === 'account') {
      setCurrentTab('productionLines')
    }
    console.log(form.getValues('productionLines'))
  }

  const handleBack = () => {
    if (currentTab === 'account') return
    else if (currentTab === 'productionLines') setCurrentTab('account')
  }
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => {
      return postApi('/Factories/create-with-production-lines-and-teams', data)
    },
    onSuccess: () => {
      toast({
        title: 'تم الحفظ بنجاح',
        description: `تم إتمام العملية بنجاح`,
        variant: 'success'
      })
      queryClient.invalidateQueries({ queryKey: ['factories'] })
      navigate('/factories')
    },
    onError: () => {
      toast({
        title: 'فشلت عملية الحفظ',
        description: `حصل خطأ ما`,
        variant: 'destructive'
      })
    }
  })

  const onSubmit = (data: Schema) => {
    console.log(data)
    const payloadFormData = new FormData()
    payloadFormData.append('name', data.name)
    payloadFormData.append('location', data.location)
    payloadFormData.append('notes', data.notes)
    payloadFormData.append('createdAt', data.createdAt)
    data.image && payloadFormData.append('image', data.image)
    const productionLinesWithoutId = data.productionLines.map((line) => {
      const { id, teamsCount, ...rest } = line
      return rest
    })
    data.productionLines.forEach((line, lineIndex) => {
      payloadFormData.append(`productionLines[${lineIndex}].name`, line.name)
      line.teams.forEach((team, teamIndex) => {
        payloadFormData.append(`productionLines[${lineIndex}].teams[${teamIndex}].name`, team.name)
        payloadFormData.append(
          `productionLines[${lineIndex}].teams[${teamIndex}].phone`,
          team.phone
        )
      })
    })
    console.log(payloadFormData)
    console.log(productionLinesWithoutId)

    mutate(payloadFormData)
  }

  const removeProductionLine = (line: ProductionLineProps) => {
    const newProductionLines = productionLinesArray.filter((l) => l !== line)
    setProductionLinesArray(newProductionLines)
  }

  const columns = [
    {
      accessorKey: 'name',
      header: 'اسم خط الانتاج',
      cell: (info) => {
        const { original } = info.row
        return original ? (
          <>
            <div>{original.name}</div>
          </>
        ) : null
      }
    },
    {
      accessorKey: 'phoneNumber',
      header: 'رقم التواصل مع الفرق',
      cell: (info) => {
        const { original } = info.row
        return original.phoneNumber ? original.phoneNumber : ''
      }
    },
    {
      accessorKey: 'teamsCount',
      header: 'عدد الفرق',
      cell: (info) => info.row.original.teamsCount
    },
    {
      id: 'actions',
      cell: (info) => {
        const { original } = info.row
        return original ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Icons.ellipsis className="object-contain shrink-0 w-6 aspect-square" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <a
                    onClick={() => {
                      setOpenDialog(true)
                      setProductionLineToBeEdited(original)
                    }}
                  >
                    <DropdownMenuItem>تعديل</DropdownMenuItem>
                  </a>
                  <DropdownMenuItem
                    onClick={() => removeProductionLine(original)}
                    style={{ backgroundColor: 'orange', color: 'white' }}
                    color="white"
                    className="btn"
                  >
                    {'حذف'}
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
            {info.row.original.teamsCount > 0 ? (info.row.getIsExpanded() ? '▼' : '▶') : null}
          </span>
        ) : null
      }
    }
  ]

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <section className="bg-white p-5">
            <Tabs value={currentTab} defaultValue="account">
              <TabsList
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  backgroundColor: 'transparent'
                }}
              >
                <TabsTrigger value="account">المعلومات الاساسية</TabsTrigger>
                <TabsTrigger value="productionLines">خطوط الانتاج</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <main className="flex flex-col text-base font-medium text-zinc-700">
                  <section className="flex flex-col w-full max-md:max-w-full">
                    <div className="flex flex-col gap-3 items-center w-full max-md:max-w-full mb-4">
                      <div className="w-full flex">
                        <FormField
                          control={form.control}
                          name="image"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div>
                                  <ProfileUploader
                                    className="h-[180px] w-[180px]"
                                    inputId="ImageFile"
                                    setValue={form.setValue}
                                    onChange={async (files) => {
                                      try {
                                        if (!files?.[0]) return
                                        field.onChange(files[0])
                                      } catch (error) {
                                        JSON.stringify(error)
                                      }
                                    }}
                                    defaultImage={imageProfile}
                                  />
                                  <FormMessage />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center w-full max-md:max-w-full">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="اسم المصنع" label="اسم المصنع" />
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
                                {...field}
                                placeholder="تاريخ الانشاء"
                                label="تاريخ الانشاء"
                                value={
                                  // current date as yyyy-mm-dd
                                  new Date().toISOString().split('T')[0]
                                }
                                disabled
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
                              <Input {...field} placeholder="موقع المصنع" label="موقع المصنع" />
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
                              <Textarea {...field} placeholder="ملاحظات" />
                            </FormControl>
                            <FormMessage>{fieldState?.error?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>{' '}
                </main>
              </TabsContent>
              <TabsContent value="productionLines">
                <div className="flex justify-end mt-2">
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
                </div>
                <div className="mt-5">
                  <StructureTable<ProductionLineProps, unknown>
                    columns={columns}
                    data={productionLinesArray}
                    title="خطوط الانتاج المضافة"
                    displayActions={false}
                    onDeleteProductionLineTeam={() => {}}
                    onEditProductionLineTeam={() => {}}
                  />
                </div>
              </TabsContent>
              <TabsContent value="reports">Change your reports here.</TabsContent>
            </Tabs>
          </section>
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
            {currentTab !== 'productionLines' && (
              <div className="hover:marker:" onClick={handleNext}>
                <div className="flex justify-end">
                  <Button type="button" size="lg">
                    التالي
                  </Button>
                </div>
              </div>
            )}
            {currentTab === 'productionLines' && (
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
        </form>
      </Form>
    </>
  )
}

export default NewFactory
