import React from 'react'
import { Icons } from '../icons/icons'
import { AgentInfo, AgentInfoProps } from './AgentInfo'
import { ContactInfo, ContactInfoProps } from './ContactInfo'

interface DeliveryAgentCardProps {
  agentInfo: AgentInfoProps
  contactInfo: ContactInfoProps
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
