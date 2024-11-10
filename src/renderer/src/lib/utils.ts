import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const hasAccess = (role: string, roles: string[]) => {
  return roles.includes(role)
}

export function formatTimeDifference(date1: Date, date2: Date): string {
  // Get the time difference in milliseconds
  const differenceInMilliseconds = Math.abs(date2.getTime() - date1.getTime())

  // Convert to hours, minutes, and seconds
  const hours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60))
  const minutes = Math.floor((differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((differenceInMilliseconds % (1000 * 60)) / 1000)

  // Format as HH:MM:SS
  const formattedHours = String(hours).padStart(2, '0')
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(seconds).padStart(2, '0')

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}
