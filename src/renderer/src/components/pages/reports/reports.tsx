import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import BillingStatusReports from './taps/billing-status-reports/billing-status-reports'
import DailyReport from './taps/daily-report/daily-report'
import ItemProductionReport from './taps/item-production-report/item-production-report'
import ReceiptDatesReport from './taps/receipt-dates-report/receipt-dates-report'

const Reports = () => {
  const tabs = [
    {
      content: <DailyReport />,
      value: 'DailyReport',
      label: 'التقرير اليومي'
    },
    {
      content: <BillingStatusReports />,
      value: 'BillingStatusReports',
      label: 'تقارير حالات الفواتير'
    },
    {
      content: <ItemProductionReport />,
      value: 'ItemProductionReport',
      label: 'تقرير إنتاج صنف'
    },
    {
      content: <ReceiptDatesReport />,
      value: 'ReceiptDatesReport',
      label: 'تقرير تواريخ الإستلام'
    }
  ]
  return (
    <section className="p-5">
      {/* <Statistics
        selectedRole={undefined}
        filterData={function (): void {
          throw new Error('Function not implemented.')
        }}
      /> */}
      <div className="bg-white rounded-lg min-h-[500px] p-7 shadow-sm mt-6">
        <Tabs className="w-full" defaultValue={'DailyReport'}>
          <TabsList className="bg-transparent mb-3">
            {tabs.map((tab, index) => (
              <TabsTrigger key={index} value={tab.value}>
                <div className="flex justify-center items-center gap-x-4">
                  <span className="text-lg font-bold">{tab.label}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent value={tab.value} key={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

export default Reports
