import { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  gradient?: boolean
}

const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }

export default function Card({ children, padding = 'md', hover, gradient, className, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl border border-gray-100 shadow-sm',
        paddings[padding],
        hover && 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
        gradient && 'bg-gradient-to-br from-white to-brand-50',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}
    </div>
  )
}
