import { useState } from 'react'
import { GiftIcon, StarIcon, LinkIcon, MegaphoneIcon } from '@heroicons/react/24/outline'
import Card, { CardHeader } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Toggle from '@/components/ui/Toggle'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import toast from 'react-hot-toast'

export default function RewardsTab() {
  const [purchaseRate,   setPurchaseRate]   = useState(1)       // points per £1
  const [referralPts,   setReferralPts]    = useState(200)
  const [reviewPts,     setReviewPts]      = useState(80)
  const [checkinPts,    setCheckinPts]     = useState(60)
  const [signupPts,     setSignupPts]      = useState(50)
  const [expiryDays,    setExpiryDays]     = useState(3)
  const [bankInEnabled, setBankInEnabled]  = useState(true)
  const [redeemEnabled, setRedeemEnabled]  = useState(true)

  const handleSave = () => toast.success('Rewards configuration saved')

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Rewards Engine</h2>
        <p className="text-sm text-gray-500 mt-0.5">Configure point earn rates, redemption rules and gamification</p>
      </div>

      {/* Earn rules */}
      <Card>
        <CardHeader title="Point Earn Rules" subtitle="How patients accumulate points" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5"><StarIcon className="w-4 h-4 text-amber-500" />Points per £1 spent</span>
            </label>
            <div className="flex items-center gap-3">
              <input type="range" min={1} max={10} value={purchaseRate} onChange={(e) => setPurchaseRate(+e.target.value)} className="flex-1 accent-brand-600" />
              <span className="text-sm font-bold text-gray-900 w-12 text-right">{purchaseRate} pt</span>
            </div>
          </div>

          {[
            { label: 'Referral bonus',       icon: '🔗', value: referralPts,  set: setReferralPts  },
            { label: 'Google review bonus',  icon: '⭐', value: reviewPts,    set: setReviewPts    },
            { label: 'Check-in bonus',       icon: '📱', value: checkinPts,   set: setCheckinPts   },
            { label: 'Signup welcome bonus', icon: '🎉', value: signupPts,    set: setSignupPts    },
          ].map(({ label, icon, value, set }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{icon} {label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="number" min={0} value={value}
                  onChange={(e) => set(+e.target.value)}
                  className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
                <span className="text-sm text-gray-500">points</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Redemption */}
      <Card>
        <CardHeader title="Redemption Settings" subtitle="How patients can spend points" />
        <div className="space-y-4">
          <Toggle
            checked={bankInEnabled}
            onChange={setBankInEnabled}
            label="Bank In (Cash Discount)"
            description="Allow patients to convert points into a cash discount (100 pts = £1)"
          />
          <Toggle
            checked={redeemEnabled}
            onChange={setRedeemEnabled}
            label="Redeem for Free Service"
            description="Allow patients to exchange points for specific treatments"
          />
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5"><GiftIcon className="w-4 h-4 text-brand-500" />Reward expiry timer (days)</span>
            </label>
            <div className="flex items-center gap-3">
              <input type="range" min={1} max={14} value={expiryDays} onChange={(e) => setExpiryDays(+e.target.value)} className="w-48 accent-brand-600" />
              <span className="text-sm font-bold text-gray-900">{expiryDays} day{expiryDays > 1 ? 's' : ''}</span>
              {expiryDays <= 3 && <Badge variant="red">High urgency</Badge>}
              {expiryDays > 3 && expiryDays <= 7 && <Badge variant="yellow">Medium urgency</Badge>}
              {expiryDays > 7 && <Badge variant="green">Low urgency</Badge>}
            </div>
            <p className="text-xs text-gray-400 mt-1">Redeemed rewards expire after this many days, driving immediate booking</p>
          </div>
        </div>
      </Card>

      {/* Summary preview */}
      <Card className="bg-brand-50 border-brand-100">
        <CardHeader title="Current Configuration Preview" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Per £1 spent',   value: `${purchaseRate} pt`   },
            { label: 'Referral',       value: `${referralPts} pts`   },
            { label: 'Google Review',  value: `${reviewPts} pts`     },
            { label: 'Check-in',       value: `${checkinPts} pts`    },
            { label: 'Signup Bonus',   value: `${signupPts} pts`     },
            { label: 'Reward Expiry',  value: `${expiryDays}d`       },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl px-3 py-2.5 border border-brand-100">
              <p className="text-xs text-gray-500">{label}</p>
              <p className="font-bold text-gray-900 text-sm mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      <Button onClick={handleSave}>Save Rewards Configuration</Button>
    </div>
  )
}
