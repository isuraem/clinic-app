import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { MicrophoneIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { saveOffer } from '../offersSlice'
import type { TriggerType, OfferType } from '@/types'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Props { open: boolean; onClose: () => void }

export default function OfferModal({ open, onClose }: Props) {
  const dispatch = useAppDispatch()
  const selected = useAppSelector((s) => s.offers.selected)
  const fileRef  = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, watch, reset, formState: { isSubmitting } } = useForm<any>({
    defaultValues: { triggerType: 'birthday', offerType: 'scratch_card', isActive: true },
  })

  const offerType: OfferType   = watch('offerType')
  const triggerType: TriggerType = watch('triggerType')

  useEffect(() => {
    if (selected) reset(selected)
    else reset({ triggerType: 'birthday', offerType: 'scratch_card', isActive: true })
  }, [selected, reset])

  const onSubmit = async (data: any) => {
    await dispatch(saveOffer({ ...data, id: selected?.id, clinicId: 'clinic-demo' }))
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={selected ? 'Edit Offer' : 'Create Offer'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input label="Offer Title" placeholder="Happy Birthday Gorgeous!" {...register('title', { required: 'Required' })} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea rows={2} className="w-full rounded-xl border border-gray-200 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" placeholder="A personalised treat just for you..." {...register('description')} />
        </div>

        {/* Trigger */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Trigger</label>
          <div className="grid grid-cols-4 gap-2">
            {([
              { value: 'birthday',    icon: '🎂', label: 'Birthday'    },
              { value: 'anniversary', icon: '💍', label: 'Anniversary' },
              { value: 'holiday',     icon: '🎉', label: 'Holiday'     },
              { value: 'manual',      icon: '📢', label: 'Manual'      },
            ] as { value: TriggerType; icon: string; label: string }[]).map(({ value, icon, label }) => (
              <label key={value} className="cursor-pointer">
                <input type="radio" value={value} className="sr-only" {...register('triggerType')} />
                <div className={`border rounded-xl p-2 text-center transition-all ${triggerType === value ? 'bg-brand-50 border-brand-400' : 'border-gray-200 hover:border-gray-300'}`}>
                  <p className="text-lg">{icon}</p>
                  <p className="text-xs font-medium text-gray-700 mt-0.5">{label}</p>
                </div>
              </label>
            ))}
          </div>
          {triggerType === 'holiday' && (
            <Input label="Holiday Date" type="date" className="mt-3" {...register('holidayDate')} />
          )}
        </div>

        {/* Offer type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Offer Type</label>
          <div className="grid grid-cols-2 gap-2">
            {([
              { value: 'scratch_card',   icon: '🎰', label: 'Scratch Card'    },
              { value: 'discount',       icon: '💸', label: 'Discount'        },
              { value: 'points_bonus',   icon: '⭐', label: 'Points Bonus'    },
              { value: 'free_treatment', icon: '🎁', label: 'Free Treatment'  },
            ] as { value: OfferType; icon: string; label: string }[]).map(({ value, icon, label }) => (
              <label key={value} className="cursor-pointer">
                <input type="radio" value={value} className="sr-only" {...register('offerType')} />
                <div className={`border rounded-xl p-3 flex items-center gap-2 transition-all ${offerType === value ? 'bg-brand-50 border-brand-400' : 'border-gray-200 hover:border-gray-300'}`}>
                  <span>{icon}</span>
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Conditional fields */}
        {offerType === 'discount' && (
          <div className="grid grid-cols-2 gap-4">
            <Input label="Discount %" type="number" placeholder="15" {...register('discountPercent', { valueAsNumber: true })} />
            <Input label="Or Fixed Amount (£)" type="number" placeholder="20" {...register('discountFixed', { valueAsNumber: true })} />
          </div>
        )}
        {offerType === 'scratch_card' && (
          <Input label="Reveal Text" placeholder="25% OFF any treatment this month" {...register('scratchRevealValue')} />
        )}
        {offerType === 'points_bonus' && (
          <Input label="Bonus Points" type="number" placeholder="250" {...register('pointsBonus', { valueAsNumber: true })} />
        )}

        {/* Voice message — birthday only */}
        {triggerType === 'birthday' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MicrophoneIcon className="w-4 h-4 inline-block mr-1" />
              Personalised Birthday Voice Note
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-brand-200 rounded-xl p-5 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50 transition-all"
            >
              <CloudArrowUpIcon className="w-8 h-8 text-brand-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-brand-600">Upload voice message</p>
              <p className="text-xs text-gray-400 mt-0.5">MP3, WAV · Max 30s · Sent automatically on patient birthdays</p>
              <input ref={fileRef} type="file" accept="audio/*" className="hidden" />
            </div>
          </div>
        )}

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-600" {...register('isActive')} />
          <span className="text-sm text-gray-700 font-medium">Active (auto-send when triggered)</span>
        </label>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>{selected ? 'Save Changes' : 'Create Offer'}</Button>
        </div>
      </form>
    </Modal>
  )
}
