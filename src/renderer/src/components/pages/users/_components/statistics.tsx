import { Users2 } from 'lucide-react'
import StatisticCard from '../../../layouts/statistic-card'
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useState } from "react";

type StatisticsProps = {
  filterData?: (role: string | undefined) => void
  totalUsers?: number
  managersCount?: number
  retailersCount?: number
}

export default function Statistics({ totalUsers }: StatisticsProps) {
  // const searchParams = useSearchParams();

  // const { data: statisticInfo } = useQuery<StatisticalUserCards>({
  //   queryKey: ['UsersStatisticInfo'],
  //   queryFn: () => getApi<StatisticalUserCards>('/Statices/Users')
  // })

  // const searchParams = useSearchParams()
  // const pathname = usePathname()
  // const router = useRouter()
  // const [selectedCard, setSelectedCard] = useState<{
  //   id: number | null
  //   title?: string
  // } | null>(null)
  // const filterData = (isActive?: number) => {
  //   const params = new URLSearchParams(searchParams)
  //   if (isActive && isActive != 0) {
  //     if (isActive == 1) {
  //       params.set('isActive', 'true')
  //     } else {
  //       params.set('isActive', 'false')
  //     }
  //     // params.set("isActive", (isActive + 1).toString());
  //   } else {
  //     params.delete('isActive')
  //   }
  //   params.set('page', '1')
  //   router.replace(`${pathname}?${params.toString()}`)
  // }

  const data = [
    {
      title: 'إجمالي المستخدمين',
      icon: Users2,
      value: totalUsers || 0,
      iconClassName: 'text-[#041016]',
      iconBgWrapperColor: 'bg-blue-100'
    }
    // {
    //   title: 'مدراء المصانع',
    //   icon: User2,
    //   value: managersCount || 0,
    //   iconClassName: 'text-green-900',
    //   iconBgWrapperColor: 'bg-green-100',
    //   role: 'manager'
    // },
    // {
    //   title: 'اصحاب المعارض',
    //   icon: User2,
    //   value: retailersCount || 0,
    //   iconClassName: 'text-red-900',
    //   iconBgWrapperColor: 'bg-red-100',
    //   role: 'retailer'
    // }
  ]

  return (
    <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
      {data.map((item, i) => (
        <StatisticCard
          key={i}
          // ${selectedCard?.id == i && 'border-2 border-primary'}
          className={`w-full`}
          title={item.title}
          total={item.value}
          icon={item.icon}
          iconWrapperClassName={`${item.iconBgWrapperColor}`}
          iconClassName={item.iconClassName}
          // handleClick={() => {
          //   if (filterData) {
          //     if (i == 0) filterData(undefined)
          //     filterData(item?.role)
          //   }
          //   // setSelectedCard({ id: i == 0 ? null : i, title: item.title })
          // }}
        />
      ))}
    </div>
  )
}
