import clsx from 'clsx'
import { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  delta?: string
  deltaPositive?: boolean
  icon?: ReactNode
  iconBg?: string
  loading?: boolean
}

export default function StatCard({ label, value, delta, deltaPositive, icon, iconBg = 'bg-brand-100', loading }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-100 rounded-lg animate-pulse mt-2" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          )}
          {delta && (
            <p className={clsx('text-xs font-medium mt-1', deltaPositive ? 'text-green-600' : 'text-red-500')}>
              {deltaPositive ? '↑' : '↓'} {delta}
            </p>
          )}
        </div>
        {icon && (
          <div className={clsx('flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center', iconBg)}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
