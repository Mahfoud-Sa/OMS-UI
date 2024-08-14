import React from 'react'

export interface AgentInfoProps {
  name: string
  role: string
  imageSrc: string
}

export const AgentInfo: React.FC<AgentInfoProps> = ({ name, role, imageSrc }) => {
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
