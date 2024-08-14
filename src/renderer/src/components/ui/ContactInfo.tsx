import React from 'react'
import { Icons } from '../icons/icons'

export interface ContactInfoProps {
  phone: string
  date: string
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ phone, date }) => {
  const PhoneIcon = Icons.phone
  const CalendarIcon = Icons.calendarTick
  return (
    <div className="flex flex-col items-start self-start mt-5 w-full text-sm leading-none text-center max-w-[153px] text-zinc-900">
      <div className="flex gap-1.5 items-center self-stretch w-full"></div>
      <div className="flex gap-1.5 items-center mt-2 whitespace-nowrap">
        <PhoneIcon className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square" />
        <p className="self-stretch my-auto">{phone}</p>
      </div>
      <div className="flex gap-1.5 items-center mt-2">
        <CalendarIcon className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square" />
        <p className="self-stretch my-auto">{date}</p>
      </div>
    </div>
  )
}
