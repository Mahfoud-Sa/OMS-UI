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
import { Factory, ProductionLines, ProductionTeam } from '@renderer/types/api'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

interface FilterSheetProps {
  open: boolean
  onClose: () => void
  onApply: (filterOptions: FilterOptions) => void
}

interface FilterOptions {
  factory: string
  productionLine: string
  productionTeam: string
  sortBy: string
  price: {
    min: number
    max: number
  }
  date: {
    from: string
    to: string
  }
  orderState: string
}

const FilterSheet: React.FC<FilterSheetProps> = ({ open, onClose, onApply }: FilterSheetProps) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    factory: '',
    productionLine: '',
    productionTeam: '',
    sortBy: 'asc',
    price: {
      min: 0,
      max: 0
    },
    date: {
      from: '',
      to: ''
    },
    orderState: ''
  })
  const orderStates = [
    { id: '0', name: 'قيد الانتظار' },
    { id: '1', name: 'قيد التنفيذ' },
    { id: '2', name: 'مكتمل' },
    { id: '3', name: 'تم التسليم' },
    { id: '4', name: 'ملغى' }
  ]

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
  const { data: productionTeamsData } = useQuery({
    queryKey: ['production_teams'],
    queryFn: () => getApi<ProductionTeam[]>('/ProductionTeams')
  })

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
      sortBy: 'asc',
      orderState: '5'
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
              }}
            />
          </div>
          <div>
            <Label>خط الانتاج</Label>
            <Combobox
              selectedValue={
                productionLines?.data.find(
                  (line) => line.id === Number(filterOptions.productionLine)
                ) || null
              }
              options={productionLines?.data || []}
              valueKey="id"
              displayKey="name"
              placeholder="أختر خط انتاج"
              emptyMessage="لم يتم العثور علئ اي خط انتاج"
              onSelect={(line) =>
                setFilterOptions({ ...filterOptions, productionLine: String(line?.id) })
              }
            />
          </div>
          <div>
            <Label>فرقة الانتاج</Label>
            <Combobox
              selectedValue={
                productionTeamsData?.data.find(
                  (team) => team.id === filterOptions.productionTeam
                ) || null
              }
              disabled={productionTeamsData?.data.length == 0}
              options={productionTeamsData?.data || []}
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
            <Label>حالة الطلب</Label>
            <Combobox
              selectedValue={
                orderStates?.find((state) => state.id === filterOptions.orderState) || null
              }
              options={orderStates}
              valueKey="id"
              displayKey="name"
              placeholder="أختر حالة الطلب"
              onSelect={(state) => setFilterOptions({ ...filterOptions, orderState: state?.id })}
            />
          </div>
          <div>
            <Label>الترتيب حسب</Label>
            <div className="flex w-full">
              <Button
                onClick={() => setFilterOptions({ ...filterOptions, sortBy: 'desc' })}
                className="w-full rounded-e-none"
                variant={filterOptions.sortBy === 'desc' ? 'default' : 'outline'}
                value={'desc'}
              >
                الاحدث
              </Button>
              <Button
                onClick={() => setFilterOptions({ ...filterOptions, sortBy: 'asc' })}
                className="w-full rounded-s-none"
                variant={filterOptions.sortBy === 'asc' ? 'default' : 'outline'}
                value={'asc'}
              >
                الاقدم
              </Button>
            </div>
          </div>
          <div>
            <Label>السعر</Label>
            <div className="flex gap-4 mt-2">
              <Input
                type="number"
                label={'الحد الادنى'}
                onChangeCapture={(e) => {
                  setFilterOptions({
                    ...filterOptions,
                    price: { ...filterOptions.price, min: +(e.target as HTMLInputElement).value }
                  })
                }}
                value={filterOptions.price.min}
                max={filterOptions.price.max}
              />
              <Input
                type="number"
                label={'الحد الاعلى'}
                onChangeCapture={(e) => {
                  setFilterOptions({
                    ...filterOptions,
                    price: { ...filterOptions.price, max: +(e.target as HTMLInputElement).value }
                  })
                }}
                value={filterOptions.price.max}
                min={filterOptions.price.min}
              />
            </div>
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
