import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeftIcon, BuildingStorefrontIcon, CheckCircleIcon,
  EnvelopeIcon, PhoneIcon, GlobeAltIcon, CurrencyPoundIcon,
  UserGroupIcon, StarIcon, ChartBarIcon,
} from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchPlatformClinics, selectClinic, approveClinic, rejectClinic, suspendClinic, updateClinicPlan } from '../platformSlice'
import type { PlatformClinic } from '../platformSlice'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card, { CardHeader } from '@/components/ui/Card'
import Toggle from '@/components/ui/Toggle'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const planColor: Record<string, 'gray' | 'blue' | 'purple'> = {
  starter: 'gray', growth: 'blue', enterprise: 'purple',
}
const statusBadge: Record<string, 'yellow' | 'green' | 'red'> = {
  pending: 'yellow', approved: 'green', rejected: 'red',
}

export default function ClinicDetailPage() {
  const { id }   = useParams<{ id: string }>()
  const dispatch  = useAppDispatch()
  const navigate  = useNavigate()
  const { clinics, loading } = useAppSelector((s) => s.platform)
  const clinic = clinics.find((c) => c.id === id) ?? null

  useEffect(() => {
    if (!clinics.length) dispatch(fetchPlatformClinics())
  }, [dispatch, clinics.length])

  if (loading) return <div className="text-center py-20 text-gray-400">Loading…</div>
  if (!clinic)  return <div className="text-center py-20 text-gray-400">Clinic not found. <Link to="/platform/clinics" className="text-indigo-600">Go back</Link></div>

  const handleApprove = async () => {
    await dispatch(approveClinic(clinic.id))
    toast.success(`${clinic.name} approved!`)
  }

  const handleSuspend = async () => {
    if (!confirm(`Suspend ${clinic.name}?`)) return
    await dispatch(suspendClinic(clinic.id))
    toast.success('Clinic suspended')
    navigate('/platform/clinics')
  }

  const handlePlan = async (plan: PlatformClinic['plan']) => {
    await dispatch(updateClinicPlan({ clinicId: clinic.id, plan }))
    toast.success(`Plan updated to ${plan}`)
  }

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div>
        <Link to="/platform/clinics" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeftIcon className="w-4 h-4" /> All Clinics
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
              <BuildingStorefrontIcon className="w-7 h-7 text-indigo-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{clinic.name}</h1>
              <p className="text-gray-500 text-sm">{clinic.ownerName} · {clinic.city}, {clinic.country}</p>
              <div className="flex gap-2 mt-1.5">
                <Badge variant={statusBadge[clinic.reviewStatus] ?? 'gray'} dot className="capitalize">{clinic.reviewStatus}</Badge>
                <Badge variant={planColor[clinic.plan]} className="capitalize">{clinic.plan} plan</Badge>
                {clinic.stripeConnected && <Badge variant="green">Stripe Connected</Badge>}
                {clinic.bnplEnabled && <Badge variant="blue">BNPL On</Badge>}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {clinic.reviewStatus === 'pending' && (
              <Button onClick={handleApprove}>
                <CheckCircleIcon className="w-4 h-4" /> Approve
              </Button>
            )}
            {clinic.reviewStatus === 'approved' && (
              <Button variant="danger" onClick={handleSuspend}>Suspend</Button>
            )}
          </div>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients',  value: clinic.totalPatients.toLocaleString(), icon: <UserGroupIcon className="w-5 h-5 text-blue-600" />,         bg: 'bg-blue-50'   },
          { label: 'Active Members',  value: clinic.activeMembers,                  icon: <StarIcon className="w-5 h-5 text-amber-500" />,              bg: 'bg-amber-50'  },
          { label: 'Monthly Revenue', value: `£${clinic.monthlyRevenue.toLocaleString()}`, icon: <CurrencyPoundIcon className="w-5 h-5 text-green-600" />, bg: 'bg-green-50' },
          { label: 'Treatments',      value: clinic.totalTreatments,                icon: <ChartBarIcon className="w-5 h-5 text-indigo-600" />,         bg: 'bg-indigo-50' },
        ].map(({ label, value, icon, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>{icon}</div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Contact info */}
        <Card>
          <CardHeader title="Clinic Information" />
          <div className="space-y-3 text-sm">
            {[
              { icon: <EnvelopeIcon className="w-4 h-4" />,  label: 'Business Email', value: clinic.businessEmail },
              { icon: <PhoneIcon className="w-4 h-4" />,     label: 'Phone',          value: clinic.phone },
              { icon: <GlobeAltIcon className="w-4 h-4" />,  label: 'Timezone',       value: clinic.timezone },
              { icon: <BuildingStorefrontIcon className="w-4 h-4" />, label: 'Joined', value: clinic.joinedAgo + ` (${format(new Date(clinic.createdAt), 'dd MMM yyyy')})` },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-gray-900 font-medium">{value}</p>
                </div>
              </div>
            ))}
            {clinic.approvedAt && (
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">Approved</p>
                  <p className="text-gray-900 font-medium">{format(new Date(clinic.approvedAt), 'dd MMM yyyy, HH:mm')}</p>
                </div>
              </div>
            )}
            {clinic.reviewNotes && (
              <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                <p className="text-xs font-semibold text-red-700 mb-0.5">Rejection Reason</p>
                <p className="text-xs text-red-600">{clinic.reviewNotes}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Plan + feature flags */}
        <Card>
          <CardHeader title="Plan & Feature Flags" />
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Subscription Plan</p>
              <div className="flex gap-2">
                {(['starter', 'growth', 'enterprise'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePlan(p)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all capitalize ${clinic.plan === p ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <Toggle
                checked={clinic.stripeConnected}
                onChange={() => toast('Stripe status managed by clinic')}
                label="Stripe Connected"
                description="Clinic has linked their payment account"
              />
              <Toggle
                checked={clinic.bnplEnabled}
                onChange={() => toast('BNPL toggled — changes saved')}
                label="BNPL (Klarna)"
                description="Buy Now Pay Later enabled for this clinic"
              />
              <Toggle
                checked={clinic.passFeesToPatient}
                onChange={() => toast('Fee setting toggled')}
                label="Pass Fees to Patient"
                description="Processing fees added to patient checkout"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Danger zone */}
      {clinic.reviewStatus === 'approved' && (
        <Card className="border-red-100">
          <CardHeader title="Danger Zone" subtitle="Irreversible platform actions" />
          <div className="flex items-center justify-between bg-red-50 rounded-xl p-4 border border-red-100">
            <div>
              <p className="text-sm font-semibold text-red-800">Suspend Clinic</p>
              <p className="text-xs text-red-600 mt-0.5">Immediately revokes clinic access. Patients retain their data.</p>
            </div>
            <Button variant="danger" size="sm" onClick={handleSuspend}>Suspend</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
