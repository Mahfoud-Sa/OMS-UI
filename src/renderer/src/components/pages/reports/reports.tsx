import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import { gotRole } from '@renderer/lib/utils'
import { cardsInterface } from '@renderer/types/api'
import { Box } from 'lucide-react'
import { useState } from 'react'
import Statistics from './_components/statistics'
import BillingStatusReports from './taps/billing-status-reports/billing-status-reports'
import DailyReport from './taps/daily-report/daily-report'
import ItemProductionReport from './taps/item-production-report/item-production-report'
import ReceiptDatesReport from './taps/receipt-dates-report/receipt-dates-report'

const Reports = () => {
  const [StatisticsCardsData, setStatisticsCardsData] = useState<cardsInterface[]>([
    {
      title: '',
      icon: Box,
      value: 0,
      iconClassName: 'text-[#041016]',
      iconBgWrapperColor: 'bg-blue-100'
    }
  ])
  const tabs = [
    {
      content: <DailyReport returnReportCards={setStatisticsCardsData} />,
      value: 'DailyReport',
      label: 'التقرير اليومي',
      disabled: !gotRole('Daily Reporter')
    },
    {
      content: <BillingStatusReports returnReportCards={setStatisticsCardsData} />,
      value: 'BillingStatusReports',
      label: 'تقارير حالات الفواتير',
      disabled: !gotRole('Orders States Reporter')
    },
    {
      content: <ItemProductionReport returnReportCards={setStatisticsCardsData} />,
      value: 'ItemProductionReport',
      label: 'تقرير إنتاج صنف',
      disabled: !gotRole('Orders Production Reporter')
    },
    {
      content: <ReceiptDatesReport returnReportCards={setStatisticsCardsData} />,
      value: 'ReceiptDatesReport',
      label: 'تقرير تواريخ الإستلام',
      disabled: !gotRole('Delivery Dates Reporter')
    }
  ]
  return (
    <section className="p-5">
      <Statistics
        selectedRole={undefined}
        data={StatisticsCardsData}
        filterData={function (): void {
          throw new Error('Function not implemented.')
        }}
      />
      <div className="bg-white rounded-lg min-h-[500px] p-7 shadow-sm mt-6">
        <Tabs className="w-full" defaultValue={tabs.find((tab) => !tab.disabled)?.value}>
          <TabsList className="bg-transparent mb-3">
            {tabs.map((tab, index) =>
              !tab.disabled ? (
                <TabsTrigger key={index} value={tab.value}>
                  <div className="flex justify-center items-center gap-x-4">
                    <span className="text-lg font-bold">{tab.label}</span>
                  </div>
                </TabsTrigger>
              ) : null
            )}
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
