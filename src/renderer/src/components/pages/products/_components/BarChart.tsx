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
import React, { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

interface BarCharterProps {
  productName: string
  id: string
  year: number
  onChangeYear: (year: number) => void
}

interface BarChartData {
  month: string
  sales: number
  color?: string
}

const BarCharter: React.FC<BarCharterProps> = ({ productName, id, onChangeYear, year }) => {
  const [displayData, setDisplayData] = useState<BarChartData[]>([])

  const { data, isLoading, error } = useQuery({
    queryKey: ['productBarChartData', id, year],
    queryFn: () =>
      getApi<{ month: string; sales: number }[]>(`Products/Chars/BarChar/${id}?year=${year}`)
  })

  useEffect(() => {
    if (data) {
      const updatedChartData = data.data.map((item) => ({
        ...item,
        [productName]: item.sales, // Replace 'value' with 'productName'
        color: '#DA972E' // Add random color
      }))
      setDisplayData(updatedChartData)
    } else if (error) {
      const fallbackData = [
        { month: 'January', sales: 0, color: '#DA972E' },
        { month: 'February', sales: 0, color: '#DA972E' },
        { month: 'March', sales: 0, color: '#DA972E' },
        { month: 'April', sales: 0, color: '#DA972E' },
        { month: 'May', sales: 0, color: '#DA972E' },
        { month: 'June', sales: 214, color: '#DA972E' }
      ]
      setDisplayData(fallbackData)
    }
  }, [data, error, productName])

  const chartConfig = {
    productName: {
      label: productName,
      color: '#DA972E'
    }
  } satisfies ChartConfig

  if (isLoading) return <Skeleton className="h-[190px]"></Skeleton>

  return (
    <Card>
      <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between">
        <h5 className="text-sm font-semibold">مبيعات الصنف</h5>
        <select
          onChange={(e) => {
            const year = parseInt(e.target.value, 10)
            onChangeYear(year)
            // getBarChartData(year)
          }}
          disabled={data === undefined}
          value={year}
        >
          {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => (
            <option key={i} value={2000 + i}>
              {2000 + i}
            </option>
          ))}
        </select>
      </CardHeader>
      <CardContent className="p-3">
        <ChartContainer config={chartConfig} className="max-h-[190px] w-full" dir="ltr">
          <BarChart accessibilityLayer data={displayData}>
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey={productName} fill={'#DA972E'} barSize={27} radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default BarCharter
