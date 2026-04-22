import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlassIcon, BuildingStorefrontIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchPlatformClinics, setFilter, setSearch, suspendClinic, updateClinicPlan } from '../platformSlice'
import type { PlatformClinic } from '../platformSlice'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Menu } from '@headlessui/react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const STATUS_FILTERS = ['all', 'pending', 'approved', 'rejected'] as const
const statusBadge: Record<string, 'yellow' | 'green' | 'red' | 'gray'> = {
  pending: 'yellow', approved: 'green', rejected: 'red',
}
const planColor: Record<string, 'gray' | 'blue' | 'purple'> = {
  starter: 'gray', growth: 'blue', enterprise: 'purple',
}

export default function ClinicsListPage() {
  const dispatch = useAppDispatch()
  const { clinics, filter, search, loading } = useAppSelector((s) => s.platform)

  useEffect(() => { dispatch(fetchPlatformClinics()) }, [dispatch])

  const filtered = clinics.filter((c) => {
    const matchFilter = filter === 'all' || c.reviewStatus === filter
    const matchSearch = [c.name, c.city, c.country, c.ownerName, c.businessEmail]
      .some((f) => f.toLowerCase().includes(search.toLowerCase()))
    return matchFilter && matchSearch
  })

  const handleSuspend = async (c: PlatformClinic) => {
    if (!confirm(`Suspend ${c.name}? They will lose platform access.`)) return
    await dispatch(suspendClinic(c.id))
    toast.success(`${c.name} suspended`)
  }

  const handlePlanChange = async (clinicId: string, plan: PlatformClinic['plan']) => {
    await dispatch(updateClinicPlan({ clinicId, plan }))
    toast.success('Plan updated')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Clinics</h1>
          <p className="text-gray-500 text-sm mt-0.5">{filtered.length} of {clinics.length} clinics</p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            placeholder="Search by clinic name, city, owner..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div className="flex gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => dispatch(setFilter(f))}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${filter === f ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Clinic', 'Owner', 'Location', 'Plan', 'Patients', 'MRR', 'Status', 'Joined', ''].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">Loading clinics…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">No clinics found</td></tr>
            )}
            {!loading && filtered.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                <td className="px-4 py-3">
                  <Link to={`/platform/clinics/${c.id}`} className="hover:text-indigo-600 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <BuildingStorefrontIcon className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.businessEmail}</p>
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">{c.ownerName}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{c.city}, {c.country}</td>
                <td className="px-4 py-3">
                  <Menu as="div" className="relative">
                    <Menu.Button>
                      <Badge variant={planColor[c.plan]} className="capitalize cursor-pointer hover:opacity-80">{c.plan} ▾</Badge>
                    </Menu.Button>
                    <Menu.Items className="absolute z-10 mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden text-xs">
                      {(['starter', 'growth', 'enterprise'] as const).map((p) => (
                        <Menu.Item key={p}>
                          {({ active }) => (
                            <button
                              onClick={() => handlePlanChange(c.id, p)}
                              className={`w-full text-left px-3 py-2 capitalize ${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'} ${c.plan === p ? 'font-bold' : ''}`}
                            >
                              {p} {c.plan === p && '✓'}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Menu>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{c.totalPatients.toLocaleString()}</td>
                <td className="px-4 py-3 font-semibold text-gray-900">
                  {c.monthlyRevenue > 0 ? `£${c.monthlyRevenue.toLocaleString()}` : '—'}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusBadge[c.reviewStatus] ?? 'gray'} dot className="capitalize">
                    {c.reviewStatus}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{c.joinedAgo}</td>
                <td className="px-4 py-3">
                  <Menu as="div" className="relative">
                    <Menu.Button className="p-1.5 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <EllipsisVerticalIcon className="w-4 h-4 text-gray-500" />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 z-10 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden text-xs">
                      <Menu.Item>
                        {({ active }) => (
                          <Link to={`/platform/clinics/${c.id}`} className={`flex items-center gap-2 px-3 py-2.5 ${active ? 'bg-gray-50' : ''} text-gray-700`}>
                            View Details
                          </Link>
                        )}
                      </Menu.Item>
                      {c.reviewStatus === 'pending' && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link to="/platform/approvals" className={`flex items-center gap-2 px-3 py-2.5 ${active ? 'bg-indigo-50' : ''} text-indigo-600 font-medium`}>
                              Review Application
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                      {c.reviewStatus === 'approved' && (
                        <Menu.Item>
                          {({ active }) => (
                            <button onClick={() => handleSuspend(c)} className={`w-full text-left flex items-center gap-2 px-3 py-2.5 ${active ? 'bg-red-50' : ''} text-red-600`}>
                              Suspend Clinic
                            </button>
                          )}
                        </Menu.Item>
                      )}
                    </Menu.Items>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
