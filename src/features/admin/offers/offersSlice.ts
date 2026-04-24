import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { Offer, TriggerType, OfferType } from '@/types'

interface OffersState {
  items: Offer[]
  selected: Offer | null
  loading: boolean
  error: string | null
  scratchReveal: { offerId: string; revealed: boolean } | null
}

const mockOffers: Offer[] = [
  {
    id: 'o1', clinicId: 'clinic-demo', title: 'Happy Birthday Gorgeous!',
    description: 'A personalised birthday treat from us to you.',
    offerType: 'scratch_card', triggerType: 'birthday',
    scratchRevealValue: '25% OFF any treatment this month',
    voiceMessageUrl: '/mock-audio/birthday-voice.mp3',
    isActive: true, sentCount: 124, redemptionCount: 89,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'o2', clinicId: 'clinic-demo', title: 'Cheers to Another Year Together!',
    description: 'Celebrating your anniversary with us.',
    offerType: 'discount', triggerType: 'anniversary',
    discountPercent: 15,
    isActive: true, sentCount: 67, redemptionCount: 45,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'o3', clinicId: 'clinic-demo', title: "Valentine's Day Special",
    description: 'Treat yourself or a loved one this Valentine\'s.',
    offerType: 'points_bonus', triggerType: 'holiday',
    holidayDate: '2025-02-14',
    pointsBonus: 250,
    isActive: true, sentCount: 340, redemptionCount: 198,
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'o4', clinicId: 'clinic-demo', title: 'Summer Glow Campaign',
    description: 'Kick off summer with a free skin consultation.',
    offerType: 'free_treatment', triggerType: 'manual',
    freeProductId: 'p5',
    isActive: false, sentCount: 0, redemptionCount: 0,
    createdAt: '2024-03-01T00:00:00Z',
  },
]

export const fetchOffers = createAsyncThunk('offers/fetch', async () => {
  await new Promise((r) => setTimeout(r, 400))
  return mockOffers
})

export const saveOffer = createAsyncThunk(
  'offers/save',
  async (offer: Partial<Offer>) => {
    await new Promise((r) => setTimeout(r, 600))
    return { ...offer, id: offer.id ?? crypto.randomUUID(), sentCount: 0, redemptionCount: 0, createdAt: new Date().toISOString() } as Offer
  }
)

export const sendOffer = createAsyncThunk(
  'offers/send',
  async (offerId: string) => {
    await new Promise((r) => setTimeout(r, 800))
    return offerId
  }
)

const offersSlice = createSlice({
  name: 'offers',
  initialState: { items: [], selected: null, loading: false, error: null, scratchReveal: null } as OffersState,
  reducers: {
    selectOffer(state, action: PayloadAction<Offer | null>) {
      state.selected = action.payload
    },
    setScratchReveal(state, action: PayloadAction<{ offerId: string; revealed: boolean } | null>) {
      state.scratchReveal = action.payload
    },
    toggleOfferActive(state, action: PayloadAction<string>) {
      const o = state.items.find((i) => i.id === action.payload)
      if (o) o.isActive = !o.isActive
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending,   (s) => { s.loading = true })
      .addCase(fetchOffers.fulfilled, (s, a) => { s.loading = false; s.items = a.payload })
      .addCase(fetchOffers.rejected,  (s, a) => { s.loading = false; s.error = a.error.message ?? null })
      .addCase(saveOffer.fulfilled, (s, a) => {
        const idx = s.items.findIndex((i) => i.id === a.payload.id)
        if (idx >= 0) s.items[idx] = a.payload
        else s.items.unshift(a.payload)
        s.selected = null
      })
      .addCase(sendOffer.fulfilled, (s, a) => {
        const o = s.items.find((i) => i.id === a.payload)
        if (o) o.sentCount += 1
      })
  },
})

export const { selectOffer, setScratchReveal, toggleOfferActive } = offersSlice.actions
export default offersSlice.reducer
