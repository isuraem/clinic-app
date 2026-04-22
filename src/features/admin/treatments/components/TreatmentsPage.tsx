import { useEffect, useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchTreatments, selectTreatment, toggleTreatmentActive, deleteTreatment } from '../treatmentsSlice'
import type { Treatment } from '@/types'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Toggle from '@/components/ui/Toggle'
import TreatmentModal from './TreatmentModal'

const CONCERNS = ['All', 'anti-aging', 'acne', 'hydration', 'hair removal', 'pigmentation', 'wrinkles']

export default function TreatmentsPage() {
  const dispatch = useAppDispatch()
  const { items, loading, selected } = useAppSelector((s) => s.treatments)
  const [search, setSearch] = useState('')
  const [concern, setConcern] = useState('All')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => { dispatch(fetchTreatments()) }, [dispatch])

  const filtered = items.filter((t) => {
    const matchSearch  = t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase())
    const matchConcern = concern === 'All' || t.concern.includes(concern)
    return matchSearch && matchConcern
  })

  const openCreate = () => { dispatch(selectTreatment(null)); setShowModal(true) }
  const openEdit   = (t: Treatment) => { dispatch(selectTreatment(t)); setShowModal(true) }

  const pricingBadge = (t: Treatment) => {
    if (t.pricingType === 'bundle')    return <Badge variant="blue">Bundle</Badge>
    if (t.pricingType === 'variation') return <Badge variant="purple">Variations</Badge>
    return <Badge variant="gray">Individual</Badge>
  }

  const priceLabel = (t: Treatment) => {
    if (t.pricingType === 'individual') return `£${t.basePrice}`
    if (t.pricingType === 'variation')  return `from £${Math.min(...(t.variations ?? []).map((v) => v.price))}`
    if (t.pricingType === 'bundle')     return `from £${Math.min(...(t.bundles ?? []).map((b) => b.price))}`
    return '—'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Treatments</h1>
          <p className="text-gray-500 text-sm mt-0.5">{items.length} treatments in your catalogue</p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon className="w-4 h-4" />
          Add Treatment
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search treatments..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CONCERNS.map((c) => (
            <button
              key={c}
              onClick={() => setConcern(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${concern === c ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Treatment cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <Card key={t.id} padding="none" hover>
              <div className="relative">
                {t.coverImageUrl && (
                  <img src={t.coverImageUrl} alt={t.name} className="w-full h-40 object-cover rounded-t-2xl" />
                )}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {pricingBadge(t)}
                  {t.isMemberOnly && <Badge variant="gold">Members Only</Badge>}
                </div>
                <div className="absolute top-3 right-3">
                  <Toggle checked={t.isActive} onChange={() => dispatch(toggleTreatmentActive(t.id))} />
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{t.name}</h3>
                    <p className="text-xs text-gray-500">{t.category} · {t.durationMinutes}min</p>
                  </div>
                  <p className="text-sm font-bold text-brand-700 whitespace-nowrap">{priceLabel(t)}</p>
                </div>

                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{t.description}</p>

                <div className="flex gap-1.5 mt-3 flex-wrap">
                  {t.concern.slice(0, 3).map((c) => (
                    <span key={c} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500 flex-1">
                    {t.expectationCards.length} care cards · {t.beforeAfterImages.length} photos
                  </span>
                  <button onClick={() => openEdit(t)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <PencilIcon className="w-4 h-4 text-gray-500" />
                  </button>
                  <button onClick={() => dispatch(deleteTreatment(t.id))} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                    <TrashIcon className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <TreatmentModal open={showModal} onClose={() => setShowModal(false)} treatment={selected} />
    </div>
  )
}
