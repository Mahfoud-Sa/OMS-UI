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

interface FilterSheetProps {
  open: boolean
  filterOptions: FilterOptions
  setFilterOptions: (options: FilterOptions) => void
  onClose: () => void
  onApply: (filterOptions: FilterOptions) => void
}

interface FilterOptions {
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
  const handleApply = () => {
    onApply(filterOptions)
    onClose()
  }

  const handleReset = () => {
    setFilterOptions({
      ...filterOptions
    })
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto" side={'left'}>
        <SheetHeader>
          <SheetTitle>تصفية النتائج</SheetTitle>
        </SheetHeader>
        <div>
          <div>
            <Label>حسب تاريخ التسليم المتوقع</Label>
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
        <SheetFooter className="my-3">
          <div className="flex gap-3 w-60">
            <Button onClick={handleReset} className="w-full" variant="outline">
              اعادة تعيين
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
