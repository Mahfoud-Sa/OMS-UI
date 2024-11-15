import { cn } from '@renderer/lib/utils'
import { useEffect, useState } from 'react'
import useNavItems from '../../hooks/useNavItems'
import useScreenSize from '../../hooks/useScreenSize'
import SidebarToggleIcon from '../icons/sidebar-toggler-icon'
import { Separator } from '../ui/separator'
import DashboardNav from './dashboard-nav'

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true)
  const navItems = useNavItems()
  const screenSize = useScreenSize()
  const width = screenSize.width

  useEffect(() => {
    if (width <= 940) {
      setExpanded(false)
    } else {
      setExpanded(true)
    }
  }, [width])

  return (
    <aside
      className={cn(
        'z-50  sticky right-0 top-0 flex h-[100vh] shrink-0 flex-col rounded-none  border bg-background  shadow-xl   transition-all ease-in-out',
        expanded ? 'w-[270px]' : 'w-24'
      )}
    >
      <SidebarToggleIcon expanded={expanded} setExpanded={setExpanded} />

      <div className={cn('flex w-full flex-col items-center justify-center p-4 gap-2', {})}>
        {expanded ? (
          <img
            src="https://lh3.googleusercontent.com/d/1B6Gb0VLYkqJM1OW6w4QKjfOoSEhtRKTR=s220?authuser=0"
            alt="logo"
            className="w-[9.688rem] h-[9.688rem]"
          />
        ) : (
          <img
            src="https://lh3.googleusercontent.com/d/1B6Gb0VLYkqJM1OW6w4QKjfOoSEhtRKTR=s220?authuser=0"
            alt="logo"
            className="w-[62px] h-[62px]"
          />
        )}

        <Separator className="mt-6 " />
      </div>

      <div className="flex-grow overflow-y-auto py-4 hide-scrollbar">
        <DashboardNav items={navItems} expanded={expanded} />
      </div>
    </aside>
  )
}
