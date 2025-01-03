import { Card, CardContent, CardHeader } from '@renderer/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@renderer/components/ui/chart'
import { Skeleton } from '@renderer/components/ui/skeleton'
import { MixedBarCharterProps } from '@renderer/types/api'
import { useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const generateChartConfig = (dataKeys: string[]) => {
  const config: ChartConfig = {}
  dataKeys.forEach((key) => {
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

const MixedBarChartHoriz = ({
  id,
  year,
  label,
  queryFunction
}: {
  id: string
  year: number
  label: string
  queryFunction: (
    id: string,
    year: number,
    month: number
  ) => Promise<AxiosResponse<MixedBarCharterProps[], any>>
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [chartData, setChartData] = useState<any[]>([])

  const { data, isLoading } = useQuery({
    queryKey: ['nameBarChartData', id, selectedMonth, year],
    queryFn: async () => await queryFunction(id, year, selectedMonth)
    // getApi<MixedBarCharterProps[]>(
    //   `Products/${id}/Chars/HorizantalBar?year=${year}&month=${selectedMonth}`
    // )
  })

  useEffect(() => {
    if (data?.data) {
      const updatedChartData = data.data
        .map((item) => ({
          ...item,
          label: item.name,
          fill: getRandomColor()
        }))
        .sort((a, b) => b.sales - a.sales) // Sort by sales in descending order
        .slice(0, 3) // Take the top 3 items

      setChartData(updatedChartData)
    }
  }, [data])

  // check if year change
  useEffect(() => {
    console.log(year)
  }, [year])

  const chartConfig = generateChartConfig(chartData.map((data) => data.name))

  if (isLoading) return <Skeleton className="min-h-[220px]"></Skeleton>

  return (
    <Card>
      <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between">
        <h5 className="text-sm font-semibold">{label}</h5>
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
      <CardContent className="mt-2 pr-0">
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
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label || value.toString()
              }
              orientation="right"
            />
            <XAxis dataKey="sales" type="number" />
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
