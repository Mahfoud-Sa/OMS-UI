import Loader from '@renderer/components/layouts/loader'
import PrintOrderBillTemplate from '@renderer/components/pages/orders/_components/PrintOrderBillTemplate'
import { Button } from '@renderer/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@renderer/components/ui/dialog'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@renderer/components/ui/select'
import { toast } from '@renderer/components/ui/use-toast_1'
import { getApi } from '@renderer/lib/http'
import { Order } from '@renderer/types/api'
import moment from 'moment'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { useAuthUser } from 'react-auth-kit'
import { useReactToPrint } from 'react-to-print'

interface BatchPrintOrdersModalProps {
  open: boolean
  onClose: () => void
}

const BatchPrintOrdersModal: React.FC<BatchPrintOrdersModalProps> = ({ open, onClose }) => {
  const authUser = useAuthUser()
  const userType = authUser()?.userType as string
  const [filterOptions, setFilterOptions] = useState({
    orderState: 'all',
    createdAfter: '',
    createdBefore: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [orderIds, setOrderIds] = useState<number[]>([])
  const [isPrinting, setIsPrinting] = useState(false)
  const [currentPrintIndex, setCurrentPrintIndex] = useState(-1)
  const printContainerRef = useRef<HTMLDivElement | null>(null)
  const dataLoadedRef = useRef(false)
  const printingComplete = useRef(false)

  const orderStates = [
    { id: 'all', name: 'كل الحالات' },
    { id: '0', name: 'قيد الانتظار' },
    { id: '1', name: 'قيد التنفيذ' },
    { id: '2', name: 'مكتمل' },
    { id: '3', name: 'تم التسليم' },
    { id: '4', name: 'ملغى' }
  ]

  // Function to handle printing
  const handlePrint = useReactToPrint({
    contentRef: printContainerRef,
    onAfterPrint: () => {
      printingComplete.current = true
    }
  })

  // Signal that the order data is loaded
  const handleOrderLoaded = () => {
    dataLoadedRef.current = true
  }

  // Start the printing process
  const startPrintingOrders = () => {
    if (orderIds.length === 0) return

    setIsPrinting(true)
    setCurrentPrintIndex(0)
    dataLoadedRef.current = false
    printingComplete.current = false
  }

  // Effect to monitor loading and printing state
  useEffect(() => {
    if (!isPrinting) return

    if (currentPrintIndex < 0 || currentPrintIndex >= orderIds.length) return

    const checkDataLoaded = setInterval(() => {
      if (dataLoadedRef.current && !printingComplete.current) {
        handlePrint()
        clearInterval(checkDataLoaded)
      }
    }, 500)

    return () => clearInterval(checkDataLoaded)
  }, [currentPrintIndex, isPrinting])

  // Effect to move to next order after printing completes
  useEffect(() => {
    if (isPrinting && printingComplete.current) {
      const moveToNextOrder = setTimeout(() => {
        printingComplete.current = false
        dataLoadedRef.current = false

        if (currentPrintIndex < orderIds.length - 1) {
          setCurrentPrintIndex((prev) => prev + 1)
        } else {
          // All orders printed
          setCurrentPrintIndex(-1)
          setIsPrinting(false)
          toast({
            title: 'تم الطباعة',
            description: `تم طباعة ${orderIds.length} فاتورة بنجاح`,
            variant: 'success'
          })
        }
      }, 500)

      return () => clearTimeout(moveToNextOrder)
    }
  }, [isPrinting, printingComplete.current, currentPrintIndex, orderIds.length])

  // Fetch orders based on filters
  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const params: Record<string, any> = {}

      if (filterOptions.orderState && filterOptions.orderState !== 'all') {
        params.orderState = filterOptions.orderState
      }

      if (filterOptions.createdAfter) {
        params.createdAfter = moment(filterOptions.createdAfter).format('MM-DD-YYYY')
      }

      if (filterOptions.createdBefore) {
        params.createdBefore = moment(filterOptions.createdBefore).format('MM-DD-YYYY')
      }

      const response = await getApi<{
        total: number
        orders: Order[]
        pageNumber: number
        pageSize: number
        pages: number
      }>(
        `/Orders${userType === 'بائع' ? '/User' : userType === 'منسق طلبات' ? '/OrderManager' : ''}`,
        {
          params: {
            size: 100,
            ...params
          }
        }
      )

      const ids = response.data.orders.map((order) => order.id)
      setOrderIds(ids)

      if (ids.length === 0) {
        toast({
          title: 'لا توجد طلبات',
          description: 'لم يتم العثور على طلبات تطابق معايير البحث',
          variant: 'destructive'
        })
      } else {
        toast({
          title: 'تم العثور على الطلبات',
          description: `تم العثور على ${ids.length} طلب`,
          variant: 'default'
        })
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء جلب الطلبات',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyFilters = () => {
    fetchOrders()
  }

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      if (!isPrinting) {
        setOrderIds([])
        setCurrentPrintIndex(-1)
      }
    }
  }, [open, isPrinting])

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!isPrinting) {
          onClose()
        } else {
          toast({
            title: 'جاري الطباعة',
            description: 'الرجاء الانتظار حتى انتهاء عملية الطباعة',
            variant: 'destructive'
          })
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>طباعة فواتير متعددة</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Label>حالة الطلب</Label>
            <Select
              value={filterOptions.orderState}
              onValueChange={(value) => setFilterOptions({ ...filterOptions, orderState: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر حالة الطلب" />
              </SelectTrigger>
              <SelectContent>
                {orderStates.map((state) => (
                  <SelectItem key={state.id} value={state.id}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>حسب التاريخ</Label>
            <div className="flex gap-4 mt-2">
              <div className="w-full">
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
              <div className="w-full">
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

        {orderIds.length > 0 && (
          <div className="py-2">
            <p className="font-bold">تم العثور على {orderIds.length} طلب</p>
          </div>
        )}

        {isPrinting && currentPrintIndex >= 0 && (
          <div className="py-2 flex flex-col items-center">
            <Loader size={30} color="#DA972E" />
            <p className="mt-2">
              جاري طباعة الفاتورة {currentPrintIndex + 1} من {orderIds.length}
            </p>
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleApplyFilters}
            className="w-full"
            disabled={isLoading || isPrinting}
          >
            {isLoading ? <Loader size={20} color="#DA972E" /> : 'بحث'}
          </Button>
          <Button
            onClick={startPrintingOrders}
            className="w-full"
            disabled={orderIds.length === 0 || isPrinting}
          >
            {isPrinting ? <Loader size={20} color="#ffffff" /> : 'طباعة الفواتير'}
          </Button>
        </DialogFooter>
      </DialogContent>

      <div style={{ display: 'none' }}>
        <div ref={printContainerRef} className="print-container">
          {currentPrintIndex >= 0 && currentPrintIndex < orderIds.length && (
            <PrintOrderBillTemplate
              orderId={orderIds[currentPrintIndex]}
              onLoaded={handleOrderLoaded}
            />
          )}
        </div>
      </div>
    </Dialog>
  )
}

BatchPrintOrdersModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default BatchPrintOrdersModal
