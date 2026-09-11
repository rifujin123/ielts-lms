import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * cn — merge Tailwind classes safely.
 * Combines clsx (conditional classes) with tailwind-merge (conflict resolution).
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-primary text-on-primary', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * formatDate — format a date string to Vietnamese locale.
 *
 * @example
 * formatDate('2026-09-07') → '07/09/2026'
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * getInitials — extract initials from a full name.
 *
 * @example
 * getInitials('Trần Thảo') → 'TT'
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * calcProgressPercent — calculate percentage as an integer.
 *
 * @example
 * calcProgressPercent(3, 10) → 30
 */
export function calcProgressPercent(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

/**
 * truncate — truncate a string to maxLength with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength)}...`
}
