import { useEffect, useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchMembershipTiers, selectTier, deleteMembershipTier } from '../membershipsSlice'
import type { MembershipTier } from '@/types'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Card, { CardHeader } from '@/components/ui/Card'
import MembershipModal from './MembershipModal'

export default function MembershipsPage() {
  const dispatch = useAppDispatch()
  const { tiers, subscriptions, loading } = useAppSelector((s) => s.memberships)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => { dispatch(fetchMembershipTiers()) }, [dispatch])

  const openCreate = () => { dispatch(selectTier(null)); setShowModal(true) }
  const openEdit   = (t: MembershipTier) => { dispatch(selectTier(t)); setShowModal(true) }

  const activeSubCount = subscriptions.filter((s) => s.status === 'active').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Memberships</h1>
          <p className="text-gray-500 text-sm mt-0.5">{activeSubCount} active subscribers · {tiers.length} tiers</p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon className="w-4 h-4" />
          New Tier
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-brand-600 rounded-2xl p-5 text-white">
          <p className="text-brand-200 text-xs font-semibold uppercase tracking-wide">Monthly Recurring</p>
          <p className="text-3xl font-bold mt-1">£{(activeSubCount * 99).toLocaleString()}</p>
          <p className="text-brand-200 text-xs mt-1">Est. based on active subscribers</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Active Members</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{activeSubCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Churn Rate</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">3.2%</p>
          <p className="text-xs text-green-600 mt-1">↓ 0.8% vs last month</p>
        </div>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />)
        ) : (
          tiers.map((tier, idx) => (
            <Card key={tier.id} padding="none" className={idx === 1 ? 'ring-2 ring-brand-500' : ''}>
              {idx === 1 && (
                <div className="bg-brand-600 text-white text-xs font-bold text-center py-1.5 rounded-t-2xl">Most Popular</div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{tier.name}</h3>
                    <div className="mt-1">
                      <span className="text-3xl font-bold text-gray-900">£{tier.monthlyPrice}</span>
                      <span className="text-gray-500 text-sm">/mo</span>
                    </div>
                    {tier.annualPrice && (
                      <p className="text-xs text-green-600 font-medium mt-0.5">
                        Save £{(tier.monthlyPrice * 12 - tier.annualPrice).toFixed(0)} annually
                      </p>
                    )}
                  </div>
                  <Badge variant={tier.isActive ? 'green' : 'gray'} dot>{tier.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>

                <div className="mt-4 space-y-2">
                  {tier.perks.map((perk) => (
                    <div key={perk} className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{perk}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Rollover</span>
                    <Badge variant={tier.rolloverMode === 'stack' ? 'blue' : 'yellow'}>
                      {tier.rolloverMode === 'stack' ? `Stacks (max ${tier.rolloverCapSessions ?? '∞'})` : 'Expires monthly'}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" fullWidth onClick={() => openEdit(tier)}>
                    <PencilIcon className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <button onClick={() => dispatch(deleteMembershipTier(tier.id))} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <TrashIcon className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <MembershipModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}
