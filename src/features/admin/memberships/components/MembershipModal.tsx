import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { saveMembershipTier } from '../membershipsSlice'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Props { open: boolean; onClose: () => void }

export default function MembershipModal({ open, onClose }: Props) {
  const dispatch = useAppDispatch()
  const selected = useAppSelector((s) => s.memberships.selected)
  const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm<any>({
    defaultValues: {
      rolloverMode: 'stack',
      rolloverCapSessions: 3,
      perks: [{ value: '' }],
      includedTreatments: [],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'perks' })

  useEffect(() => {
    if (selected) {
      reset({ ...selected, perks: selected.perks.map((p: string) => ({ value: p })) })
    } else {
      reset({ rolloverMode: 'stack', rolloverCapSessions: 3, perks: [{ value: '' }], includedTreatments: [], isActive: true })
    }
  }, [selected, reset])

  const onSubmit = async (data: any) => {
    await dispatch(saveMembershipTier({
      ...data,
      id: selected?.id,
      clinicId: 'clinic-demo',
      perks: data.perks.map((p: { value: string }) => p.value).filter(Boolean),
    }))
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={selected ? 'Edit Membership Tier' : 'New Membership Tier'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input label="Tier Name" placeholder="Dermis Elite" {...register('name', { required: 'Required' })} />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Monthly Price (£)" type="number" placeholder="99" {...register('monthlyPrice', { valueAsNumber: true })} />
          <Input label="Annual Price (£)" type="number" placeholder="999" {...register('annualPrice', { valueAsNumber: true })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Credit Rollover</label>
          <div className="flex gap-2">
            {(['stack', 'expire'] as const).map((mode) => (
              <label key={mode} className="flex-1">
                <input type="radio" value={mode} className="sr-only" {...register('rolloverMode')} />
                <div className={`border rounded-xl p-3 cursor-pointer text-center transition-all ${mode === 'stack' ? 'border-brand-400 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <p className="text-sm font-medium text-gray-900">{mode === 'stack' ? 'Stack Credits' : 'Expire Monthly'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{mode === 'stack' ? 'Unused sessions roll over' : 'Unused sessions expire'}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <Input label="Max Rollover Cap (sessions)" type="number" placeholder="6" {...register('rolloverCapSessions', { valueAsNumber: true })} hint="Leave blank for unlimited stacking" />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Member Perks</label>
            <Button type="button" variant="ghost" size="sm" onClick={() => append({ value: '' })}>
              <PlusIcon className="w-3.5 h-3.5" /> Add Perk
            </Button>
          </div>
          {fields.map((field, i) => (
            <div key={field.id} className="flex gap-2">
              <input placeholder="e.g. 20% off all treatments" className="flex-1 rounded-xl border border-gray-200 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400" {...register(`perks.${i}.value`)} />
              <button type="button" onClick={() => remove(i)} className="p-2 hover:bg-red-50 rounded-lg">
                <TrashIcon className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-600" {...register('isActive')} />
          <span className="text-sm text-gray-700 font-medium">Active (visible to patients)</span>
        </label>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>{selected ? 'Save Changes' : 'Create Tier'}</Button>
        </div>
      </form>
    </Modal>
  )
}
