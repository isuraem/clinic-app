import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { PlusIcon, TrashIcon, LinkIcon } from '@heroicons/react/24/outline'
import { useAppDispatch } from '@/app/hooks'
import { saveProduct } from '../productsSlice'
import type { Product, PricingType, ProductType } from '@/types'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Props { open: boolean; onClose: () => void; product: Product | null }

const PRODUCT_TYPES: { value: ProductType; label: string }[] = [
  { value: 'treatment', label: 'Treatment' },
  { value: 'session',   label: 'Session'   },
  { value: 'area',      label: 'Area'      },
  { value: 'syringe',   label: 'Syringe'   },
  { value: 'vial',      label: 'Vial'      },
  { value: 'unit',      label: 'Unit'      },
  { value: 'package',   label: 'Package'   },
]

const CATEGORIES = ['Facial', 'Injectables', 'Laser', 'Body', 'Skin Health', 'IV Therapy']
const CONCERNS   = ['anti-aging', 'acne', 'hydration', 'hair removal', 'pigmentation', 'wrinkles', 'rosacea']

export default function ProductModal({ open, onClose, product }: Props) {
  const dispatch = useAppDispatch()
  const { register, control, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<any>({
    defaultValues: {
      productType: 'treatment',
      pricingType: 'individual',
      variations: [{ label: '', price: '', memberPrice: '' }],
      bundles: [{ sessions: 3, price: '', label: 'Starter Pack' }],
      expectationCards: [],
      concern: [],
    },
  })

  const pricingType: PricingType = watch('pricingType')
  const { fields: varFields,    append: appendVar,    remove: removeVar    } = useFieldArray({ control, name: 'variations' })
  const { fields: bundleFields, append: appendBundle, remove: removeBundle } = useFieldArray({ control, name: 'bundles' })
  const { fields: cardFields,   append: appendCard,   remove: removeCard   } = useFieldArray({ control, name: 'expectationCards' })

  useEffect(() => {
    if (product) {
      reset({
        ...product,
        variations:       product.variations       ?? [{ label: '', price: '', memberPrice: '' }],
        bundles:          product.bundles           ?? [{ sessions: 3, price: '', label: '' }],
        expectationCards: product.expectationCards  ?? [],
      })
    } else {
      reset({ productType: 'treatment', pricingType: 'individual', variations: [{ label: '', price: '' }], bundles: [{ sessions: 3, price: '', label: 'Starter Pack' }], expectationCards: [], concern: [] })
    }
  }, [product, reset])

  const onSubmit = async (data: any) => {
    await dispatch(saveProduct({ ...data, id: product?.id, clinicId: 'clinic-demo', galleryImages: [], beforeAfterImages: [] }))
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={product ? 'Edit Product' : 'New Product'} size="2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">

        {/* Product type + name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Type</label>
            <select className="w-full rounded-xl border border-gray-200 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400" {...register('productType', { required: true })}>
              {PRODUCT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <Input label="Product Name" placeholder="HydraFacial" error={errors.name?.message as string} {...register('name', { required: 'Required' })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select className="w-full rounded-xl border border-gray-200 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400" {...register('category')}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Duration (minutes)" type="number" placeholder="60" {...register('durationMinutes', { valueAsNumber: true })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea rows={2} className="w-full rounded-xl border border-gray-200 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" {...register('description')} />
        </div>

        <Input label="Cover Image URL" placeholder="https://..." {...register('coverImageUrl')} />

        {/* Concerns */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Concerns / Tags</label>
          <div className="flex flex-wrap gap-2">
            {CONCERNS.map((c) => {
              const concerns: string[] = watch('concern') ?? []
              const active = concerns.includes(c)
              return (
                <button
                  key={c} type="button"
                  onClick={() => {
                    const current = watch('concern') ?? []
                    const next = active ? current.filter((x: string) => x !== c) : [...current, c]
                    reset({ ...watch(), concern: next })
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${active ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </div>

        {/* Pricing type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Type</label>
          <div className="flex gap-2">
            {(['individual', 'bundle', 'variation'] as PricingType[]).map((pt) => (
              <label key={pt} className={`flex-1 text-center py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-all ${pricingType === pt ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                <input type="radio" value={pt} className="sr-only" {...register('pricingType')} />
                {pt.charAt(0).toUpperCase() + pt.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {pricingType === 'individual' && (
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (£)" type="number" placeholder="150" {...register('basePrice', { valueAsNumber: true })} />
            <Input label="Member Price (£)" type="number" placeholder="120" {...register('memberPrice', { valueAsNumber: true })} />
          </div>
        )}

        {pricingType === 'variation' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Price Variations</label>
              <Button type="button" variant="ghost" size="sm" onClick={() => appendVar({ label: '', price: '', memberPrice: '' })}>
                <PlusIcon className="w-3.5 h-3.5" /> Add Variation
              </Button>
            </div>
            {varFields.map((field, i) => (
              <div key={field.id} className="grid grid-cols-3 gap-2 items-end">
                <Input label={i === 0 ? 'Label' : ''} placeholder="Upper Face" {...register(`variations.${i}.label`)} />
                <Input label={i === 0 ? 'Price (£)' : ''} type="number" placeholder="180" {...register(`variations.${i}.price`, { valueAsNumber: true })} />
                <div className="flex gap-2">
                  <Input label={i === 0 ? 'Member £' : ''} type="number" placeholder="145" {...register(`variations.${i}.memberPrice`, { valueAsNumber: true })} />
                  <button type="button" onClick={() => removeVar(i)} className="mb-0.5 p-1.5 hover:bg-red-50 rounded-lg mt-auto">
                    <TrashIcon className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pricingType === 'bundle' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Bundle Tiers</label>
              <Button type="button" variant="ghost" size="sm" onClick={() => appendBundle({ sessions: 6, price: '', label: '' })}>
                <PlusIcon className="w-3.5 h-3.5" /> Add Tier
              </Button>
            </div>
            {bundleFields.map((field, i) => (
              <div key={field.id} className="grid grid-cols-4 gap-2 items-end">
                <Input label={i === 0 ? 'Sessions' : ''} type="number" placeholder="6" {...register(`bundles.${i}.sessions`, { valueAsNumber: true })} />
                <Input label={i === 0 ? 'Label' : ''} placeholder="Popular" {...register(`bundles.${i}.label`)} />
                <Input label={i === 0 ? 'Price (£)' : ''} type="number" placeholder="540" {...register(`bundles.${i}.price`, { valueAsNumber: true })} />
                <div className="flex gap-2">
                  <Input label={i === 0 ? 'Member £' : ''} type="number" placeholder="430" {...register(`bundles.${i}.memberPrice`, { valueAsNumber: true })} />
                  <button type="button" onClick={() => removeBundle(i)} className="p-1.5 hover:bg-red-50 rounded-lg mt-auto mb-0.5">
                    <TrashIcon className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Expectation cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Expectation Cards (pre/post care)</label>
            <Button type="button" variant="ghost" size="sm" onClick={() => appendCard({ type: 'pre', title: '', body: '', iconEmoji: '✨' })}>
              <PlusIcon className="w-3.5 h-3.5" /> Add Card
            </Button>
          </div>
          {cardFields.map((field, i) => (
            <div key={field.id} className="border border-gray-200 rounded-xl p-3 space-y-2">
              <div className="flex gap-2 items-center">
                <select className="rounded-lg border border-gray-200 text-xs px-2.5 py-1.5" {...register(`expectationCards.${i}.type`)}>
                  <option value="pre">Pre-Care</option>
                  <option value="post">Post-Care</option>
                </select>
                <input placeholder="Emoji" className="w-14 rounded-lg border border-gray-200 text-sm px-2 py-1.5 text-center" {...register(`expectationCards.${i}.iconEmoji`)} />
                <input placeholder="Card title" className="flex-1 rounded-lg border border-gray-200 text-sm px-2.5 py-1.5" {...register(`expectationCards.${i}.title`)} />
                <button type="button" onClick={() => removeCard(i)} className="p-1.5 hover:bg-red-50 rounded-lg flex-shrink-0">
                  <TrashIcon className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
              <textarea rows={2} placeholder="Card instructions..." className="w-full rounded-lg border border-gray-200 text-sm px-2.5 py-1.5 resize-none" {...register(`expectationCards.${i}.body`)} />
            </div>
          ))}
        </div>

        {/* Scheduling link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
            <LinkIcon className="w-4 h-4" /> Scheduling Link
          </label>
          <Input placeholder="https://calendly.com/... or https://wa.me/44..." {...register('schedulingLink')} hint="Supports Calendly, direct URLs, or WhatsApp click-to-chat (wa.me/...)" />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-600" {...register('isMemberOnly')} />
          <span className="text-sm text-gray-700 font-medium">Members-only product</span>
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>{product ? 'Save Changes' : 'Create Product'}</Button>
        </div>
      </form>
    </Modal>
  )
}
