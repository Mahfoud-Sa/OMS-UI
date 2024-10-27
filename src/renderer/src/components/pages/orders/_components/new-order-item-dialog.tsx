import { zodResolver } from '@hookform/resolvers/zod'
import imageProfile from '@renderer/assets/images/input-frame.png'
import ProfileUploader from '@renderer/components/file-uploader/ProfileUploader'
import { Button } from '@renderer/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@renderer/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { Textarea } from '@renderer/components/ui/textarea'
import {
  FactoryInterface,
  localNewProduct,
  Product,
  ProductionLineProps,
  ProductionTeam
} from '@renderer/types/api'
import React from 'react'
import { useForm } from 'react-hook-form'
import Select, { SingleValue } from 'react-select'
import * as z from 'zod'

interface NewOrderItemDialogProps {
  isOpen: boolean
  onClose: () => void
  selectFactory: (factoryId: string) => void
  selectProductionLine: (productionLineId: string) => void
  selectProduct: (productId: number) => void
  designs: { id: number; name: string }[]
  factories: FactoryInterface[]
  productionLines: ProductionLineProps[]
  productionTeams: ProductionTeam[]
  products: Product[]
  addProductToProductsArray: (newProduct: localNewProduct) => void
  updateProductInProductsArray: (updatedProduct: localNewProduct) => void // Add this line
  productToEdit?: localNewProduct // Add this line
  clearProductToEdit: () => void // Add this line
}
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes

const schema = z.object({
  id: z.number().optional(),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: 'حجم الصور يجب أن يكون أقل من 5 ميجابايت'
    })
    .refine((file) => file.type.startsWith('image/'), {
      message: 'يجب أن تكون الصورة من نوع صورة (JPEG, PNG, GIF, إلخ)'
    })
    .optional(),
  productId: z.number({ message: 'اسم المنتج مطلوب' }),
  productDesignId: z.number({ message: 'التصميم مطلوب' }),
  fabric: z.string({ message: 'القماش مطلوب' }),
  quantity: z.number().min(1, { message: 'الكمية يجب أن تكون على الأقل 1' }),
  note: z.string().optional(),
  factoryId: z.number({ message: 'المصنع مطلوب' }),
  productionLineId: z.number({ message: 'خط الإنتاج مطلوب' }),
  productionTeamId: z.number({ message: 'فريق الإنتاج مطلوب' })
})

type FormData = z.infer<typeof schema>

const NewOrderItemDialog: React.FC<NewOrderItemDialogProps> = ({
  isOpen,
  onClose,
  designs,
  factories,
  productionLines,
  productionTeams,
  products,
  selectProduct,
  selectFactory,
  selectProductionLine,
  addProductToProductsArray,
  updateProductInProductsArray, // Add this line
  productToEdit, // Add this line
  clearProductToEdit // Add this line
}) => {
  const defaultValues: FormData = {
    image: new File([], ''),
    productId: 0,
    productDesignId: 0,
    fabric: '',
    quantity: 1,
    note: '',
    factoryId: 0,
    productionLineId: 0,
    productionTeamId: 0
  }

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: productToEdit || defaultValues
  })

  React.useEffect(() => {
    if (productToEdit) {
      form.reset(productToEdit)
      form.setValue('id', productToEdit.id)
    }
  }, [productToEdit])

  const handleSave = (data: FormData) => {
    if (productToEdit) {
      // Update existing product
      updateProductInProductsArray({
        ...data,
        note: data.note || '',
        image: data.image || new File([], '')
      })
    } else {
      // Add new product
      addProductToProductsArray({
        ...data,
        note: data.note || '',
        image: data.image || new File([], '')
      })
    }
    // Clear the form
    form.reset(defaultValues)
    clearProductToEdit()
    onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose && onClose()
      }}
    >
      <DialogContent className="min-w-80" style={{ minWidth: '80%', height: '90%' }}>
        <DialogHeader>{productToEdit ? 'تعديل المنتج' : 'اضافة منتج جديد'}</DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <div className="flex flex-wrap mb-2 flex-col">
              <div className="my-3 grid grid-cols-3 gap-3 items-center">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ProfileUploader
                          className="h-[100px] w-[175px]"
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="my-3 grid grid-cols-3 gap-3 items-center">
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select<Product>
                          isDisabled={products.length === 0}
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              height: '5.2vh',
                              borderRadius: '0.5rem'
                            })
                          }}
                          {...field}
                          options={products.map((product) => ({
                            ...product,
                            label: product.name,
                            value: product.id
                          }))}
                          onChange={(selectedOption: SingleValue<Product>) => {
                            field.onChange(selectedOption?.id)
                            selectProduct(selectedOption?.id || 0)
                          }}
                          value={
                            products.find((product) => product.id === Number(field.value)) || null
                          }
                          placeholder="اختر المنتج"
                          isSearchable
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => String(option.id)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productDesignId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select<{ id: number; name: string }>
                          isDisabled={designs.length === 0}
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              height: '5.2vh',
                              borderRadius: '0.5rem'
                            })
                          }}
                          {...field}
                          options={designs.map((design) => ({
                            ...design,
                            label: design.name,
                            value: design.id
                          }))}
                          onChange={(selectedOption: SingleValue<{ id: number; name: string }>) => {
                            field.onChange(selectedOption?.id)
                          }}
                          value={designs.find((design) => design.id === field.value) || null}
                          placeholder="اختر التصميم"
                          isSearchable
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => String(option.id)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fabric"
                  render={({ field }) => (
                    <FormItem title="Fabric">
                      <FormControl>
                        <Input {...field} placeholder="القماش" label="القماش" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="my-3 grid grid-cols-2 gap-3 items-center">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          label="الكمية"
                          placeholder="الكمية"
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <>
                          <Label>ملاحظات على الصنف</Label>
                          <Textarea
                            title="ملاحظة المنتج"
                            {...field}
                            placeholder="ملاحظات على الصنف"
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="my-3 grid grid-cols-3 gap-3 items-center">
                <FormField
                  control={form.control}
                  name="factoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select<FactoryInterface>
                          isDisabled={factories.length === 0}
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              height: '5.2vh',
                              borderRadius: '0.5rem'
                            })
                          }}
                          {...field}
                          options={factories.map((factory) => ({
                            ...factory,
                            label: factory.name,
                            value: factory.id
                          }))}
                          onChange={(selectedOption: SingleValue<FactoryInterface>) => {
                            field.onChange(selectedOption?.id)
                            selectFactory(selectedOption?.id || '')
                          }}
                          value={
                            factories.find(
                              (factory) => String(factory.id) === String(field.value)
                            ) || null
                          }
                          placeholder="اختر المصنع"
                          isSearchable
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productionLineId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select<ProductionLineProps>
                          isDisabled={productionLines.length === 0}
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              height: '5.2vh',
                              borderRadius: '0.5rem'
                            })
                          }}
                          {...field}
                          options={productionLines.map((line) => ({
                            ...line,
                            label: line.name,
                            value: line.id
                          }))}
                          onChange={(selectedOption: SingleValue<ProductionLineProps>) => {
                            field.onChange(selectedOption?.id)
                            selectProductionLine(selectedOption?.id || '')
                          }}
                          value={
                            productionLines.find(
                              (line) => Number(line.id || '0') === field.value
                            ) || null
                          }
                          placeholder="اختر خط الانتاج"
                          isSearchable
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productionTeamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select<ProductionTeam>
                          isDisabled={productionTeams.length === 0}
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              height: '5.2vh',
                              borderRadius: '0.5rem'
                            })
                          }}
                          {...field}
                          options={productionTeams.map((team) => ({
                            ...team,
                            label: team.name,
                            value: team.id
                          }))}
                          onChange={(selectedOption: SingleValue<ProductionTeam>) => {
                            field.onChange(selectedOption?.id)
                          }}
                          value={
                            productionTeams.find(
                              (team) => Number(team.id || '0') === field.value
                            ) || null
                          }
                          placeholder="اختر فرقة الانتاج"
                          isSearchable
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" onClick={onClose}>
                الغاء
              </Button>
              <Button onClick={form.handleSubmit(handleSave)} className="ml-2">
                {productToEdit ? 'تعديل' : 'حفظ'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default NewOrderItemDialog
