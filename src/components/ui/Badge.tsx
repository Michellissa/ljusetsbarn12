import { cn } from '../../utils/cn'
import type { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger'
  children: ReactNode
}

export function Badge({ variant = 'default', children }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100  text-gray-700 ',
    success: 'bg-green-100  text-green-700 ',
    warning: 'bg-amber-100  text-amber-700 ',
    danger: 'bg-red-100  text-red-700 ',
  }

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant])}>
      {children}
    </span>
  )
}
