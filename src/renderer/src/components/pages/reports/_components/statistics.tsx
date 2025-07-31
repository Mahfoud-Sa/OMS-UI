import { LucideProps } from 'lucide-react'
import { ForwardRefExoticComponent, RefAttributes } from 'react'
import StatisticCard from '../../../layouts/statistic-card'
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useState } from "react";

type StatisticsProps = {
  selectedRole: string | undefined
  data: {
    title: string
    icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
    value: number | string
    iconClassName: string
    iconBgWrapperColor: string
  }[]
}

export default function Statistics({ data }: StatisticsProps) {
  return (
    <div
      className={`grid gap-2 sm:grid-cols-1 md:grid-cols-${data.length >= 3 ? '3' : data.length == 2 ? '2' : '1'}`}
    >
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
        />
      ))}
    </div>
  )
}
