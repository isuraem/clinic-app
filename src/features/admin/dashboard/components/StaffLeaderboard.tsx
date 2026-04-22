import type { StaffMember } from '@/types'
import Card, { CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface Props { staff: StaffMember[]; loading: boolean }

const medals = ['🥇', '🥈', '🥉']

export default function StaffLeaderboard({ staff, loading }: Props) {
  const sorted = [...staff].sort((a, b) => b.totalRevenue - a.totalRevenue)

  return (
    <Card>
      <CardHeader
        title="Staff Leaderboard"
        subtitle="Performance this month"
        action={
          <div className="flex gap-1">
            {(['week', 'month', 'quarter'] as const).map((p) => (
              <button key={p} className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${p === 'month' ? 'bg-brand-100 text-brand-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        }
      />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((member, i) => (
            <div key={member.id} className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${i === 0 ? 'bg-amber-50 border border-amber-100' : 'hover:bg-gray-50'}`}>
              <span className="text-lg w-6 text-center">{medals[i] ?? `#${i + 1}`}</span>
              <img
                src={member.avatarUrl ?? `https://api.dicebear.com/8.x/avataaars/svg?seed=${member.name}`}
                alt={member.name}
                className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{member.name}</p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-right">
                <div>
                  <p className="text-xs text-gray-400">Memberships</p>
                  <p className="text-sm font-bold text-gray-900">{member.membershipsSold}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Redemptions</p>
                  <p className="text-sm font-bold text-gray-900">{member.treatmentsRedeemed}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Revenue</p>
                  <p className="text-sm font-bold text-gray-900">£{member.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
              {i === 0 && <Badge variant="gold">Top Performer</Badge>}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
