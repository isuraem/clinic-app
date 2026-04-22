import { useState } from 'react'
import { QrCodeIcon, EyeIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { toggleScanner, clearScan, processQRScan } from '@/features/admin/dashboard/dashboardSlice'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

// Tab content
import TreatmentsPage  from '@/features/admin/treatments/components/TreatmentsPage'
import OffersPage      from '@/features/admin/offers/components/OffersPage'
import MembershipsPage from '@/features/admin/memberships/components/MembershipsPage'
import SettingsPage    from '@/features/admin/settings/SettingsPage'
import CustomPlansTab  from './tabs/CustomPlansTab'
import RewardsTab      from './tabs/RewardsTab'
import Badge from '@/components/ui/Badge'

const TABS = [
  { key: 'custom-plans', label: 'Custom plans' },
  { key: 'offers',       label: 'Offers'        },
  { key: 'products',     label: 'Products'      },
  { key: 'membership',   label: 'Membership'    },
  { key: 'rewards',      label: 'Rewards'       },
  { key: 'settings',     label: 'Settings'      },
] as const

type TabKey = typeof TABS[number]['key']

export default function AppBuilderPage() {
  const dispatch = useAppDispatch()
  const [activeTab, setActiveTab] = useState<TabKey>('products')
  const [scanInput, setScanInput] = useState('')
  const user        = useAppSelector((s) => s.auth.user)
  const { scannerActive, lastScannedPatient } = useAppSelector((s) => s.dashboard)

  const handleSimulateScan = () => {
    dispatch(processQRScan(scanInput || 'DERMIS-PAT-DEMO-001'))
    setScanInput('')
  }

  return (
    <div className="-mx-6 -mt-8 flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="px-6 pt-6 pb-0 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">App Builder</h1>

          <div className="flex items-center gap-3">
            {/* User */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <UserCircleIcon className="w-5 h-5 text-gray-400" />
              <span className="font-medium">{user?.name ?? 'Admin'}</span>
            </div>

            {/* Scan QR */}
            <button
              onClick={() => dispatch(toggleScanner())}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors shadow-sm"
            >
              <QrCodeIcon className="w-4 h-4" />
              Scan QR
            </button>

            {/* View app */}
            <button className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 text-sm font-semibold transition-colors">
              <EyeIcon className="w-4 h-4" />
              View app
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-end gap-0">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={clsx(
                'px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap',
                activeTab === key
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 px-6 py-6 bg-gray-50">
        {activeTab === 'custom-plans' && <CustomPlansTab />}
        {activeTab === 'offers'       && <OffersPage />}
        {activeTab === 'products'     && <TreatmentsPage />}
        {activeTab === 'membership'   && <MembershipsPage />}
        {activeTab === 'rewards'      && <RewardsTab />}
        {activeTab === 'settings'     && <SettingsPage />}
      </div>

      {/* QR Scanner modal */}
      <Modal open={scannerActive} onClose={() => dispatch(toggleScanner())} title="Patient QR Check-in" size="sm">
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl h-44 flex items-center justify-center">
            <div className="text-center">
              <QrCodeIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Camera preview</p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Or enter code manually:</p>
            <div className="flex gap-2">
              <input
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder="DERMIS-PAT-..."
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <Button onClick={handleSimulateScan}>Check In</Button>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center">Each check-in awards +60 loyalty points</p>
        </div>
      </Modal>

      {/* Scan success */}
      {lastScannedPatient && (
        <Modal open={!!lastScannedPatient} onClose={() => dispatch(clearScan())} size="sm">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto text-2xl">✅</div>
            <h3 className="font-bold text-gray-900">Check-in Successful!</h3>
            <p className="text-gray-600 text-sm"><strong>{lastScannedPatient.name}</strong> checked in.</p>
            <Badge variant="gold">+{lastScannedPatient.points} points awarded</Badge>
            <Button variant="secondary" fullWidth onClick={() => dispatch(clearScan())}>Done</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
