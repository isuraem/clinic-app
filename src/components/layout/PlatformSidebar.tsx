import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import {
  BuildingStorefrontIcon, ClockIcon, CheckCircleIcon,
  ChartBarSquareIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon,
  ShieldCheckIcon, BellAlertIcon,
} from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

const nav = [
  { to: '/platform',           icon: ChartBarSquareIcon,      label: 'Overview'      },
  { to: '/platform/clinics',   icon: BuildingStorefrontIcon,  label: 'All Clinics'   },
  { to: '/platform/approvals', icon: ClockIcon,               label: 'Approvals'     },
  { to: '/platform/analytics', icon: ChartBarSquareIcon,      label: 'Analytics'     },
  { to: '/platform/settings',  icon: Cog6ToothIcon,           label: 'Platform Settings' },
]

export default function PlatformSidebar() {
  const dispatch    = useAppDispatch()
  const navigate    = useNavigate()
  const metrics     = useAppSelector((s) => s.platform.platformMetrics)
  const pendingCount = metrics?.pendingApprovals ?? 0

  return (
    <aside className="flex flex-col w-60 min-h-screen bg-slate-900 border-r border-slate-800">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
            <ShieldCheckIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-tight">Dermis</p>
            <p className="text-indigo-400 text-xs leading-tight font-medium">Platform Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/platform'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800',
              )
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {label === 'Approvals' && pendingCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {pendingCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-slate-800">
        <button
          onClick={() => { dispatch(logout()); navigate('/login') }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 rotate-180" />
          Logout
        </button>
      </div>
    </aside>
  )
}
