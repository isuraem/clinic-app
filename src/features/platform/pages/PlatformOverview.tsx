import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BuildingStorefrontIcon, UserGroupIcon,
  CurrencyPoundIcon, ClockIcon, CheckCircleIcon, XCircleIcon,
} from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchPlatformClinics } from '../platformSlice'
import StatCard from '@/components/ui/StatCard'
import Card, { CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { format } from 'date-fns'

const planColor: Record<string, 'gray' | 'blue' | 'purple'> = {
  starter: 'gray', growth: 'blue', enterprise: 'purple',
}

export default function PlatformOverview() {
  const dispatch = useAppDispatch()
  const { clinics, platformMetrics, loading } = useAppSelector((s) => s.platform)

  useEffect(() => { dispatch(fetchPlatformClinics()) }, [dispatch])

  const pending  = clinics.filter((c) => c.reviewStatus === 'pending')
  const approved = clinics.filter((c) => c.reviewStatus === 'approved')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
          <p className="text-gray-500 text-sm mt-0.5">All clinics across the Dermis network</p>
        </div>
        <div className="flex items-center gap-2">
          {pending.length > 0 && (
            <Link to="/platform/approvals">
              <Button variant="danger" size="sm">
                <ClockIcon className="w-4 h-4" />
                {pending.length} Pending Review
              </Button>
            </Link>
          )}
          <Link to="/platform/clinics">
            <Button variant="outline" size="sm">View All Clinics</Button>
          </Link>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Clinics" loading={loading}
          value={platformMetrics?.totalClinics ?? 0}
          delta={`${approved.length} active`} deltaPositive
          icon={<BuildingStorefrontIcon className="w-5 h-5 text-indigo-600" />}
          iconBg="bg-indigo-50"
        />
        <StatCard
          label="Pending Approvals" loading={loading}
          value={platformMetrics?.pendingApprovals ?? 0}
          icon={<ClockIcon className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50"
        />
        <StatCard
          label="Total Patients" loading={loading}
          value={(platformMetrics?.totalPatients ?? 0).toLocaleString()}
          delta="across all clinics" deltaPositive
          icon={<UserGroupIcon className="w-5 h-5 text-green-600" />}
          iconBg="bg-green-50"
        />
        <StatCard
          label="Platform MRR" loading={loading}
          value={`£${(platformMetrics?.totalMRR ?? 0).toLocaleString()}`}
          delta="↑ 22% vs last month" deltaPositive
          icon={<CurrencyPoundIcon className="w-5 h-5 text-brand-600" />}
          iconBg="bg-brand-50"
        />
      </div>

      {/* Pending approvals banner */}
      {pending.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader
            title={`${pending.length} Clinic${pending.length > 1 ? 's' : ''} Awaiting Approval`}
            subtitle="Review and approve within 1–3 business days"
            action={<Link to="/platform/approvals"><Button size="sm">Review Now</Button></Link>}
          />
          <div className="space-y-2">
            {pending.map((c) => (
              <div key={c.id} className="flex items-center justify-between bg-white rounded-xl p-3 border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <BuildingStorefrontIcon className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.city}, {c.country} · {c.ownerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">Submitted {c.joinedAgo}</span>
                  <Badge variant="yellow" dot>Pending</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Active clinics table */}
      <Card padding="none">
        <div className="p-6 pb-3">
          <CardHeader
            title="Active Clinics"
            subtitle={`${approved.length} approved clinics`}
            action={<Link to="/platform/clinics" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View all →</Link>}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Clinic', 'Location', 'Plan', 'Patients', 'Members', 'MRR', 'Status'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {approved.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/platform/clinics/${c.id}`} className="hover:text-indigo-600 transition-colors">
                      <p className="font-semibold text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.businessEmail}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{c.city}, {c.country}</td>
                  <td className="px-4 py-3">
                    <Badge variant={planColor[c.plan]} className="capitalize">{c.plan}</Badge>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{c.totalPatients.toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{c.activeMembers}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">£{c.monthlyRevenue.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Badge variant="green" dot>Active</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
