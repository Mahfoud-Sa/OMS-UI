import React from 'react'
import { Icons } from '../icons/icons'

interface DeliveryAgentCardProps {
  agentInfo: AgentInfoProps
  contactInfo: ContactInfoProps
}
interface ContactInfoProps {
  phone: string
  date: string
}
interface AgentInfoProps {
  name: string
  role: string
  imageSrc: string
}

const AgentInfo: React.FC<AgentInfoProps> = ({ name, role, imageSrc }) => {
  return (
    <div className="flex gap-2 items-center w-full text-right">
      <img
        loading="lazy"
        src={imageSrc}
        className="object-contain shrink-0 self-stretch my-auto rounded-lg aspect-square w-[50px]"
        alt={`${name} - ${role}`}
      />
      <div className="flex flex-col self-stretch my-auto w-[107px]">
        <h2 className="text-base font-medium text-zinc-900">{name}</h2>
        <p className="text-sm leading-none text-orange-400">{role}</p>
      </div>
    </div>
  )
}

const ContactInfo: React.FC<ContactInfoProps> = ({ phone, date }) => {
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

export const DeliveryAgentCard: React.FC<DeliveryAgentCardProps> = ({ agentInfo, contactInfo }) => {
  const MoreVerticalIcon = Icons.ellipsis
  return (
    <section className="flex gap-4 items-center">
      <div className="flex flex-col justify-center self-stretch my-auto rounded-xl border border-solid border-slate-400 min-h-[165px] w-[250px] p-2">
        <div className="flex justify-center items-start w-full">
          <div className="flex flex-col w-auto">
            <AgentInfo {...agentInfo} />
            <ContactInfo {...contactInfo} />
          </div>
          <MoreVerticalIcon className="object-contain shrink-0 w-6 aspect-square" />
        </div>
      </div>
    </section>
  )
}
