import { useEffect } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchDashboard } from '../dashboard/dashboardSlice'
import Card, { CardHeader } from '@/components/ui/Card'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

export default function AnalyticsPage() {
  const dispatch = useAppDispatch()
  const { metrics, loading } = useAppSelector((s) => s.dashboard)

  useEffect(() => { dispatch(fetchDashboard()) }, [dispatch])

  const barData = {
    labels: metrics.slice(-7).map((m) => m.date.slice(5)),
    datasets: [
      { label: 'Revenue', data: metrics.slice(-7).map((m) => m.revenue),    backgroundColor: '#c026d3', borderRadius: 8 },
      { label: 'Check-ins', data: metrics.slice(-7).map((m) => m.checkIns * 30), backgroundColor: '#e879f9', borderRadius: 8 },
    ],
  }

  const donutData = {
    labels: ['Memberships', 'Treatments', 'BNPL'],
    datasets: [{ data: [4950, 6350, 1180], backgroundColor: ['#c026d3', '#e879f9', '#f0abfc'], borderWidth: 0 }],
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Business performance insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader title="7-Day Revenue vs Check-ins" />
          {loading ? <div className="h-48 bg-gray-100 rounded-xl animate-pulse" /> : <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: 'top' } }, scales: { x: { grid: { display: false } } } }} />}
        </Card>

        <Card>
          <CardHeader title="Revenue by Source" />
          <div className="flex items-center justify-center">
            <div className="w-48">
              <Doughnut data={donutData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, cutout: '65%' }} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue (30d)', value: `£${metrics.reduce((s, m) => s + m.revenue, 0).toLocaleString()}`, change: '+18%' },
          { label: 'New Patients (30d)',  value: metrics.reduce((s, m) => s + m.newPatients, 0),   change: '+12%' },
          { label: 'Referrals (30d)',     value: metrics.reduce((s, m) => s + m.referrals, 0),     change: '+24%' },
          { label: 'Google Reviews (30d)',value: metrics.reduce((s, m) => s + m.googleReviews, 0), change: '+8%' },
        ].map(({ label, value, change }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            {loading ? <div className="h-7 bg-gray-100 rounded-lg animate-pulse mt-1.5" /> : (
              <>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                <p className="text-xs text-green-600 font-medium mt-0.5">↑ {change}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
