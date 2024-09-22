'use client'

import { Card, CardContent, CardHeader } from '@renderer/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@renderer/components/ui/chart'
import { Skeleton } from '@renderer/components/ui/skeleton'
import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

interface ApiResponse {
  monthe: string
  sales: {
    name: string
    sales: number
  }[]
}

interface TransformedData {
  month: string
  [key: string]: number | string
}

const transformData = (data: ApiResponse[]): TransformedData[] => {
  return data.map((item) => {
    const salesData = item.sales.reduce(
      (acc, sale) => {
        acc[sale.name] = sale.sales
        return acc
      },
      {} as { [key: string]: number }
    )

    return {
      month: item.monthe,
      ...salesData
    }
  })
}

const LineCharter = ({
  id,
  year,
  onChangeYear,
  onManyValues
}: {
  id: string
  year: number
  onChangeYear: (year: number) => void
  onManyValues: (hasManyValues: boolean) => void
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ['browserLineChartData', id, year],
    queryFn: () => getApi<ApiResponse[]>(`Products/${id}/Chars/Line?year=${year}`)
  })

  const chartData = useMemo(() => {
    if (data) {
      return transformData(data.data)
    }

    return []
  }, [data])

  const chartConfig = useMemo(() => {
    if (chartData.length > 0) {
      const keys = Object.keys(chartData[0]).filter((key) => key !== 'month')
      return keys.reduce((acc, key, index) => {
        acc[key] = {
          label: key,
          color: `hsl(${index * 30}, 70%, 50%)` // Generate a color based on the index
        }
        return acc
      }, {} as ChartConfig)
    }
    return {}
  }, [chartData])

  useEffect(() => {
    if (chartData && chartData.length > 0) {
      const numberOfFields = Object.keys(chartData[0]).filter((key) => key !== 'month').length
      const hasManyValues = numberOfFields > 10
      console.log(chartData)
      console.log(numberOfFields)
      onManyValues(hasManyValues)
    }
  }, [chartData, onManyValues])

  if (isLoading) return <Skeleton className="h-min-[220px]"></Skeleton>

  return (
    <Card className="min-h-[260px]">
      <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between  ">
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
      <CardContent className="mt-2 pr-0">
        <ChartContainer dir="ltr" lang="ar" config={chartConfig} className="w-full pr-0">
          <LineChart
            accessibilityLayer
            data={chartData}
            // margin={{
            //   left: 12,
            //   right: 12
            // }}
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
            {Object.keys(chartConfig).map((key) => (
              <Line
                key={key}
                dataKey={key}
                type="monotone"
                stroke={chartConfig[key].color}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default LineCharter
