import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchDashboard } from '../dashboard/dashboardSlice'
import { setMembers } from './staffSlice'
import StaffLeaderboard from '../dashboard/components/StaffLeaderboard'
import StatCard from '@/components/ui/StatCard'
import { UsersIcon, TrophyIcon, CurrencyPoundIcon } from '@heroicons/react/24/outline'

export default function StaffPage() {
  const dispatch = useAppDispatch()
  const { staff, loading } = useAppSelector((s) => s.dashboard)

  useEffect(() => {
    dispatch(fetchDashboard())
  }, [dispatch])

  useEffect(() => {
    if (staff.length) dispatch(setMembers(staff))
  }, [staff, dispatch])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Staff Performance</h1>
        <p className="text-gray-500 text-sm mt-0.5">Individual leaderboard and accountability tracker</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Staff" value={staff.length} icon={<UsersIcon className="w-5 h-5 text-brand-600" />} iconBg="bg-brand-50" loading={loading} />
        <StatCard label="Top Revenue" value={`£${Math.max(0, ...staff.map((s) => s.totalRevenue)).toLocaleString()}`} icon={<CurrencyPoundIcon className="w-5 h-5 text-gold-500" />} iconBg="bg-amber-50" loading={loading} />
        <StatCard label="Total Memberships" value={staff.reduce((n, s) => n + s.membershipsSold, 0)} icon={<TrophyIcon className="w-5 h-5 text-green-600" />} iconBg="bg-green-50" loading={loading} />
      </div>

      <StaffLeaderboard staff={staff} loading={loading} />
    </div>
  )
}
