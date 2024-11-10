import { Icons } from '@renderer/components/icons/icons'
import { LucideProps } from 'lucide-react'
import React from 'react'

interface InfoItemProps {
  text: string
  iconSrc?: string
}

const InfoItem: React.FC<InfoItemProps> = ({ text, iconSrc }) => {
  const Icon = iconSrc ? Icons[iconSrc] : undefined
  return (
    <div className="flex gap-2.5 items-start self-start whitespace-nowrap mt-2">
      {Icon && <Icon />}

      <div>{text}</div>
    </div>
  )
}

interface InfoItemData {
  text: string
  iconSrc?: string
}
interface CardInfoProps {
  id?: string
  infoItems: InfoItemData[]
  logoSrc: string
}

const CardInfo: React.FC<CardInfoProps> = ({ infoItems, logoSrc }) => {
  // const infoItems: InfoItemData[] = [
  //   {
  //     text: factoryName
  //   },
  //   {
  //     text: createdAt,
  //     iconSrc: 'calendarTick'
  //   },
  //   {
  //     text: location,
  //     iconSrc: 'mapPin'
  //   }
  // ]

  return (
    <section className="flex gap-2 items-start min-w-[240px] text-zinc-900">
      <img
        loading="lazy"
        src={logoSrc}
        className="object-cover shrink-0 rounded-lg aspect-square w-[100px]"
        alt="Card logo"
      />
      <div className="flex flex-col items-start min-w-[240px] w-[245px]">
        <div className="flex flex-col items-end mb-2 text-xl leading-tight">
          {infoItems.map((item, index) => (
            <InfoItem key={index} text={item.text} iconSrc={item.iconSrc} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface ActionButtonProps {
  actionType?: string
  id?: string
  url?: string
  // action method is used from the parent component
  actionMethod?: () => void
  buttonText?: string
  buttonIcon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
}

const ActionButton: React.FC<ActionButtonProps> = ({
  actionType,
  url,
  actionMethod,
  buttonText,
  buttonIcon = Icons.dashboard
}) => {
  const Icon = buttonIcon
  return (
    <>
      {actionType === 'method' && (
        <button
          className="flex gap-2.5 justify-center items-center px-5 py-3.5 text-base font-medium text-white bg-orange-400 rounded-xl"
          onClick={actionMethod}
        >
          <Icon />
          <span className="self-stretch my-auto">{buttonText || 'ضغط'}</span>
        </button>
      )}
      {actionType === 'link' && (
        <a
          href={url}
          className="flex gap-2.5 justify-center items-center px-5 py-3.5 text-base font-medium text-white bg-orange-400 rounded-xl"
        >
          <Icon />
          <span className="self-stretch my-auto">{buttonText || 'ضغط'}</span>
        </a>
      )}
    </>
  )
}

interface CardInformationProps {
  id?: string
  logoSrc: string
  infoItems: InfoItemData[]
  buttonAction?: () => void
  buttonText?: string
  url?: string
  actionType?: 'method' | 'link'
  displayButton?: boolean
  className?: string
  buttonIcon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
}

const InformationCard: React.FC<CardInformationProps> = ({
  id,
  buttonAction,
  buttonText,
  url,
  logoSrc,
  actionType,
  infoItems,
  displayButton = true,
  className,
  buttonIcon
}) => {
  return (
    <main className={`flex my-1 flex-wrap gap-10 items-end justify-between mb-4 ${className}`}>
      <CardInfo logoSrc={logoSrc} id={id} infoItems={infoItems} />
      {displayButton && (
        <ActionButton
          actionMethod={buttonAction}
          url={url}
          id={id}
          actionType={actionType}
          buttonText={buttonText}
          buttonIcon={buttonIcon}
        />
      )}
    </main>
  )
}

export default InformationCard
