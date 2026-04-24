import { useEffect, useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchProducts, selectProduct, toggleProductActive, deleteProduct } from '../productsSlice'
import type { Product, ProductType } from '@/types'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Toggle from '@/components/ui/Toggle'
import ProductModal from './ProductModal'

const PRODUCT_TYPE_FILTERS: { value: ProductType | 'All'; label: string }[] = [
  { value: 'All',       label: 'All'       },
  { value: 'treatment', label: 'Treatment' },
  { value: 'session',   label: 'Session'   },
  { value: 'area',      label: 'Area'      },
  { value: 'syringe',   label: 'Syringe'   },
  { value: 'vial',      label: 'Vial'      },
  { value: 'unit',      label: 'Unit'      },
  { value: 'package',   label: 'Package'   },
]

const TYPE_BADGE_VARIANT: Record<ProductType, 'blue' | 'purple' | 'green' | 'gold' | 'gray'> = {
  treatment: 'blue',
  session:   'green',
  area:      'purple',
  syringe:   'purple',
  vial:      'gold',
  unit:      'gray',
  package:   'blue',
}

export default function ProductsPage() {
  const dispatch = useAppDispatch()
  const { items, loading, selected } = useAppSelector((s) => s.products)
  const [search, setSearch]     = useState('')
  const [typeFilter, setType]   = useState<ProductType | 'All'>('All')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => { dispatch(fetchProducts()) }, [dispatch])

  const filtered = items.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
    const matchType   = typeFilter === 'All' || p.productType === typeFilter
    return matchSearch && matchType
  })

  const openCreate = () => { dispatch(selectProduct(null)); setShowModal(true) }
  const openEdit   = (p: Product) => { dispatch(selectProduct(p)); setShowModal(true) }

  const pricingBadge = (p: Product) => {
    if (p.pricingType === 'bundle')    return <Badge variant="blue">Bundle</Badge>
    if (p.pricingType === 'variation') return <Badge variant="purple">Variations</Badge>
    return <Badge variant="gray">Individual</Badge>
  }

  const priceLabel = (p: Product) => {
    if (p.pricingType === 'individual') return `£${p.basePrice}`
    if (p.pricingType === 'variation')  return `from £${Math.min(...(p.variations ?? []).map((v) => v.price))}`
    if (p.pricingType === 'bundle')     return `from £${Math.min(...(p.bundles ?? []).map((b) => b.price))}`
    return '—'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">{items.length} products in your catalogue</p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {PRODUCT_TYPE_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setType(value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${typeFilter === value ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Product cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Card key={p.id} padding="none" hover>
              <div className="relative">
                {p.coverImageUrl && (
                  <img src={p.coverImageUrl} alt={p.name} className="w-full h-40 object-cover rounded-t-2xl" />
                )}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <Badge variant={TYPE_BADGE_VARIANT[p.productType]}>{p.productType}</Badge>
                  {pricingBadge(p)}
                  {p.isMemberOnly && <Badge variant="gold">Members Only</Badge>}
                </div>
                <div className="absolute top-3 right-3">
                  <Toggle checked={p.isActive} onChange={() => dispatch(toggleProductActive(p.id))} />
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{p.name}</h3>
                    <p className="text-xs text-gray-500">{p.category} · {p.durationMinutes}min</p>
                  </div>
                  <p className="text-sm font-bold text-brand-700 whitespace-nowrap">{priceLabel(p)}</p>
                </div>

                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{p.description}</p>

                <div className="flex gap-1.5 mt-3 flex-wrap">
                  {p.concern.slice(0, 3).map((c) => (
                    <span key={c} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500 flex-1">
                    {p.expectationCards.length} care cards · {p.beforeAfterImages.length} photos
                  </span>
                  <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <PencilIcon className="w-4 h-4 text-gray-500" />
                  </button>
                  <button onClick={() => dispatch(deleteProduct(p.id))} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                    <TrashIcon className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ProductModal open={showModal} onClose={() => setShowModal(false)} product={selected} />
    </div>
  )
}
