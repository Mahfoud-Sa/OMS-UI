import { Box, Store } from 'lucide-react'
import StatisticCard from '../../../layouts/statistic-card'
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useState } from "react";

export default function Statistics({
  factoriesTotal,
  productionLinesTotal
}: {
  factoriesTotal: number
  productionLinesTotal: number
}) {
  const data = [
    {
      title: 'أجمالي عدد المصانع',
      icon: Store,
      value: factoriesTotal || 0,
      iconClassName: 'text-[#041016]',
      iconBgWrapperColor: 'bg-blue-100'
    },
    {
      title: 'اجمالي خطوط الانتاج',
      icon: Box,
      value: productionLinesTotal || 0,
      iconClassName: 'text-red-900',
      iconBgWrapperColor: 'bg-red-100'
    }
  ]

  return (
    <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-٢">
      {data.map((item, i) => (
        <StatisticCard
          key={i}
          // ${selectedCard?.id == i && 'border-2 border-primary'}
          className={`w-full `}
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
