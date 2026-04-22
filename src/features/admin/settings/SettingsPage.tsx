import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { updateClinicSettings } from '@/features/auth/authSlice'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card, { CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import toast from 'react-hot-toast'

const TIMEZONES = ['Europe/London', 'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Asia/Dubai']

export default function SettingsPage() {
  const dispatch = useAppDispatch()
  const clinic   = useAppSelector((s) => s.auth.clinic)
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues: clinic ?? {} })

  const onSubmit = (data: any) => {
    dispatch(updateClinicSettings(data))
    toast.success('Settings saved')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your clinic profile and preferences</p>
      </div>

      <Card>
        <CardHeader
          title="Clinic Status"
          action={<Badge variant={clinic?.reviewStatus === 'approved' ? 'green' : 'yellow'} dot>{clinic?.reviewStatus}</Badge>}
        />
        {clinic?.reviewStatus === 'approved' && (
          <p className="text-sm text-green-700 bg-green-50 rounded-xl p-3 border border-green-100">
            Your clinic is verified and live. Patients can discover and book treatments.
          </p>
        )}
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader title="Clinic Profile" />
          <div className="space-y-4">
            <Input label="Clinic Name"    {...register('name')} />
            <Input label="Business Email" {...register('businessEmail')} />
            <Input label="Phone"          {...register('phone')} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City"    {...register('city')} />
              <Input label="Country" {...register('country')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label>
              <select className="w-full rounded-xl border border-gray-200 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400" {...register('timezone')}>
                {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>
            <div className="pt-2">
              <Button type="submit" loading={isSubmitting}>Save Changes</Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  )
}
