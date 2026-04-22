import Card, { CardHeader } from '@/components/ui/Card'
import Toggle from '@/components/ui/Toggle'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function PlatformSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [autoApprove, setAutoApprove] = useState(false)
  const [emailNotifs, setEmailNotifs] = useState(true)

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Global configuration for the Dermis platform</p>
      </div>

      <Card>
        <CardHeader title="Platform Status" />
        <div className="space-y-4">
          <Toggle
            checked={maintenanceMode}
            onChange={(v) => { setMaintenanceMode(v); toast(v ? '⚠️ Maintenance mode ON' : 'Maintenance mode off') }}
            label="Maintenance Mode"
            description="Blocks all clinic and patient access. Show maintenance page."
          />
          <Toggle
            checked={autoApprove}
            onChange={(v) => { setAutoApprove(v); toast(v ? 'Auto-approve enabled' : 'Auto-approve disabled') }}
            label="Auto-Approve Clinics"
            description="Skip manual review and approve clinics instantly (not recommended)"
          />
          <Toggle
            checked={emailNotifs}
            onChange={setEmailNotifs}
            label="Admin Email Notifications"
            description="Receive email alerts for new applications and critical events"
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="Platform Fees" subtitle="Revenue share from clinic subscriptions" />
        <div className="space-y-4">
          <Input label="Platform Fee %" defaultValue="2.9" hint="Percentage taken on each clinic transaction" />
          <Input label="Fixed Fee (£)" defaultValue="0.30" hint="Fixed amount per transaction" />
          <div className="flex gap-3">
            <Button onClick={() => toast.success('Fee settings saved')}>Save Fee Settings</Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Plan Pricing" subtitle="Monthly prices for each plan tier" />
        <div className="space-y-3">
          {[
            { plan: 'Starter',    price: '49',  color: 'gray'   as const },
            { plan: 'Growth',     price: '149', color: 'blue'   as const },
            { plan: 'Enterprise', price: '399', color: 'purple' as const },
          ].map(({ plan, price, color }) => (
            <div key={plan} className="flex items-center gap-4">
              <Badge variant={color} className="w-24 text-center justify-center capitalize">{plan}</Badge>
              <Input defaultValue={price} prefix={<span className="text-sm">£</span>} suffix={<span className="text-xs text-gray-400">/mo</span>} />
            </div>
          ))}
          <Button variant="secondary" onClick={() => toast.success('Plan prices saved')}>Save Pricing</Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Super Admin Account" />
        <div className="space-y-4">
          <Input label="Platform Name" defaultValue="Dermis" />
          <Input label="Support Email" defaultValue="support@dermis.clinic" />
          <Button onClick={() => toast.success('Settings saved')}>Save</Button>
        </div>
      </Card>
    </div>
  )
}
