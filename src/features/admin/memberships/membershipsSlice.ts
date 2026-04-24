import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { MembershipTier, MembershipSubscription } from '@/types'

interface MembershipsState {
  tiers: MembershipTier[]
  subscriptions: MembershipSubscription[]
  selected: MembershipTier | null
  loading: boolean
  error: string | null
}

const mockTiers: MembershipTier[] = [
  {
    id: 'm1', clinicId: 'clinic-demo', name: 'Glow Starter',
    monthlyPrice: 49, annualPrice: 499,
    includedProducts: [{ productId:'t1', sessionsPerMonth: 1 }],
    rolloverMode: 'stack', rolloverCapSessions: 3,
    perks: ['10% off all treatments', '1x HydraFacial/month', 'Priority booking', 'Exclusive member offers'],
    isActive: true, createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'm2', clinicId: 'clinic-demo', name: 'Dermis Elite',
    monthlyPrice: 99, annualPrice: 999,
    includedProducts: [
      { productId: 'p1', sessionsPerMonth: 1 },
      { productId: 'p5', sessionsPerMonth: 1 },
    ],
    rolloverMode: 'stack', rolloverCapSessions: 6,
    perks: ['20% off all treatments', '1x HydraFacial + 1x Skin Reset/month', 'Free annual skin analysis', 'VIP booking window', 'Exclusive birthday reward'],
    isActive: true, createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'm3', clinicId: 'clinic-demo', name: 'Laser Unlimited',
    monthlyPrice: 199, annualPrice: 1999,
    includedProducts: [{ productId:'t3', sessionsPerMonth: 2 }],
    rolloverMode: 'expire',
    perks: ['Unlimited laser sessions (2/month)', '25% off other treatments', 'Free consultations', 'Dedicated therapist'],
    isActive: true, createdAt: '2024-01-01T00:00:00Z',
  },
]

const mockSubs: MembershipSubscription[] = [
  { id: 'sub1', patientId: 'pat-demo', tierId: 'm2', clinicId: 'clinic-demo', status: 'active', startDate: '2024-01-15', nextBillingDate: '2024-05-15', creditsRemaining: 1, creditsRolledOver: 2, totalSaved: 420, stripeSubscriptionId: 'sub_mock_001' },
]

export const fetchMembershipTiers = createAsyncThunk('memberships/fetchTiers', async () => {
  await new Promise((r) => setTimeout(r, 400))
  return { tiers: mockTiers, subscriptions: mockSubs }
})

export const saveMembershipTier = createAsyncThunk(
  'memberships/saveTier',
  async (tier: Partial<MembershipTier>) => {
    await new Promise((r) => setTimeout(r, 700))
    return { ...tier, id: tier.id ?? crypto.randomUUID(), createdAt: new Date().toISOString() } as MembershipTier
  }
)

export const deleteMembershipTier = createAsyncThunk('memberships/deleteTier', async (id: string) => {
  await new Promise((r) => setTimeout(r, 300))
  return id
})

const membershipsSlice = createSlice({
  name: 'memberships',
  initialState: { tiers: [], subscriptions: [], selected: null, loading: false, error: null } as MembershipsState,
  reducers: {
    selectTier(state, action: PayloadAction<MembershipTier | null>) {
      state.selected = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembershipTiers.pending,   (s) => { s.loading = true })
      .addCase(fetchMembershipTiers.fulfilled, (s, a) => {
        s.loading       = false
        s.tiers         = a.payload.tiers
        s.subscriptions = a.payload.subscriptions
      })
      .addCase(saveMembershipTier.fulfilled, (s, a) => {
        const idx = s.tiers.findIndex((t) => t.id === a.payload.id)
        if (idx >= 0) s.tiers[idx] = a.payload
        else s.tiers.push(a.payload)
        s.selected = null
      })
      .addCase(deleteMembershipTier.fulfilled, (s, a) => {
        s.tiers = s.tiers.filter((t) => t.id !== a.payload)
      })
  },
})

export const { selectTier } = membershipsSlice.actions
export default membershipsSlice.reducer
