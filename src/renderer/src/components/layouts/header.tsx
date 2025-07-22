'use client'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/ui/tooltip'
import useCurrentNav from '@renderer/hooks/useCurrentNav'
import { BadgeAlert, BadgeCheck, BadgeInfo, MenuIcon, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CircularProgress } from '../ui/circular-progress'
import { UserNav } from './user-nav'

export default function Header() {
  const currentPath = useCurrentNav()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [updateStatus, setUpdateStatus] = useState<
    | 'default'
    | 'update-available'
    | 'update-downloading'
    | 'update-downloaded'
    | 'update-not-available'
  >('default')
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [appVersion, setAppVersion] = useState('')

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  useEffect(() => {
    window.electron.ipcRenderer.on('update-available', () => {
      setUpdateStatus('update-available')
    })

    window.electron.ipcRenderer.on('update-downloaded', () => {
      setUpdateStatus('update-downloaded')
    })

    window.electron.ipcRenderer.on('download-progress', (_event, percent: number) => {
      setUpdateStatus('update-downloading')
      setDownloadProgress(percent)
    })

    window.electron.ipcRenderer.on('update-not-available', () => {
      setUpdateStatus('update-not-available')
    })
    const appVersionValue = window.electron.ipcRenderer.sendSync('get-app-version')
    if (appVersionValue) {
      setAppVersion(appVersionValue)
    }

    return () => {
      window.electron.ipcRenderer.removeAllListeners('update-available')
      window.electron.ipcRenderer.removeAllListeners('update-downloaded')
      window.electron.ipcRenderer.removeAllListeners('download-progress')
      window.electron.ipcRenderer.removeAllListeners('update-not-available')
    }
  }, [])

  const renderUpdateIcon = () => {
    let icon
    let tooltipContent

    switch (updateStatus) {
      case 'update-available':
        icon = <BadgeAlert className="text-yellow-400" />
        tooltipContent = 'هناك تحديث متاح'
        break
      case 'update-downloaded':
        icon = <BadgeCheck className="text-green-500" />
        tooltipContent = 'تم تحميل التحديث'
        break
      case 'update-not-available':
        icon = <BadgeAlert className="text-green-500" />
        tooltipContent = `لا يوجد تحديث متاح. ${appVersion} هو آخر إصدار`
        break
      case 'update-downloading':
        icon = <CircularProgress strokeWidth={5} size={24} value={downloadProgress} />
        tooltipContent = `تم تحميل: ${downloadProgress.toFixed(1)}%`
        break
      default:
        icon = <BadgeInfo className="text-gray-400" />
        tooltipContent = `الإصدار: ${appVersion}`
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>{icon}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <div className="top-6 z-20 shadow-lg border bg-background">
        <nav className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center sm:hidden">
            <button className="text-xl focus:outline-none" onClick={toggleSidebar}>
              {sidebarOpen ? <X /> : <MenuIcon />}
            </button>
            <h1 className="mr-3 text-lg font-bold md:text-xl">{currentPath?.label}</h1>
          </div>

          <div className="hidden items-center sm:flex gap-1">
            <h1 className="text-xl font-bold">{currentPath?.label}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center">{renderUpdateIcon()}</div>
            <UserNav />
          </div>
        </nav>
        <div className="mb-2 px-4"></div>
      </div>
    </TooltipProvider>
  )
}
