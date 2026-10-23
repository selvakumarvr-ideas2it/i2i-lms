import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`
}

/** Admin-set, informational-only scheduled date for a learning day — e.g. "Sep 21, 2026". Empty string if unset. */
export function formatScheduledDate(scheduledDate: string | null | undefined) {
  if (!scheduledDate) return ''
  return format(parseISO(scheduledDate), 'MMM d, yyyy')
}

export function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

export function initialsFromName(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
