import { useEffect, useState } from 'react'
import {
  ClockIcon, CheckCircleIcon, XCircleIcon,
  BuildingStorefrontIcon, EnvelopeIcon, PhoneIcon, GlobeAltIcon,
} from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchPlatformClinics, approveClinic, rejectClinic } from '../platformSlice'
import type { PlatformClinic } from '../platformSlice'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function ApprovalsPage() {
  const dispatch = useAppDispatch()
  const { clinics, loading } = useAppSelector((s) => s.platform)
  const [rejectTarget, setRejectTarget] = useState<PlatformClinic | null>(null)
  const [rejectNotes, setRejectNotes] = useState('')
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => { dispatch(fetchPlatformClinics()) }, [dispatch])

  const pending  = clinics.filter((c) => c.reviewStatus === 'pending')
  const rejected = clinics.filter((c) => c.reviewStatus === 'rejected')

  const handleApprove = async (c: PlatformClinic) => {
    setProcessing(c.id)
    await dispatch(approveClinic(c.id))
    setProcessing(null)
    toast.success(`${c.name} approved! They can now access the platform.`)
  }

  const handleReject = async () => {
    if (!rejectTarget) return
    if (!rejectNotes.trim()) { toast.error('Please add a reason for rejection'); return }
    setProcessing(rejectTarget.id)
    await dispatch(rejectClinic({ clinicId: rejectTarget.id, notes: rejectNotes }))
    setProcessing(null)
    toast.error(`${rejectTarget.name} rejected.`)
    setRejectTarget(null)
    setRejectNotes('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clinic Approvals</h1>
        <p className="text-gray-500 text-sm mt-0.5">Review and verify new clinic applications</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <ClockIcon className="w-8 h-8 text-amber-500" />
          <div>
            <p className="text-2xl font-bold text-amber-700">{pending.length}</p>
            <p className="text-xs text-amber-600 font-medium">Pending Review</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircleIcon className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-2xl font-bold text-green-700">{clinics.filter((c) => c.reviewStatus === 'approved').length}</p>
            <p className="text-xs text-green-600 font-medium">Approved</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <XCircleIcon className="w-8 h-8 text-red-400" />
          <div>
            <p className="text-2xl font-bold text-red-600">{rejected.length}</p>
            <p className="text-xs text-red-500 font-medium">Rejected</p>
          </div>
        </div>
      </div>

      {/* Pending applications */}
      {pending.length === 0 && !loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <CheckCircleIcon className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900">All caught up!</h3>
          <p className="text-gray-500 text-sm mt-1">No pending clinic applications to review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-800">Pending Applications</h2>
          {pending.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <BuildingStorefrontIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{c.name}</h3>
                    <p className="text-xs text-gray-500">Applied {c.joinedAgo} · {format(new Date(c.reviewSubmittedAt), 'dd MMM yyyy, HH:mm')}</p>
                  </div>
                </div>
                <Badge variant="yellow" dot>Pending Review</Badge>
              </div>

              {/* Details grid */}
              <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Owner</p>
                  <p className="text-sm text-gray-900 font-medium">{c.ownerName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Location</p>
                  <p className="text-sm text-gray-900">{c.city}, {c.country}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Timezone</p>
                  <p className="text-sm text-gray-900">{c.timezone}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Business Email</p>
                  <div className="flex items-center gap-1.5">
                    <EnvelopeIcon className="w-3.5 h-3.5 text-gray-400" />
                    <p className="text-sm text-gray-900">{c.businessEmail}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                  <div className="flex items-center gap-1.5">
                    <PhoneIcon className="w-3.5 h-3.5 text-gray-400" />
                    <p className="text-sm text-gray-900">{c.phone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Plan Applied</p>
                  <Badge variant={c.plan === 'enterprise' ? 'purple' : c.plan === 'growth' ? 'blue' : 'gray'} className="capitalize">
                    {c.plan}
                  </Badge>
                </div>
              </div>

              {/* Checklist */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Verification Checklist</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { label: 'Business Email',     done: true },
                    { label: 'Phone Verified',     done: false },
                    { label: 'Business Reg.',      done: false },
                    { label: 'ID Check',           done: false },
                  ].map(({ label, done }) => (
                    <div key={label} className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg ${done ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {done
                        ? <CheckCircleIcon className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        : <ClockIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      }
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setRejectTarget(c)}
                  disabled={processing === c.id}
                >
                  <XCircleIcon className="w-4 h-4" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(c)}
                  loading={processing === c.id}
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  Approve Clinic
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejected log */}
      {rejected.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">Rejected Applications</h2>
          {rejected.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-red-100 shadow-sm p-4 flex items-center gap-4">
              <XCircleIcon className="w-8 h-8 text-red-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-500">{c.city}, {c.country} · {c.ownerName}</p>
                {c.reviewNotes && (
                  <p className="text-xs text-red-600 mt-1 bg-red-50 rounded-lg px-2.5 py-1.5 inline-block mt-1.5">
                    Reason: {c.reviewNotes}
                  </p>
                )}
              </div>
              <Badge variant="red">Rejected</Badge>
            </div>
          ))}
        </div>
      )}

      {/* Reject modal */}
      <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Application" size="md">
        <div className="space-y-4">
          <div className="bg-red-50 rounded-xl p-3 border border-red-100">
            <p className="text-sm font-semibold text-red-800">{rejectTarget?.name}</p>
            <p className="text-xs text-red-600 mt-0.5">{rejectTarget?.ownerName} · {rejectTarget?.city}, {rejectTarget?.country}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for rejection <span className="text-red-500">*</span></label>
            <textarea
              rows={3}
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="e.g. Unable to verify business registration. Please resubmit with valid documents."
              className="w-full rounded-xl border border-gray-200 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">This message will be emailed to the applicant.</p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleReject} loading={!!processing}>Send Rejection</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
