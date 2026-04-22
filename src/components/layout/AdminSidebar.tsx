import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import {
  HomeIcon, SparklesIcon, CreditCardIcon,
  UsersIcon, ChartBarIcon, ArrowLeftOnRectangleIcon, WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'

const nav = [
  { to: '/admin',             icon: HomeIcon,                label: 'Dashboard'   },
  { to: '/admin/appbuilder',  icon: WrenchScrewdriverIcon,   label: 'App Builder' },
  { to: '/admin/billing',     icon: CreditCardIcon,          label: 'Billing'     },
  { to: '/admin/staff',       icon: UsersIcon,               label: 'Staff'       },
  { to: '/admin/analytics',   icon: ChartBarIcon,            label: 'Analytics'   },
]

export default function AdminSidebar() {
  const dispatch = useAppDispatch()
  const clinic   = useAppSelector((s) => s.auth.clinic)

  return (
    <aside className="flex flex-col w-60 min-h-screen bg-gray-900 border-r border-gray-800">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <SparklesIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-tight">Dermis</p>
            <p className="text-gray-400 text-xs leading-tight truncate max-w-[120px]">{clinic?.name ?? 'Clinic'}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800',
              )
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-800">
        <button
          onClick={() => dispatch(logout())}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 rotate-180" />
          Logout
        </button>
      </div>
    </aside>
  )
}
