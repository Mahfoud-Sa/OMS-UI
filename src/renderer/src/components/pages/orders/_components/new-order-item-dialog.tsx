import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@renderer/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@renderer/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { Textarea } from '@renderer/components/ui/textarea'
import { FactoryInterface, Product, ProductionLineProps, ProductionTeam } from '@renderer/types/api'
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
  designs: { id: string; name: string }[]
  factories: FactoryInterface[]
  productionLines: ProductionLineProps[]
  productionTeams: ProductionTeam[]
  products: Product[]
}

const schema = z.object({
  image: z.string().optional(),
  name: z.string().nonempty({ message: 'Name is required' }),
  designId: z.string().nonempty({ message: 'Design is required' }),
  fabric: z.string().nonempty({ message: 'Fabric is required' }),
  quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
  note: z.string().optional(),
  factoryId: z.string().nonempty({ message: 'Factory is required' }),
  productionLineId: z.string().nonempty({ message: 'Production Line is required' }),
  productionTeamId: z.string().nonempty({ message: 'Production Team is required' })
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
  selectProductionLine
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      image: '',
      name: '',
      designId: '',
      fabric: '',
      quantity: 1,
      note: '',
      factoryId: '',
      productionLineId: '',
      productionTeamId: ''
    }
  })

  const handleSave = (data: FormData) => {
    // Handle save logic here
    console.log(data)
    onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose && onClose()
      }}
    >
      <DialogContent className="min-w-80" style={{ minWidth: '80%', height: '80%' }}>
        <DialogHeader>اضافة منتج جديد</DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <div className="flex flex-wrap mb-6 flex-col">
              <div className="">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="Image" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-row">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select<Product>
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
                            products.find((product) => String(product.id) === field.value) || null
                          }
                          placeholder="Select Product"
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
                  name="designId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select<{ id: string; name: string }>
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
                          onChange={(selectedOption: SingleValue<{ id: string; name: string }>) => {
                            field.onChange(selectedOption?.id)
                          }}
                          value={designs.find((design) => design.id === field.value) || null}
                          placeholder="Select Design"
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
                  name="fabric"
                  render={({ field }) => (
                    <FormItem title="Fabric">
                      <FormControl>
                        <Input {...field} placeholder="Fabric" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} type="number" placeholder="Quantity" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea {...field} placeholder="Note" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="factoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select<FactoryInterface>
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
                          value={factories.find((factory) => factory.id === field.value) || null}
                          placeholder="Select Factory"
                          isSearchable
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="productionLineId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select<ProductionLineProps>
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
                          value={productionLines.find((line) => line.id === field.value) || null}
                          placeholder="Select Production Line"
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
              <div className="">
                <FormField
                  control={form.control}
                  name="productionTeamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select<ProductionTeam>
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
                          value={productionTeams.find((team) => team.id === field.value) || null}
                          placeholder="Select Production Team"
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
            <div className="flex justify-end mt-4">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="ml-2">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default NewOrderItemDialog
