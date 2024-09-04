'use client'

import { Card, CardContent, CardHeader } from '@renderer/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@renderer/components/ui/chart'
import { Skeleton } from '@renderer/components/ui/skeleton'
import { getApi } from '@renderer/lib/http'; // Adjust the import path as needed
import { useQuery } from '@tanstack/react-query'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))'
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig

const LineCharter = ({
  id,
  year,
  onChangeYear
}: {
  id: string
  year: number
  onChangeYear: (year: number) => void
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ['browserLineChartData', id, year],
    queryFn: () =>
      getApi<{ month: string; desktop: number; mobile: number }[]>(
        `Products/GetLineChar?id=${id}&year=${year}`
      )
  })

  if (isLoading) return <Skeleton className="h-min-[220px]"></Skeleton>

  let chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
    { month: 'July', desktop: 214, mobile: 140 },
    { month: 'August', desktop: 214, mobile: 140 },
    { month: 'September', desktop: 214, mobile: 140 },
    { month: 'October', desktop: 214, mobile: 140 },
    { month: 'November', desktop: 214, mobile: 140 },
    { month: 'December', desktop: 214, mobile: 140 }
  ]

  if (data) {
    chartData = data?.data || chartData
  }

  return (
    <Card>
      <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between">
        <h5 className="text-sm font-semibold">مبيعات التصاميم</h5>
        <select
          onChange={(e) => {
            const year = parseInt(e.target.value, 10)
            console.log(year)
            onChangeYear(year)
          }}
          value={year}
        >
          {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => (
            <option key={i} value={2000 + i}>
              {2000 + i}
            </option>
          ))}
        </select>
      </CardHeader>
      <CardContent className="mt-2">
        <ChartContainer
          dir="ltr"
          lang="ar"
          config={chartConfig}
          className="w-full min-h-[220px] min-w-[290px]"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis orientation="right" />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default LineCharter
