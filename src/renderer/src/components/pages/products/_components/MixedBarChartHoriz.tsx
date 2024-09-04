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
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const generateChartConfig = (dataKeys: string[]) => {
  const config: ChartConfig = {}
  dataKeys.forEach((key, index) => {
    config[key] = {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: getRandomColor()
    }
  })
  return config
}

const months = {
  1: 'يناير',
  2: 'فبراير',
  3: 'مارس',
  4: 'أبريل',
  5: 'مايو',
  6: 'يونيو',
  7: 'يوليو',
  8: 'أغسطس',
  9: 'سبتمبر',
  10: 'أكتوبر',
  11: 'نوفمبر',
  12: 'ديسمبر'
}

const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const MixedBarChartHoriz = ({ id, year }: { id: string; year: number }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [chartData, setChartData] = useState<any[]>([])

  const { data, isLoading } = useQuery({
    queryKey: ['nameBarChartData', id, selectedMonth, year],
    queryFn: () =>
      getApi<{ name: string; sales: number }[]>(
        `Products/GetHorizantalBarChar/?id=${id}&month=${selectedMonth}&year=${year}`
      )
  })

  useEffect(() => {
    if (data) {
      let updatedChartData = data.data.map((item) => ({
        ...item,
        label: item.name,
        fill: getRandomColor()
      }))

      // Duplicate the data until the length is 20
      while (updatedChartData.length < 20) {
        updatedChartData = updatedChartData.concat(updatedChartData)
      }

      // Slice to ensure exactly 20 items
      updatedChartData = updatedChartData.slice(0, 20)

      setChartData(updatedChartData)
    }
  }, [data])

  // check if year change
  useEffect(() => {
    console.log(year)
  }, [year])

  const chartConfig = generateChartConfig(chartData.map((data) => data.name))

  if (isLoading) return <Skeleton className="h-[220px]"></Skeleton>

  return (
    <Card>
      <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between">
        <h5 className="text-sm font-semibold">مبيعات التصاميم</h5>
        <select
          onChange={(e) => {
            const month = parseInt(e.target.value, 10)
            setSelectedMonth(month)
          }}
          value={selectedMonth}
        >
          {Object.entries(months).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </CardHeader>
      <CardContent className="mt-2">
        <ChartContainer config={chartConfig} className="w-full min-h-[190px] min-w-[290px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0
            }}
          >
            <CartesianGrid vertical={true} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={30}
              axisLine={false}
              tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
              orientation="right"
            />
            <XAxis dataKey="sales" type="number" orient="right" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="name" hideLabel />}
            />
            <Bar dataKey="sales" barSize={13} layout="vertical" radius={5}></Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default MixedBarChartHoriz
