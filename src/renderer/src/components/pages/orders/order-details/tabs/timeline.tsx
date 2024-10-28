import { Button } from '@renderer/components/ui/button'
import { LucideHand, Printer, X } from 'lucide-react'

const Timeline = () => {
  return (
    <section>
      <div className="flex gap-2 justify-end">
        <Button className="flex bg-red-600 hover:bg-red-700  gap-2 ">
          الغاء الطلبية
          <X />
        </Button>
        <Button className="flex  gap-2 bg-green-600 hover:bg-green-700 ">
          إنتهاء التصنيع
          <LucideHand />
        </Button>
        <Button className="flex gap-2">
          طباعة
          <Printer />
        </Button>
      </div>
    </section>
  )
}

export default Timeline
