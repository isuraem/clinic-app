import { useEffect, useState } from 'react'
import { PlusIcon, PaperAirplaneIcon, PencilIcon } from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchOffers, selectOffer, sendOffer, toggleOfferActive } from '../offersSlice'
import type { Offer } from '@/types'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Card, { CardHeader } from '@/components/ui/Card'
import Toggle from '@/components/ui/Toggle'
import OfferModal from './OfferModal'
import ScratchCardPreview from './ScratchCardPreview'
import toast from 'react-hot-toast'

const triggerIcon = { birthday: '🎂', anniversary: '💍', holiday: '🎉', manual: '📢' }
const offerTypeLabel = { discount: 'Discount', free_treatment: 'Free Treatment', scratch_card: 'Scratch Card', points_bonus: 'Points Bonus' }
const offerTypeBadge: Record<string, 'purple' | 'green' | 'gold' | 'blue'> = {
  discount: 'purple', free_treatment: 'green', scratch_card: 'gold', points_bonus: 'blue',
}

export default function OffersPage() {
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector((s) => s.offers)
  const [showModal, setShowModal] = useState(false)
  const [scratchOffer, setScratchOffer] = useState<Offer | null>(null)

  useEffect(() => { dispatch(fetchOffers()) }, [dispatch])

  const handleSend = async (offerId: string) => {
    await dispatch(sendOffer(offerId))
    toast.success('Campaign sent to eligible patients!')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offers Engine</h1>
          <p className="text-gray-500 text-sm mt-0.5">Automated campaigns that drive bookings</p>
        </div>
        <Button onClick={() => { dispatch(selectOffer(null)); setShowModal(true) }}>
          <PlusIcon className="w-4 h-4" /> Create Offer
        </Button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Sent',        value: items.reduce((n, o) => n + o.sentCount, 0),        icon: '📤' },
          { label: 'Redemptions',       value: items.reduce((n, o) => n + o.redemptionCount, 0),  icon: '✅' },
          { label: 'Conversion Rate',   value: '72%',                                              icon: '📈' },
          { label: 'Active Campaigns',  value: items.filter((o) => o.isActive).length,             icon: '🔥' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xl">{icon}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Offer cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          [1, 2, 3, 4].map((i) => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />)
        ) : (
          items.map((offer) => (
            <Card key={offer.id} padding="none">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{triggerIcon[offer.triggerType]}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{offer.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{offer.description}</p>
                    </div>
                  </div>
                  <Toggle checked={offer.isActive} onChange={() => dispatch(toggleOfferActive(offer.id))} />
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="gray">{offer.triggerType}</Badge>
                  <Badge variant={offerTypeBadge[offer.offerType]}>{offerTypeLabel[offer.offerType]}</Badge>
                  {offer.discountPercent && <Badge variant="purple">{offer.discountPercent}% OFF</Badge>}
                  {offer.pointsBonus && <Badge variant="gold">+{offer.pointsBonus} pts</Badge>}
                  {offer.voiceMessageUrl && <Badge variant="blue">🎤 Voice Note</Badge>}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>{offer.sentCount} sent</span>
                    <span>{offer.redemptionCount} redeemed</span>
                    {offer.sentCount > 0 && (
                      <span className="text-green-600 font-medium">
                        {Math.round((offer.redemptionCount / offer.sentCount) * 100)}% rate
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {offer.offerType === 'scratch_card' && (
                      <Button variant="ghost" size="sm" onClick={() => setScratchOffer(offer)}>Preview</Button>
                    )}
                    <button
                      onClick={() => { dispatch(selectOffer(offer)); setShowModal(true) }}
                      className="p-1.5 hover:bg-gray-100 rounded-lg"
                    >
                      <PencilIcon className="w-4 h-4 text-gray-500" />
                    </button>
                    <Button size="sm" variant="secondary" onClick={() => handleSend(offer.id)}>
                      <PaperAirplaneIcon className="w-3.5 h-3.5" /> Send Now
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <OfferModal open={showModal} onClose={() => setShowModal(false)} />
      {scratchOffer && <ScratchCardPreview offer={scratchOffer} onClose={() => setScratchOffer(null)} />}
    </div>
  )
}
