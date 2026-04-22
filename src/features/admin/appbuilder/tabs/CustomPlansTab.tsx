import { useEffect, useState } from 'react'
import { PlusIcon, CheckIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchMembershipTiers, selectTier, deleteMembershipTier } from '@/features/admin/memberships/membershipsSlice'
import MembershipModal from '@/features/admin/memberships/components/MembershipModal'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { MembershipTier } from '@/types'

const planColor: Record<string, 'gray' | 'blue' | 'purple'> = {
  starter: 'gray', growth: 'blue', enterprise: 'purple',
}

export default function CustomPlansTab() {
  const dispatch = useAppDispatch()
  const { tiers, subscriptions, loading } = useAppSelector((s) => s.memberships)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => { dispatch(fetchMembershipTiers()) }, [dispatch])

  const openEdit = (t: MembershipTier) => { dispatch(selectTier(t)); setShowModal(true) }
  const openNew  = () => { dispatch(selectTier(null)); setShowModal(true) }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Custom Membership Plans</h2>
          <p className="text-sm text-gray-500 mt-0.5">{tiers.length} plans · {subscriptions.filter((s) => s.status === 'active').length} active subscribers</p>
        </div>
        <Button onClick={openNew} size="sm">
          <PlusIcon className="w-4 h-4" /> New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? [1,2,3].map((i) => (
          <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        )) : tiers.map((tier, idx) => (
          <Card key={tier.id} padding="none" className={idx === 1 ? 'ring-2 ring-brand-400' : ''}>
            {idx === 1 && (
              <div className="bg-brand-600 text-white text-xs font-bold text-center py-1.5 rounded-t-2xl">Most Popular</div>
            )}
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{tier.name}</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">
                    £{tier.monthlyPrice}<span className="text-sm text-gray-400 font-normal">/mo</span>
                  </p>
                  {tier.annualPrice && (
                    <p className="text-xs text-green-600 font-medium">
                      Save £{(tier.monthlyPrice * 12 - tier.annualPrice)} annually
                    </p>
                  )}
                </div>
                <Badge variant={tier.isActive ? 'green' : 'gray'} dot>
                  {tier.isActive ? 'Active' : 'Draft'}
                </Badge>
              </div>

              <div className="space-y-1.5 mb-4">
                {tier.perks.slice(0, 4).map((p) => (
                  <div key={p} className="flex items-start gap-2">
                    <CheckIcon className="w-3.5 h-3.5 text-brand-500 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-600">{p}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Rollover: <span className="font-medium capitalize">{tier.rolloverMode}</span>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(tier)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                    <PencilIcon className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                  <button onClick={() => dispatch(deleteMembershipTier(tier.id))} className="p-1.5 hover:bg-red-50 rounded-lg">
                    <TrashIcon className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <MembershipModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}
