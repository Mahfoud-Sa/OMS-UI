import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@renderer/components/ui/sheet'
import { useAuthUser } from 'react-auth-kit'

interface FilterSheetProps {
  open: boolean
  filterOptions: FilterOptions
  setFilterOptions: (options: FilterOptions) => void
  onClose: () => void
  onApply: (filterOptions: FilterOptions) => void
}

interface FilterOptions {
  minCostPrice: string
  maxCostPrice: string
  createdBefore: string
  createdAfter: string
  minSellingPrice: string
  maxSellingPrice: string
}

const FilterSheet: React.FC<FilterSheetProps> = ({
  open,
  onClose,
  onApply,
  filterOptions,
  setFilterOptions
}: FilterSheetProps) => {
  const authUser = useAuthUser()
  const userType = authUser()?.userType as string
  const handleApply = () => {
    onApply(filterOptions)
    onClose()
  }

  const handleReset = () => {
    setFilterOptions({
      minCostPrice: '',
      maxCostPrice: '',
      createdBefore: '',
      createdAfter: '',
      minSellingPrice: '',
      maxSellingPrice: ''
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
          {['مشرف', 'منسق طلبات'].includes(userType) && (
            <>
              <div>
                <Input
                  type="number"
                  value={filterOptions.minCostPrice}
                  onChange={(e) =>
                    setFilterOptions({ ...filterOptions, minCostPrice: e.target.value })
                  }
                  label={'السعر الأدنى للتكلفة'}
                />
              </div>
              <div>
                <Input
                  type="number"
                  value={filterOptions.maxCostPrice}
                  onChange={(e) =>
                    setFilterOptions({ ...filterOptions, maxCostPrice: e.target.value })
                  }
                  label={'السعر الأعلى للتكلفة'}
                />
              </div>
            </>
          )}
          {['مشرف', 'بائع'].includes(userType) && (
            <>
              <div>
                <Input
                  type="number"
                  value={filterOptions.minSellingPrice}
                  onChange={(e) =>
                    setFilterOptions({ ...filterOptions, minSellingPrice: e.target.value })
                  }
                  label={'السعر الأدنى للبيع'}
                />
              </div>
              <div>
                <Input
                  type="number"
                  value={filterOptions.maxSellingPrice}
                  onChange={(e) =>
                    setFilterOptions({ ...filterOptions, maxSellingPrice: e.target.value })
                  }
                  label={'السعر الأعلى للبيع'}
                />
              </div>
            </>
          )}
          <div>
            <Label>حسب التاريخ</Label>
            <div className="flex gap-4 mt-2">
              <div>
                <Input
                  type="date"
                  value={filterOptions.createdAfter}
                  onChange={(e) =>
                    setFilterOptions({ ...filterOptions, createdAfter: e.target.value })
                  }
                  label={'من'}
                  max={filterOptions.createdBefore}
                />
              </div>
              <div>
                <Input
                  type="date"
                  value={filterOptions.createdBefore}
                  onChange={(e) =>
                    setFilterOptions({ ...filterOptions, createdBefore: e.target.value })
                  }
                  label={'الى'}
                  min={filterOptions.createdAfter}
                />
              </div>
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
