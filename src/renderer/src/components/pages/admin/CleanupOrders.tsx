import { Button } from '@renderer/components/ui/button'
import { cleanEmptyOrders } from '@renderer/utils/cleanEmptyOrders'
import { useState } from 'react'

const CleanupOrders = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [log, setLog] = useState<string[]>([])

  // Override console.log to capture output
  const originalConsoleLog = console.log
  const originalConsoleError = console.error

  const setupLogging = () => {
    console.log = (...args) => {
      const message = args
        .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
        .join(' ')
      setLog((prev) => [...prev, message])
      originalConsoleLog(...args)
    }

    console.error = (...args) => {
      const message = `ERROR: ${args
        .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
        .join(' ')}`
      setLog((prev) => [...prev, message])
      originalConsoleError(...args)
    }
  }

  const resetLogging = () => {
    console.log = originalConsoleLog
    console.error = originalConsoleError
  }

  const handleRunCleanup = async () => {
    setLog([])
    setIsRunning(true)
    setupLogging()

    try {
      await cleanEmptyOrders()
    } catch (error) {
      console.error('Failed to complete cleanup:', error)
    } finally {
      resetLogging()
      setIsRunning(false)
    }
  }

  return (
    <div className="p-5">
      <div className="bg-white rounded-lg p-7 shadow-sm">
        <h1 className="text-2xl font-bold mb-4">تنظيف الطلبات الفارغة</h1>
        <p className="mb-4">
          هذه الأداة تقوم بالبحث عن الطلبات التي لا تحتوي على منتجات وحذفها من النظام.
        </p>
        <p className="mb-4 text-amber-600 font-bold">
          ملاحظة: قبل الحذف الفعلي، سيتم تشغيل الأداة في وضع المحاكاة لعرض الطلبات التي سيتم حذفها.
        </p>

        <Button onClick={handleRunCleanup} disabled={isRunning} className="mb-4">
          {isRunning ? 'جاري التنفيذ...' : 'تشغيل أداة التنظيف'}
        </Button>

        {log.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">سجل العمليات:</h2>
            <div className="bg-gray-100 p-4 rounded-md h-[500px] overflow-y-auto text-sm font-mono">
              {log.map((entry, index) => (
                <div key={index} className={entry.startsWith('ERROR') ? 'text-red-500' : ''}>
                  {entry}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CleanupOrders
