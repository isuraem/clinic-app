import { useEffect } from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, PointElement, LineElement, Tooltip, Legend, Filler,
} from 'chart.js'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchPlatformClinics } from '../platformSlice'
import Card, { CardHeader } from '@/components/ui/Card'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend, Filler)

export default function PlatformAnalyticsPage() {
  const dispatch = useAppDispatch()
  const { clinics, platformMetrics, loading } = useAppSelector((s) => s.platform)

  useEffect(() => { dispatch(fetchPlatformClinics()) }, [dispatch])

  const approved = clinics.filter((c) => c.reviewStatus === 'approved')

  const revenueBar = {
    labels: approved.map((c) => c.name.split(' ').slice(0, 2).join(' ')),
    datasets: [{
      label: 'Monthly Revenue (£)',
      data: approved.map((c) => c.monthlyRevenue),
      backgroundColor: ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'],
      borderRadius: 8,
    }],
  }

  const planDonut = {
    labels: ['Starter', 'Growth', 'Enterprise'],
    datasets: [{
      data: [
        clinics.filter((c) => c.plan === 'starter').length,
        clinics.filter((c) => c.plan === 'growth').length,
        clinics.filter((c) => c.plan === 'enterprise').length,
      ],
      backgroundColor: ['#e2e8f0', '#6366f1', '#7c3aed'],
      borderWidth: 0,
    }],
  }

  const growthLine = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Clinics Onboarded',
      data: [0, 1, 2, 3, 3, 6],
      fill: true,
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.08)',
      tension: 0.4,
      pointRadius: 4,
    }],
  }

  const chartOpts = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: '#f1f5f9' } } },
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Aggregate performance across all clinics</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Clinics',     value: platformMetrics?.totalClinics ?? 0,                                color: 'indigo' },
          { label: 'Total Patients',    value: (platformMetrics?.totalPatients ?? 0).toLocaleString(),            color: 'blue'   },
          { label: 'Platform MRR',      value: `£${(platformMetrics?.totalMRR ?? 0).toLocaleString()}`,           color: 'green'  },
          { label: 'Avg Google Rating', value: `${platformMetrics?.avgRating ?? 0} ★`,                           color: 'amber'  },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
            {loading
              ? <div className="h-8 w-28 bg-gray-100 rounded-lg animate-pulse mt-2" />
              : <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            }
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardHeader title="Revenue by Clinic" subtitle="Monthly (approved clinics)" />
          {loading
            ? <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
            : <Bar data={revenueBar} options={chartOpts} />
          }
        </Card>
        <Card>
          <CardHeader title="Plan Distribution" />
          <div className="flex items-center justify-center pt-2">
            <div className="w-44">
              <Doughnut data={planDonut} options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, cutout: '60%' }} />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Clinic Growth" subtitle="Cumulative onboarding by month" />
        {loading
          ? <div className="h-40 bg-gray-100 rounded-xl animate-pulse" />
          : <Line data={growthLine} options={{ ...chartOpts, plugins: { legend: { display: false } } }} height={80} />
        }
      </Card>

      {/* Per-clinic table */}
      <Card padding="none">
        <div className="p-6 pb-3">
          <CardHeader title="Per-Clinic Breakdown" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Clinic', 'Plan', 'Patients', 'Members', 'MRR', 'Treatments', 'Stripe'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {approved.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.city}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-600">{c.plan}</td>
                  <td className="px-4 py-3 font-medium">{c.totalPatients.toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium">{c.activeMembers}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">£{c.monthlyRevenue.toLocaleString()}</td>
                  <td className="px-4 py-3">{c.totalTreatments}</td>
                  <td className="px-4 py-3">
                    {c.stripeConnected
                      ? <span className="text-green-600 text-xs font-semibold">✓ Connected</span>
                      : <span className="text-gray-400 text-xs">Not connected</span>
                    }
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
