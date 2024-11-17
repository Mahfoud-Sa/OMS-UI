import { Button } from '@renderer/components/ui/button'
import { Combobox } from '@renderer/components/ui/combobox'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@renderer/components/ui/sheet'
import { getApi } from '@renderer/lib/http'
import {
  Factory,
  FactoryInterface,
  Product,
  ProductionLineProps,
  ProductionTeam
} from '@renderer/types/api'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

interface FilterSheetProps {
  open: boolean
  filterOptions: FilterOptions
  setFilterOptions: (options: FilterOptions) => void
  onClose: () => void
  onApply: (filterOptions: FilterOptions) => void
}

interface FilterOptions {
  factory: string
  productionLine: string
  productionTeam: string
  product: string
  date: {
    from: string
    to: string
  }
}

const FilterSheet: React.FC<FilterSheetProps> = ({
  open,
  onClose,
  onApply,
  filterOptions,
  setFilterOptions
}: FilterSheetProps) => {
  const [factoryId, setFactoryId] = useState(1)
  const [productionLinesData, setProductionLines] = useState<ProductionLineProps[]>([])
  const [productionTeams, setProductionTeams] = useState<ProductionTeam[]>([])
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

  const { data: products } = useQuery({
    queryKey: ['Products'],
    queryFn: () =>
      getApi<{ products: Product[] }>('/Products', {
        params: {
          size: 1000000
        }
      })
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

  const handleApply = () => {
    onApply(filterOptions)
    onClose()
  }

  const handleReset = () => {
    setFilterOptions({
      ...filterOptions,
      factory: '',
      productionLine: '',
      productionTeam: '',
      product: ''
    })
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto" side={'left'}>
        <SheetHeader>
          <SheetTitle>تصفية النتائج</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>المصنع</Label>
            <Combobox
              selectedValue={
                factories?.data.factories.find(
                  (factory) => factory.id === Number(filterOptions.factory)
                ) || null
              }
              options={factories?.data.factories || []}
              valueKey="id"
              displayKey="name"
              placeholder="أختر مصنع"
              emptyMessage="لم يتم العثور علئ مصنع"
              onSelect={(factory) => {
                setFilterOptions({ ...filterOptions, factory: String(factory?.id) })
                setFactoryId(factory?.id)
              }}
            />
          </div>
          <div>
            <Label>خط الانتاج</Label>
            <Combobox
              selectedValue={
                productionLinesData.find((line) => line.id === filterOptions.productionLine) || null
              }
              options={productionLinesData || []}
              valueKey="id"
              disabled={productionLinesData.length == 0}
              displayKey="name"
              placeholder="أختر خط انتاج"
              emptyMessage="لم يتم العثور علئ اي خط انتاج"
              onSelect={(line) => {
                setFilterOptions({ ...filterOptions, productionLine: String(line?.id) })
                getProductionTeams(line as ProductionLineProps)
              }}
            />
          </div>
          <div>
            <Label>فرقة الانتاج</Label>
            <Combobox
              selectedValue={
                productionTeams?.find((team) => team.id === filterOptions.productionTeam) || null
              }
              disabled={productionTeams.length == 0}
              options={productionTeams || []}
              valueKey="id"
              displayKey="name"
              placeholder="أختر فريق"
              emptyMessage="لم يتم العثور علئ الفريق"
              onSelect={(team) =>
                setFilterOptions({ ...filterOptions, productionTeam: String(team?.id) })
              }
            />
          </div>
          <div>
            <Label>المنتج</Label>
            <Combobox
              selectedValue={
                products?.data.products.find(
                  (product) => product.id === Number(filterOptions.product)
                ) || null
              }
              options={products?.data.products || []}
              valueKey="id"
              displayKey="name"
              placeholder="أختر منتج"
              emptyMessage="لم يتم العثور علئ منتج"
              onSelect={(product) =>
                setFilterOptions({ ...filterOptions, product: String(product?.id) })
              }
            />
          </div>
          <div>
            <Label>حسب التاريخ</Label>
            <div className="flex gap-4 mt-2">
              <Input
                type="date"
                label={'من'}
                onChangeCapture={(e) => {
                  const fromDate = (e.target as HTMLInputElement).value
                  setFilterOptions({
                    ...filterOptions,
                    date: { ...filterOptions.date, from: fromDate }
                  })
                }}
                value={filterOptions.date.from}
                max={filterOptions.date.to}
              />
              <Input
                type="date"
                label={'الى'}
                min={filterOptions.date.from}
                onChangeCapture={(e) => {
                  const toDate = (e.target as HTMLInputElement).value
                  console.log(toDate)
                  setFilterOptions({
                    ...filterOptions,
                    date: { ...filterOptions.date, to: toDate }
                  })
                }}
                value={filterOptions.date.to}
              />
            </div>
          </div>
        </div>
        <SheetFooter>
          <div className="flex gap-3 w-60">
            <Button onClick={handleReset} className="w-full" variant="outline">
              الغاء
            </Button>
            <Button onClick={handleApply} className="w-full">
              تطبيق
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default FilterSheet
