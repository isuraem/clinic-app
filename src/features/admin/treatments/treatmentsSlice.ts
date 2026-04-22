import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { Treatment, PricingType } from '@/types'

interface TreatmentsState {
  items: Treatment[]
  selected: Treatment | null
  loading: boolean
  error: string | null
  filterConcern: string
  filterActive: boolean | null
}

const mockTreatments: Treatment[] = [
  {
    id: 't1', clinicId: 'clinic-demo', name: 'HydraFacial',
    category: 'Facial', concern: ['hydration', 'anti-aging', 'acne'],
    description: 'A multi-step facial treatment that cleanses, extracts, and hydrates skin.',
    pricingType: 'individual', basePrice: 150, memberPrice: 120,
    durationMinutes: 60,
    coverImageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
    galleryImages: [],
    beforeAfterImages: [],
    expectationCards: [
      { id: 'e1', type: 'pre',  title: 'Before Your Treatment', body: 'Arrive with a clean face. Avoid retinol 48h prior.', iconEmoji: '✨' },
      { id: 'e2', type: 'post', title: 'After Care',            body: 'Avoid direct sun exposure for 24h. Use SPF 50+.',   iconEmoji: '🌿' },
    ],
    schedulingLink: 'https://wa.me/447911123456?text=I%20want%20to%20book%20HydraFacial',
    isActive: true, isMemberOnly: false,
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 't2', clinicId: 'clinic-demo', name: 'Botox',
    category: 'Injectables', concern: ['anti-aging', 'wrinkles'],
    description: 'Botulinum toxin injections to relax facial muscles and reduce lines.',
    pricingType: 'variation',
    variations: [
      { id: 'v1', label: 'Forehead Only',   price: 180, memberPrice: 145 },
      { id: 'v2', label: 'Frown Lines',     price: 180, memberPrice: 145 },
      { id: 'v3', label: '3 Area Full',     price: 290, memberPrice: 240 },
    ],
    durationMinutes: 30,
    coverImageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600',
    galleryImages: [], beforeAfterImages: [],
    expectationCards: [
      { id: 'e3', type: 'pre',  title: 'Preparation',  body: 'Avoid alcohol 24h before. Do not take blood thinners.', iconEmoji: '💉' },
      { id: 'e4', type: 'post', title: 'Recovery Tips', body: 'No strenuous exercise for 24h. Avoid rubbing the area.', iconEmoji: '🧊' },
    ],
    schedulingLink: 'https://calendly.com/dermis/botox',
    isActive: true, isMemberOnly: false,
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 't3', clinicId: 'clinic-demo', name: 'Laser Hair Removal',
    category: 'Laser', concern: ['hair removal'],
    description: 'Permanent hair reduction using advanced diode laser technology.',
    pricingType: 'bundle',
    bundles: [
      { id: 'b1', sessions: 3,  price: 300, memberPrice: 240, label: 'Starter Pack' },
      { id: 'b2', sessions: 6,  price: 540, memberPrice: 430, label: 'Popular' },
      { id: 'b3', sessions: 12, price: 960, memberPrice: 768, label: 'Full Course' },
    ],
    durationMinutes: 45,
    coverImageUrl: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600',
    galleryImages: [], beforeAfterImages: [],
    expectationCards: [
      { id: 'e5', type: 'pre',  title: 'Before Laser',  body: 'Shave the area 24h before. Avoid sun exposure for 2 weeks.', iconEmoji: '🔆' },
      { id: 'e6', type: 'post', title: 'Aftercare',     body: 'Apply cooling gel. Wear SPF daily. Avoid hot showers for 48h.', iconEmoji: '❄️' },
    ],
    isActive: true, isMemberOnly: false,
    createdAt: '2024-01-05T00:00:00Z',
  },
  {
    id: 't4', clinicId: 'clinic-demo', name: 'Members Skin Reset',
    category: 'Facial', concern: ['anti-aging', 'hydration'],
    description: 'Exclusive monthly skin reset treatment for members only.',
    pricingType: 'individual', basePrice: 0, memberPrice: 0,
    durationMinutes: 75,
    coverImageUrl: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=600',
    galleryImages: [], beforeAfterImages: [],
    expectationCards: [],
    isActive: true, isMemberOnly: true,
    createdAt: '2024-02-01T00:00:00Z',
  },
]

export const fetchTreatments = createAsyncThunk('treatments/fetch', async () => {
  await new Promise((r) => setTimeout(r, 500))
  return mockTreatments
})

export const saveTreatment = createAsyncThunk(
  'treatments/save',
  async (treatment: Partial<Treatment> & { id?: string }) => {
    await new Promise((r) => setTimeout(r, 600))
    return { ...treatment, id: treatment.id ?? crypto.randomUUID(), createdAt: new Date().toISOString() } as Treatment
  }
)

export const deleteTreatment = createAsyncThunk('treatments/delete', async (id: string) => {
  await new Promise((r) => setTimeout(r, 300))
  return id
})

const treatmentsSlice = createSlice({
  name: 'treatments',
  initialState: {
    items: [],
    selected: null,
    loading: false,
    error: null,
    filterConcern: '',
    filterActive: null,
  } as TreatmentsState,
  reducers: {
    selectTreatment(state, action: PayloadAction<Treatment | null>) {
      state.selected = action.payload
    },
    setFilterConcern(state, action: PayloadAction<string>) {
      state.filterConcern = action.payload
    },
    setFilterActive(state, action: PayloadAction<boolean | null>) {
      state.filterActive = action.payload
    },
    toggleTreatmentActive(state, action: PayloadAction<string>) {
      const t = state.items.find((i) => i.id === action.payload)
      if (t) t.isActive = !t.isActive
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTreatments.pending,   (s) => { s.loading = true })
      .addCase(fetchTreatments.fulfilled, (s, a) => { s.loading = false; s.items = a.payload })
      .addCase(fetchTreatments.rejected,  (s, a) => { s.loading = false; s.error = a.error.message ?? null })

      .addCase(saveTreatment.fulfilled, (s, a) => {
        const idx = s.items.findIndex((i) => i.id === a.payload.id)
        if (idx >= 0) s.items[idx] = a.payload
        else s.items.unshift(a.payload)
        s.selected = null
      })

      .addCase(deleteTreatment.fulfilled, (s, a) => {
        s.items = s.items.filter((i) => i.id !== a.payload)
      })
  },
})

export const { selectTreatment, setFilterConcern, setFilterActive, toggleTreatmentActive } = treatmentsSlice.actions
export default treatmentsSlice.reducer
