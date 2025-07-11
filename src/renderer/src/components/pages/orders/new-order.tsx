import { zodResolver } from '@hookform/resolvers/zod'
import { Icons } from '@renderer/components/icons/icons'
import BackBtn from '@renderer/components/layouts/back-btn'
import Loader from '@renderer/components/layouts/loader'
import { StructureTable } from '@renderer/components/tables/structure-table'
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
import { PhoneInput } from '@renderer/components/ui/phone-input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import { Textarea } from '@renderer/components/ui/textarea'
import { toast } from '@renderer/components/ui/use-toast_1'
import { deleteApi, getApi, postApi } from '@renderer/lib/http'
import {
  FactoryInterface,
  localNewProduct,
  NewOrderProp,
  OrderItem,
  Product,
  ProductionLineProps,
  ProductionTeam
} from '@renderer/types/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PlusCircle } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as z from 'zod'
import NewOrderItemDialog from './_components/new-order-item-dialog'
import NewOrderNoteDialog from './_components/new-order-note-dialog'

const schema = z.object({
  customerName: z.string({ message: 'يجب أدخال اسم العميل' }),
  customerNo: z
    .string({ message: 'يجب أدخال رقم العميل' })
    .regex(/^\+9665\d{8}$/, 'يجب أدخال رقم الهاتف بشكل صحيح'),
  readyAt: z.string({ message: 'يجب أدخال تاريخ التسليم' }),
  billNo: z.string({ message: 'يجب أدخال رقم الفاتورة' }),
  sellingPrice: z.number({ message: 'يجب أدخال سعر التكلفة' }),
  notes: z.string().optional(),
  deliveryNote: z.string().optional(),
  products: z
    .array(
      z.object({
        id: z.number().optional(),
        productId: z.number(),
        productDesignId: z.number(),
        fabric: z.string().optional(),
        file: z.instanceof(File).optional(),
        quantity: z.number(),
        note: z.string().optional(),
        productionTeamId: z.number(),
        image: z.any(),
        productionTeamName: z.string().optional(),
        productDesignName: z.string().optional(),
        productName: z.string().optional()
      })
    )
    .optional()
})

export type Schema = z.infer<typeof schema>

const NewOrder = ({ initValues }: { initValues?: Schema }) => {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: initValues
  })

  const [currentTab, setCurrentTab] = useState('basicInfo')
  const [openDialog, setOpenDialog] = useState(false)
  const [openNoteDialog, setOpenNoteDialog] = useState(false)
  const [productToBeEdited, setProductToBeEdited] = useState<localNewProduct | undefined>(undefined)
  const [addedProducts, setAddedProducts] = useState<localNewProduct[]>([])
  const [productionLines, setProductionLines] = useState<ProductionLineProps[]>([])
  const [productionTeams, setProductionTeams] = useState<ProductionTeam[]>([])
  const [designs, setDesigns] = useState<{ id: number; name: string }[]>([])
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: fetchedData } = useQuery({
    queryKey: ['factories'],
    queryFn: () =>
      getApi<{
        factories: FactoryInterface[]
        total: number
        pageNumber: number
        pageSize: number
        pages: number
      }>('/Factories', {
        params: { size: 1000000000 }
      })
  })
  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: () =>
      getApi<{
        products: Product[]
      }>('/Products', {
        params: { size: 1000000000 }
      })
  })

  const getProductionLines = async (factoryId: string) =>
    // get factory and inside it production lines and production teams
    getApi<{
      factory: FactoryInterface
      productionLines: any[]
      productionTeams: any[]
    }>(`/Factories/${factoryId}`, {}).then((response) => {
      return setProductionLines(response.data.productionLines || [])
    })
  const getDesigns = async (productId: number) =>
    getApi<{ designs: { id: number; name: string }[] }>(`/Products/${productId}`, {}).then(
      (response) => {
        return setDesigns(response.data.designs)
      }
    )
  const getProductionTeams = async (productionLineId: string) =>
    // get it from the productionLines state array
    setProductionTeams(productionLines.find((line) => line.id === productionLineId)?.teams || [])
  const { mutate: createOrder, isPending: createOrderPending } = useMutation({
    mutationFn: (data: localNewProduct) => {
      return postApi<NewOrderProp>('/Orders', data)
    },
    onSuccess: (response) => {
      console.log(response)
      createOrderItems(response?.data.id)
    },
    onError: (error: any) => {
      if (error.response?.data?.error === 'DuplicateOrder') {
        const billNo = error.response?.data?.message?.match(/\d+/)?.[0] || ''
        toast({
          title: 'فشلت عملية الحفظ',
          description: `رقم الفاتورة ${billNo} مكرر`,
          variant: 'destructive'
        })
        return
      }
      // handle other errors
      toast({
        title: 'فشلت عملية الحفظ',
        description: `حصل خطأ ما`,
        variant: 'destructive'
      })
      console.error('Error creating order:', error)
    }
  })
  const { mutate: createOrderItems, isPending: createOrderItemsPending } = useMutation({
    mutationFn: async (id: number) => {
      await Promise.all(
        addedProducts.map(async (product) => {
          const payloadFormData = new FormData()
          payloadFormData.append('productDesignId', product.productDesignId.toString())
          if (product.fabric) {
            payloadFormData.append('fabric', product.fabric)
          }
          payloadFormData.append('quantity', product.quantity.toString())
          if (product.note) {
            payloadFormData.append('note', product.note || 'بدون ملاحظات')
          }
          if (product.file) {
            payloadFormData.append('file', product.file)
          }
          payloadFormData.append('productionTeamId', product.productionTeamId.toString())

          // Handle both File objects and string URLs for images
          if (product.images && product.images.length > 0) {
            product.images.forEach((image) => {
              payloadFormData.append(`images`, image)
            })
          }
          const orderItem = await postApi<OrderItem>(`/Orders/${id}/OrderItems`, payloadFormData)
          return createOrderItemsTimeline({
            id: orderItem?.data?.id,
            productTeamId: product.productionTeamId
          })
        })
      )
    },
    onSuccess: () => {
      toast({
        title: 'تم الحفظ بنجاح',
        description: `تم حفظ الطلب بنجاح`,
        variant: 'success'
      })
    },
    onError: (error, id) => {
      toast({
        title: 'فشلت عملية الحفظ',
        description: `حصل خطأ ما`,
        variant: 'destructive'
      })
      console.error('Error creating order items', error)
      // delete the order
      deleteApi(`/Orders/${id}`)
    }
  })
  const { mutate: createOrderItemsTimeline } = useMutation({
    mutationFn: async ({ id, productTeamId }: { id: number; productTeamId: number }) => {
      await postApi(`/OrderItems/${id}/Timelines`, {
        productionTeamId: productTeamId.toString(),
        status: 1,
        receivedAt: new Date(new Date().getTime() + 3 * 60 * 60 * 1000).toISOString() // Adding 3 hours
      })
    },
    onSuccess: () => {
      toast({
        title: 'تم الحفظ بنجاح',
        description: `تم حفظ الطلب بنجاح`,
        variant: 'success'
      })
      navigate('/orders')
    },
    onError: (error) => {
      toast({
        title: 'فشلت عملية الحفظ',
        description: `حصل خطأ ما`,
        variant: 'destructive'
      })
      console.error('Error creating order items', error)
    }
  })
  const onSubmit = async (data: Schema) => {
    console.log(data)
    if (addedProducts.length === 0) {
      toast({
        title: 'فشلت عملية الحفظ',
        description: `لم تتم اضافة المنتجات`,
        variant: 'destructive'
      })
      return
    }
    try {
      const payload = {
        billNo: data.billNo,
        customerName: data.customerName,
        readyAt: data.readyAt,
        deliveryNote: data.deliveryNote || '',
        orderState: 1,
        sellingPrice: data.sellingPrice,
        costPrice: 0,
        customerNo: data.customerNo,
        note: data.notes
      } as unknown as localNewProduct
      createOrder(payload)
    } catch (error) {
      console.error('Error creating order:', error)
      toast({
        title: 'فشلت عملية الحفظ',
        description: `حصل خطأ ما`,
        variant: 'destructive'
      })
    }
  }
  const handleAddProductToArray = (newProduct: localNewProduct) => {
    console.log(newProduct)
    const product = {
      ...newProduct,
      // add id to the product
      id: Math.random(),
      // add production team name
      productionTeamName:
        productionTeams.find((team) => Number(team.id) === newProduct.productionTeamId)?.name || '',
      // add product design name
      productDesignName:
        designs.find((design) => design.id === newProduct.productDesignId)?.name || '',
      // add product name
      productName:
        productsData?.data.products.find((product) => product.id === newProduct.productId)?.name ||
        ''
    }
    setAddedProducts([...addedProducts, product])
  }
  React.useEffect(() => {
    console.log(addedProducts)
    if (addedProducts.length > 1) {
      form.setValue('products', addedProducts)
    }
  }, [addedProducts])
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
  }, [errors])

  const handleUpdateProductInArray = (updatedProduct: localNewProduct) => {
    const editProduct = {
      ...updatedProduct,
      id: updatedProduct.id ?? Math.random(),
      productionTeamName:
        productionTeams.find((team) => Number(team.id) === updatedProduct.productionTeamId)?.name ||
        '',
      productDesignName:
        designs.find((design) => design.id === updatedProduct.productDesignId)?.name || '',
      productName:
        productsData?.data.products.find((product) => product.id === updatedProduct.productId)
          ?.name || '',
      // Ensure images are preserved
      images: updatedProduct.images || []
    }
    setAddedProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === updatedProduct.id ? editProduct : product))
    )
    clearProductToEdit()
  }
  const clearProductToEdit = () => {
    setProductToBeEdited(undefined)
  }
  const clearFactoriesProductionLinesTeams = () => {
    queryClient.resetQueries({ queryKey: ['factories'] })
    queryClient.resetQueries({ queryKey: ['productionLines'] })
    queryClient.resetQueries({ queryKey: ['productionTeams'] })
    queryClient.resetQueries({ queryKey: ['products'] })
    clearProductToEdit()
  }

  const handleNext = () => {
    if (currentTab === 'basicInfo') {
      setCurrentTab('itemsList')
    }
  }

  const handleBack = () => {
    if (currentTab === 'itemsList') {
      setCurrentTab('basicInfo')
    }
  }
  const removeProduct = (product: OrderItem) => {
    console.log(product)
    // remove product from the list of products
    const newProducts = addedProducts.filter((item) => item.id !== product.id)
    setAddedProducts(newProducts)
  }

  const columns = [
    {
      accessorKey: 'productName',
      header: 'اسم المنتج',
      cell: (info) => {
        const { original } = info.row
        return original ? (
          <>
            <div>{original.productName}</div>
          </>
        ) : null
      }
    },
    {
      accessorKey: 'fabric',
      header: 'نوع القماش',
      cell: (info) => {
        const { original } = info.row
        return original ? (
          <>
            <div>{original.fabric}</div>
          </>
        ) : null
      }
    },
    {
      accessorKey: 'productDesignName',
      header: 'تصميم المنتج',
      cell: (info) => {
        const { original } = info.row
        return original ? (
          <>
            <div>{original.productDesignName}</div>
          </>
        ) : null
      }
    },
    {
      accessorKey: 'quantity',
      header: 'الكمية',
      cell: (info) => info.row.original.quantity
    },
    {
      accessorKey: 'productionTeamName',
      header: 'اسم الفريق',
      cell: (info) => {
        const { original } = info.row
        return original ? (
          <>
            <div>{original.productionTeamName}</div>
          </>
        ) : null
      }
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
                      setProductToBeEdited(original)
                    }}
                  >
                    <DropdownMenuItem>تعديل</DropdownMenuItem>
                  </a>
                  <DropdownMenuItem
                    onClick={() => removeProduct(original)}
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
    <section className="p-5">
      <div className="mb-3 flex items-start justify-between">
        <BackBtn href="/orders" />
      </div>
      <div className="mt-10">
        <Form {...form}>
          <form className="flex gap-4 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  backgroundColor: 'transparent'
                }}
              >
                <TabsTrigger value="basicInfo">البيانات الأساسية</TabsTrigger>
                <TabsTrigger value="itemsList">قائمة المنتجات</TabsTrigger>
              </TabsList>
              <TabsContent value="basicInfo">
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h1 className="text-2xl font-bold">البيانات الأساسية</h1>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <FormField
                      control={form.control}
                      name="customerNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            {/* <Input
                              maxLength={16}
                              {...field}
                              placeholder="رقم العميل"
                              martial
                              label="رقم العميل"
                            /> */}
                            <PhoneInput
                              value={field.value}
                              onChange={(value) => {
                                console.log(value)
                                form.setValue('customerNo', value)
                              }}
                              countries={['SA']}
                              defaultCountry="SA"
                              maxLength={16}
                              className="flex-row-reverse rounded-sm"
                              labels={{
                                SA: 'السعودية'
                              }}
                              title="رقم العميل"
                              placeholder="5********"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="customerName"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="اسم العميل" martial label="اسم العميل" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* deliveryDate */}
                    <FormField
                      control={form.control}
                      name="readyAt"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} type="date" martial label="التاريخ المتوقع للتسليم" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* billNom */}
                    <FormField
                      control={form.control}
                      name="billNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="رقم الفاتورة"
                              martial
                              label="رقم الفاتورة"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* sellingPrice */}
                    <FormField
                      control={form.control}
                      name="sellingPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="سعر التكلفة"
                              martial
                              label="سعر التكلفة"
                              onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => {
                        setOpenNoteDialog(true)
                      }}
                      className="ml-2"
                    >
                      اضافة ملاحظات التوصيل
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="itemsList">
                <div className="bg-white p-5 rounded-lg shadow-sm col-span-3">
                  {/* add product button */}
                  <div className="flex items-center gap-1 justify-between">
                    <h4 className="col-span-2 font-bold">قائمة المنتجات</h4>

                    <Button
                      variant="link"
                      className="text-lg text-primary flex items-center gap-1"
                      type="button"
                      onClick={() => {
                        setProductToBeEdited(undefined)
                        clearFactoriesProductionLinesTeams()
                        setOpenDialog(true)
                      }}
                    >
                      <PlusCircle />
                      إضافة منتج
                    </Button>
                  </div>
                  <StructureTable<localNewProduct, unknown>
                    columns={columns}
                    data={addedProducts}
                    title="المنتجات المضافة"
                  />

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="col-span-3">
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem className="">
                            <FormControl>
                              <Textarea
                                className="bg-white"
                                rows={10}
                                {...field}
                                placeholder="ملاحظات عامة"
                              ></Textarea>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex mt-2 flex-row gap-2 justify-end">
              {currentTab !== 'basicInfo' && (
                <div className="hover:marker:" onClick={handleBack}>
                  <div className="flex justify-end">
                    <Button type="button" size="lg">
                      السابق
                    </Button>
                  </div>
                </div>
              )}
              {currentTab !== 'itemsList' && (
                <div className="hover:marker:" onClick={handleNext}>
                  <div className="flex justify-end">
                    <Button type="button" size="lg">
                      التالي
                    </Button>
                  </div>
                </div>
              )}
              {currentTab === 'itemsList' && (
                <div className="flex justify-end">
                  <Button
                    disabled={createOrderPending || createOrderItemsPending}
                    className="bg-green-500 hover:bg-green-700"
                    type="submit"
                    size="lg"
                  >
                    {createOrderPending || createOrderItemsPending ? (
                      <Loader color="black" />
                    ) : (
                      'حفظ'
                    )}
                  </Button>
                </div>
              )}
            </div>
            <NewOrderItemDialog
              isOpen={openDialog}
              onClose={() => setOpenDialog(false)}
              factories={fetchedData?.data.factories || []}
              products={productsData?.data.products || []}
              productionLines={productionLines || []}
              productionTeams={productionTeams || []}
              designs={designs}
              selectFactory={(id) => {
                // call method to get production lines
                getProductionLines(id)
              }}
              selectProductionLine={(id) => {
                // call method to get production teams
                getProductionTeams(id)
              }}
              selectProduct={(id) => {
                // call method to get designs
                getDesigns(id)
              }}
              addProductToProductsArray={handleAddProductToArray}
              updateProductInProductsArray={handleUpdateProductInArray}
              productToEdit={productToBeEdited}
              clearProductToEdit={clearProductToEdit}
            />
            <NewOrderNoteDialog
              addDeliveryNote={(note) => {
                form.setValue('deliveryNote', note || '')
              }}
              isOpen={openNoteDialog}
              onClose={() => {
                setOpenNoteDialog(false)
              }}
              note={form.getValues('deliveryNote')}
            />
          </form>
        </Form>
      </div>
    </section>
  )
}

export default NewOrder
