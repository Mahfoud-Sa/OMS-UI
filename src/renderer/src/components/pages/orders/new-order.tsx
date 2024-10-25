import { zodResolver } from '@hookform/resolvers/zod'
import { Icons } from '@renderer/components/icons/icons'
import BackBtn from '@renderer/components/layouts/back-btn'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import { Textarea } from '@renderer/components/ui/textarea'
import { getApi } from '@renderer/lib/http'
import {
  FactoryInterface,
  OrderItem,
  OrderItemTable,
  Product,
  ProductionLineProps,
  ProductionTeam
} from '@renderer/types/api'
import { useQuery } from '@tanstack/react-query'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import NewOrderItemDialog from './_components/new-order-item-dialog'

const schema = z.object({
  customerName: z.string({ message: 'يجب أدخال اسم العميل' }),
  customerNo: z
    .string({ message: 'يجب أدخال رقم العميل' })
    .regex(/^5\d{8}$/, 'يجب أدخال رقم الهاتف بشكل صحيح'),
  deliveryAt: z.string({ message: 'يجب أدخال تاريخ التسليم' }),
  billNo: z.string({ message: 'يجب أدخال رقم الفاتورة' }),
  costPrice: z.number({ message: 'يجب أدخال سعر التكلفة' }),
  notes: z.string(),
  products: z.array(
    z.object({
      name: z.string(),
      productDesignId: z.number(),
      fabric: z.string(),
      quantity: z.number(),
      note: z.string(),
      productionTeamId: z.number(),
      images: z.string()
    })
  )
})

export type Schema = z.infer<typeof schema>

const NewOrder = ({ initValues }: { initValues?: Schema }) => {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: initValues
  })

  const [currentTab, setCurrentTab] = useState('basicInfo')
  const [openDialog, setOpenDialog] = useState(false)
  const [productToBeEdited, setProductToBeEdited] = useState<OrderItemTable | null>(null)
  const [addedProducts, setAddedProducts] = useState<OrderItemTable[]>([])
  const [productionLines, setProductionLines] = useState<ProductionLineProps[]>([])
  const [productionTeams, setProductionTeams] = useState<ProductionTeam[]>([])
  const [designs, setDesigns] = useState<{ id: string; name: string }[]>([])
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
      return setProductionLines(response.data.factory.productionLines || [])
    })
  const getDesigns = async (productId: number) =>
    getApi<{ designs: { id: string; name: string }[] }>(`/Products/${productId}`, {}).then(
      (response) => {
        return setDesigns(response.data.designs)
      }
    )
  const getProductionTeams = async (productionLineId: string) =>
    // get it from the productionLines state array
    setProductionTeams(productionLines.find((line) => line.id === productionLineId)?.teams || [])

  const onSubmit = () => {}

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
  }

  const columns = [
    {
      accessorKey: 'name',
      header: 'اسم الصنف',
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
      accessorKey: 'fabric',
      header: 'نوع القماش',
      cell: (info) => info.row.original.fabric
    },
    {
      accessorKey: 'productDesignName',
      header: 'نوع الصنف',
      cell: (info) => info.row.original.productDesignName
    },
    {
      accessorKey: 'quantity',
      header: 'الكمية',
      cell: (info) => info.row.original.quantity
    },
    {
      accessorKey: 'productionTeamName',
      header: 'اسم الفريق',
      cell: (info) => info.row.original.productionTeamName
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
      <BackBtn href="/orders" />
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
                <TabsTrigger value="itemsList">قائمة الأصناف</TabsTrigger>
              </TabsList>
              <TabsContent value="basicInfo">
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h1 className="text-2xl font-bold">البيانات الأساسية</h1>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="رقم العميل" martial label="رقم العميل" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="customerNo"
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
                      name="deliveryAt"
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
                    {/* costPrice */}
                    <FormField
                      control={form.control}
                      name="costPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="سعر التكلفة"
                              martial
                              label="سعر التكلفة"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="itemsList">
                <div className="bg-white p-5 rounded-lg shadow-sm col-span-3">
                  {/* add product button */}
                  <div className="flex items-center gap-1 justify-between">
                    <h4 className="col-span-2 font-bold">قائمة الأصناف</h4>

                    <Button
                      variant="link"
                      className="text-lg text-primary flex items-center gap-1"
                      type="button"
                      onClick={() => setOpenDialog(true)}
                    >
                      <PlusCircle />
                      إضافة تصميم
                    </Button>
                  </div>
                  <StructureTable<OrderItemTable, unknown>
                    columns={columns}
                    data={addedProducts}
                    title="المنتجات المضافة"
                  />

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="col-span-3">
                      <FormField
                        control={form.control}
                        name="customerName"
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
                  <Button className="bg-green-500 hover:bg-green-700" type="submit" size="lg">
                    حفظ
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
            />
          </form>
        </Form>
      </div>
    </section>
  )
}

export default NewOrder
