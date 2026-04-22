import clsx from 'clsx'
import { ReactNode } from 'react'

type BadgeVariant = 'gray' | 'green' | 'yellow' | 'red' | 'purple' | 'blue' | 'gold'

const variants: Record<BadgeVariant, string> = {
  gray:   'bg-gray-100   text-gray-600',
  green:  'bg-green-100  text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red:    'bg-red-100    text-red-700',
  purple: 'bg-brand-100  text-brand-700',
  blue:   'bg-blue-100   text-blue-700',
  gold:   'bg-amber-100  text-amber-700',
}

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  dot?: boolean
  className?: string
}

export default function Badge({ children, variant = 'gray', dot, className }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full', variants[variant], className)}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', { 'bg-green-500': variant === 'green', 'bg-yellow-500': variant === 'yellow', 'bg-red-500': variant === 'red', 'bg-brand-500': variant === 'purple', 'bg-gray-400': variant === 'gray' })} />}
      {children}
    </span>
  )
}
