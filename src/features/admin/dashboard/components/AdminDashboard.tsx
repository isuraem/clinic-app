import { useEffect, useState } from 'react'
import {
  CurrencyPoundIcon, UserGroupIcon, QrCodeIcon,
  StarIcon, ArrowTrendingUpIcon, LinkIcon,
} from '@heroicons/react/24/outline'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Filler,
} from 'chart.js'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchDashboard, toggleScanner, clearScan, processQRScan } from '../dashboardSlice'
import { setMembers } from '../../staff/staffSlice'
import StatCard from '@/components/ui/StatCard'
import Card, { CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import StaffLeaderboard from './StaffLeaderboard'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

export default function AdminDashboard() {
  const dispatch = useAppDispatch()
  const { metrics, todayMetrics, staff, googleRating, totalReviews, activeVisitors, loading, scannerActive, lastScannedPatient } = useAppSelector((s) => s.dashboard)
  const clinic = useAppSelector((s) => s.auth.clinic)
  const [scanInput, setScanInput] = useState('')

  useEffect(() => {
    dispatch(fetchDashboard())
  }, [dispatch])

  useEffect(() => {
    if (staff.length) dispatch(setMembers(staff))
  }, [staff, dispatch])

  const revenueData = {
    labels: metrics.slice(-14).map((m) => m.date.slice(5)),
    datasets: [{
      label: 'Revenue (£)',
      data: metrics.slice(-14).map((m) => m.revenue),
      fill: true,
      borderColor: '#c026d3',
      backgroundColor: 'rgba(192,38,211,0.08)',
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: '#c026d3',
    }],
  }

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { mode: 'index' as const, intersect: false } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: '#f3f4f6' } } },
  }

  const handleSimulateScan = () => {
    dispatch(processQRScan(scanInput || 'DERMIS-PAT-DEMO-001'))
    setScanInput('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {clinic?.name} · Real-time pulse
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {activeVisitors} active visitors
          </div>
          <Button variant="outline" size="sm" onClick={() => dispatch(toggleScanner())}>
            <QrCodeIcon className="w-4 h-4" />
            Scan Patient
          </Button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Revenue" loading={loading}
          value={`£${(todayMetrics?.revenue ?? 0).toLocaleString()}`}
          delta="12% vs yesterday" deltaPositive
          icon={<CurrencyPoundIcon className="w-5 h-5 text-brand-600" />}
          iconBg="bg-brand-50"
        />
        <StatCard
          label="New Patients" loading={loading}
          value={todayMetrics?.newPatients ?? 0}
          delta="3 vs yesterday" deltaPositive
          icon={<UserGroupIcon className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          label="Check-ins" loading={loading}
          value={todayMetrics?.checkIns ?? 0}
          delta="+4 pts earned per scan"
          icon={<QrCodeIcon className="w-5 h-5 text-green-600" />}
          iconBg="bg-green-50"
        />
        <StatCard
          label="Google Rating" loading={loading}
          value={`${googleRating} ★`}
          delta={`${totalReviews} reviews`} deltaPositive
          icon={<StarIcon className="w-5 h-5 text-gold-500" />}
          iconBg="bg-amber-50"
        />
      </div>

      {/* Revenue chart + referrals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2" padding="none">
          <div className="p-6 pb-2">
            <CardHeader title="Revenue Trend" subtitle="Last 14 days" />
          </div>
          {loading ? (
            <div className="h-48 mx-6 mb-6 bg-gray-100 rounded-xl animate-pulse" />
          ) : (
            <div className="px-4 pb-4">
              <Line data={revenueData} options={chartOptions} height={120} />
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Today's Highlights" />
            <div className="space-y-3">
              {[
                { label: 'Referrals',      value: todayMetrics?.referrals ?? 0,     icon: '🔗', color: 'text-blue-600' },
                { label: 'Google Reviews', value: todayMetrics?.googleReviews ?? 0, icon: '⭐', color: 'text-gold-500' },
                { label: 'Memberships',    value: 3,                                 icon: '💳', color: 'text-brand-600' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{icon} {label}</span>
                  <span className="font-bold text-gray-900 text-sm">+{value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-brand-600 to-brand-800 border-0 text-white">
            <p className="text-xs font-semibold text-brand-200 uppercase tracking-wide">Monthly Revenue</p>
            <p className="text-3xl font-bold mt-1">£12,480</p>
            <p className="text-brand-200 text-xs mt-1">↑ 18% vs last month</p>
            <div className="mt-3 pt-3 border-t border-brand-500/40">
              <div className="flex justify-between text-xs">
                <span className="text-brand-200">Memberships</span>
                <span className="font-semibold">£4,950</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-brand-200">Treatments</span>
                <span className="font-semibold">£7,530</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Staff leaderboard */}
      <StaffLeaderboard staff={staff} loading={loading} />

      {/* QR Scanner modal */}
      <Modal open={scannerActive} onClose={() => dispatch(toggleScanner())} title="Patient QR Check-in" size="sm">
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl h-48 flex items-center justify-center">
            <div className="text-center">
              <QrCodeIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Camera preview (in production)</p>
              <p className="text-gray-500 text-xs mt-1">Scan patient's app QR code</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Or enter QR code manually:</p>
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

          <p className="text-xs text-gray-400 text-center">Each check-in awards the patient +60 loyalty points</p>
        </div>
      </Modal>

      {/* Scan success toast-style card */}
      {lastScannedPatient && (
        <Modal open={!!lastScannedPatient} onClose={() => dispatch(clearScan())} size="sm">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Check-in Successful!</h3>
            <p className="text-gray-600 text-sm"><strong>{lastScannedPatient.name}</strong> has been checked in.</p>
            <Badge variant="gold">+{lastScannedPatient.points} loyalty points awarded</Badge>
            <Button variant="secondary" fullWidth onClick={() => dispatch(clearScan())}>Done</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
