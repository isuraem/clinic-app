import { useEffect } from 'react'
import { CheckBadgeIcon, CreditCardIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchBilling, connectStripe, togglePassFees, toggleBNPL } from '../billingSlice'
import { updateClinicSettings } from '@/features/auth/authSlice'
import Button from '@/components/ui/Button'
import Card, { CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Toggle from '@/components/ui/Toggle'
import { format } from 'date-fns'

export default function BillingPage() {
  const dispatch = useAppDispatch()
  const { stripeConnected, passFeesToPatient, bnplEnabled, transactions, monthlyRevenue, monthlyFees, loading } = useAppSelector((s) => s.billing)

  useEffect(() => { dispatch(fetchBilling()) }, [dispatch])

  const handleConnectStripe = async () => {
    const result = await dispatch(connectStripe())
    if (connectStripe.fulfilled.match(result)) {
      dispatch(updateClinicSettings({ stripeConnected: true, stripeAccountId: result.payload.accountId }))
    }
  }

  const handleTogglePassFees = () => {
    dispatch(togglePassFees())
    dispatch(updateClinicSettings({ passFeesToPatient: !passFeesToPatient }))
  }

  const handleToggleBNPL = () => {
    dispatch(toggleBNPL())
    dispatch(updateClinicSettings({ bnplEnabled: !bnplEnabled }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
        <p className="text-gray-500 text-sm mt-0.5">Stripe Connect, fees, and BNPL configuration</p>
      </div>

      {/* Stripe Connect */}
      <Card gradient>
        <CardHeader title="Stripe Connect" subtitle="Accept payments and manage payouts" />
        {stripeConnected ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckBadgeIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Connected to Stripe</p>
                <p className="text-xs text-gray-500">Platform fee: 2.9% + 30p per transaction</p>
              </div>
            </div>
            <Badge variant="green" dot>Active</Badge>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 font-medium">Connect your Stripe account to accept payments</p>
              <p className="text-xs text-gray-500 mt-0.5">Supports cards, Apple Pay, and BNPL</p>
            </div>
            <Button onClick={handleConnectStripe} loading={loading}>
              <CreditCardIcon className="w-4 h-4" />
              Connect Stripe
            </Button>
          </div>
        )}
      </Card>

      {/* Fee settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader title="Transaction Fee Handling" subtitle="Choose who pays processing fees" />
          <div className="space-y-4">
            <Toggle
              checked={passFeesToPatient}
              onChange={handleTogglePassFees}
              label="Pass fees to patient"
              description="Adds processing fee (2.9% + 30p) to patient's total at checkout"
            />
            {passFeesToPatient && (
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                <p className="text-xs text-amber-800 font-medium">Fee shown transparently at checkout as "Processing fee"</p>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Buy Now, Pay Later" subtitle="Klarna & BNPL integrations" />
          <div className="space-y-4">
            <Toggle
              checked={bnplEnabled}
              onChange={handleToggleBNPL}
              label="Enable BNPL (Klarna)"
              description="Patients can split payments into 3 interest-free instalments"
            />
            {bnplEnabled && (
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">K</div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Klarna</p>
                    <p className="text-xs text-gray-500">Pay in 3 · Interest-free</p>
                  </div>
                  <Badge variant="green" className="ml-auto">Enabled</Badge>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Monthly summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Monthly Revenue</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">£{monthlyRevenue.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Processing Fees</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">£{monthlyFees.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{((monthlyFees / monthlyRevenue) * 100).toFixed(1)}% effective rate</p>
        </Card>
      </div>

      {/* Transactions */}
      <Card padding="none">
        <div className="p-6 pb-3">
          <CardHeader title="Recent Transactions" subtitle="Last 30 days" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Patient', 'Amount', 'Fee', 'Net', 'Type', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{t.patientName}</td>
                  <td className="px-4 py-3 text-gray-700">£{t.amount}</td>
                  <td className="px-4 py-3 text-gray-500">£{t.fee}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">£{t.net}</td>
                  <td className="px-4 py-3">
                    <Badge variant={t.type === 'membership' ? 'purple' : t.type === 'bnpl' ? 'blue' : 'gray'}>
                      {t.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={t.status === 'succeeded' ? 'green' : t.status === 'pending' ? 'yellow' : 'red'} dot>
                      {t.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{format(new Date(t.createdAt), 'dd MMM yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
