import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { Clinic, ReviewStatus } from '@/types'

export interface PlatformClinic extends Clinic {
  ownerName: string
  totalPatients: number
  monthlyRevenue: number
  activeMembers: number
  totalTreatments: number
  joinedAgo: string
  plan: 'starter' | 'growth' | 'enterprise'
  reviewNotes?: string
}

interface PlatformState {
  clinics: PlatformClinic[]
  selected: PlatformClinic | null
  loading: boolean
  error: string | null
  filter: 'all' | 'pending' | 'approved' | 'rejected'
  search: string
  platformMetrics: {
    totalClinics: number
    pendingApprovals: number
    totalPatients: number
    totalMRR: number
    avgRating: number
  } | null
}

const mockClinics: PlatformClinic[] = [
  {
    id: 'clinic-demo', name: 'Dermis Aesthetic Clinic', businessEmail: 'admin@dermis.clinic',
    timezone: 'Europe/London', country: 'United Kingdom', city: 'London',
    phone: '+44 20 1234 5678', reviewStatus: 'approved',
    reviewSubmittedAt: '2024-01-01T09:00:00Z', approvedAt: '2024-01-02T14:00:00Z',
    stripeConnected: true, passFeesToPatient: false, bnplEnabled: true,
    createdAt: '2024-01-01T00:00:00Z',
    ownerName: 'Dr. Sarah Mitchell', totalPatients: 842, monthlyRevenue: 12480,
    activeMembers: 94, totalTreatments: 18, joinedAgo: '4 months ago', plan: 'enterprise',
  },
  {
    id: 'clinic-02', name: 'Lumière Beauty & Aesthetics', businessEmail: 'info@lumiere-aesthetics.com',
    timezone: 'Europe/London', country: 'United Kingdom', city: 'Manchester',
    phone: '+44 16 1234 5678', reviewStatus: 'approved',
    reviewSubmittedAt: '2024-02-10T10:00:00Z', approvedAt: '2024-02-11T11:00:00Z',
    stripeConnected: true, passFeesToPatient: false, bnplEnabled: false,
    createdAt: '2024-02-10T00:00:00Z',
    ownerName: 'Dr. Emma Rousseau', totalPatients: 421, monthlyRevenue: 7200,
    activeMembers: 38, totalTreatments: 12, joinedAgo: '2 months ago', plan: 'growth',
  },
  {
    id: 'clinic-03', name: 'Aurora Skin Clinic', businessEmail: 'hello@auroraskin.ie',
    timezone: 'Europe/Dublin', country: 'Ireland', city: 'Dublin',
    phone: '+353 1 234 5678', reviewStatus: 'pending',
    reviewSubmittedAt: '2024-04-21T08:30:00Z',
    stripeConnected: false, passFeesToPatient: false, bnplEnabled: false,
    createdAt: '2024-04-21T00:00:00Z',
    ownerName: 'Dr. Aoife Brennan', totalPatients: 0, monthlyRevenue: 0,
    activeMembers: 0, totalTreatments: 0, joinedAgo: '1 day ago', plan: 'starter',
  },
  {
    id: 'clinic-04', name: 'Glow Lab Dubai', businessEmail: 'contact@glowlab.ae',
    timezone: 'Asia/Dubai', country: 'UAE', city: 'Dubai',
    phone: '+971 4 234 5678', reviewStatus: 'pending',
    reviewSubmittedAt: '2024-04-20T14:00:00Z',
    stripeConnected: false, passFeesToPatient: true, bnplEnabled: true,
    createdAt: '2024-04-20T00:00:00Z',
    ownerName: 'Dr. Lina Al-Hassan', totalPatients: 0, monthlyRevenue: 0,
    activeMembers: 0, totalTreatments: 0, joinedAgo: '2 days ago', plan: 'growth',
  },
  {
    id: 'clinic-05', name: 'Velvet Skin Studio', businessEmail: 'studio@velvetskin.sg',
    timezone: 'Asia/Singapore', country: 'Singapore', city: 'Singapore',
    phone: '+65 6234 5678', reviewStatus: 'rejected',
    reviewSubmittedAt: '2024-03-15T10:00:00Z',
    reviewNotes: 'Unable to verify business registration. Please resubmit with valid UEN.',
    stripeConnected: false, passFeesToPatient: false, bnplEnabled: false,
    createdAt: '2024-03-15T00:00:00Z',
    ownerName: 'Ms. Priya Sharma', totalPatients: 0, monthlyRevenue: 0,
    activeMembers: 0, totalTreatments: 0, joinedAgo: '5 weeks ago', plan: 'starter',
  },
  {
    id: 'clinic-06', name: 'Pure Aesthetics Sydney', businessEmail: 'admin@pureaesthetics.com.au',
    timezone: 'Australia/Sydney', country: 'Australia', city: 'Sydney',
    phone: '+61 2 1234 5678', reviewStatus: 'approved',
    reviewSubmittedAt: '2024-03-20T09:00:00Z', approvedAt: '2024-03-21T10:00:00Z',
    stripeConnected: true, passFeesToPatient: false, bnplEnabled: true,
    createdAt: '2024-03-20T00:00:00Z',
    ownerName: 'Dr. Jessica Wong', totalPatients: 289, monthlyRevenue: 5100,
    activeMembers: 21, totalTreatments: 9, joinedAgo: '1 month ago', plan: 'growth',
  },
]

export const fetchPlatformClinics = createAsyncThunk('platform/fetch', async () => {
  await new Promise((r) => setTimeout(r, 600))
  return mockClinics
})

export const approveClinic = createAsyncThunk(
  'platform/approve',
  async (clinicId: string) => {
    await new Promise((r) => setTimeout(r, 700))
    return { clinicId, approvedAt: new Date().toISOString() }
  }
)

export const rejectClinic = createAsyncThunk(
  'platform/reject',
  async (payload: { clinicId: string; notes: string }) => {
    await new Promise((r) => setTimeout(r, 700))
    return payload
  }
)

export const suspendClinic = createAsyncThunk(
  'platform/suspend',
  async (clinicId: string) => {
    await new Promise((r) => setTimeout(r, 500))
    return clinicId
  }
)

export const updateClinicPlan = createAsyncThunk(
  'platform/updatePlan',
  async (payload: { clinicId: string; plan: PlatformClinic['plan'] }) => {
    await new Promise((r) => setTimeout(r, 400))
    return payload
  }
)

const platformSlice = createSlice({
  name: 'platform',
  initialState: {
    clinics: [],
    selected: null,
    loading: false,
    error: null,
    filter: 'all',
    search: '',
    platformMetrics: null,
  } as PlatformState,
  reducers: {
    selectClinic(state, action: PayloadAction<PlatformClinic | null>) {
      state.selected = action.payload
    },
    setFilter(state, action: PayloadAction<PlatformState['filter']>) {
      state.filter = action.payload
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatformClinics.pending,   (s) => { s.loading = true })
      .addCase(fetchPlatformClinics.fulfilled, (s, a) => {
        s.loading = false
        s.clinics = a.payload
        const approved = a.payload.filter((c) => c.reviewStatus === 'approved')
        s.platformMetrics = {
          totalClinics:      a.payload.length,
          pendingApprovals:  a.payload.filter((c) => c.reviewStatus === 'pending').length,
          totalPatients:     a.payload.reduce((n, c) => n + c.totalPatients, 0),
          totalMRR:          a.payload.reduce((n, c) => n + c.monthlyRevenue, 0),
          avgRating:         4.8,
        }
      })
      .addCase(fetchPlatformClinics.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? null })

      .addCase(approveClinic.fulfilled, (s, a) => {
        const c = s.clinics.find((x) => x.id === a.payload.clinicId)
        if (c) { c.reviewStatus = 'approved'; c.approvedAt = a.payload.approvedAt }
        if (s.selected?.id === a.payload.clinicId) {
          s.selected.reviewStatus = 'approved'
          s.selected.approvedAt   = a.payload.approvedAt
        }
        if (s.platformMetrics) {
          s.platformMetrics.pendingApprovals = Math.max(0, s.platformMetrics.pendingApprovals - 1)
          s.platformMetrics.totalClinics = s.clinics.length
        }
      })

      .addCase(rejectClinic.fulfilled, (s, a) => {
        const c = s.clinics.find((x) => x.id === a.payload.clinicId)
        if (c) { c.reviewStatus = 'rejected'; c.reviewNotes = a.payload.notes }
        if (s.selected?.id === a.payload.clinicId) {
          s.selected.reviewStatus = 'rejected'
          s.selected.reviewNotes  = a.payload.notes
        }
        if (s.platformMetrics) s.platformMetrics.pendingApprovals = Math.max(0, s.platformMetrics.pendingApprovals - 1)
      })

      .addCase(suspendClinic.fulfilled, (s, a) => {
        const c = s.clinics.find((x) => x.id === a.payload)
        if (c) c.reviewStatus = 'rejected'
      })

      .addCase(updateClinicPlan.fulfilled, (s, a) => {
        const c = s.clinics.find((x) => x.id === a.payload.clinicId)
        if (c) c.plan = a.payload.plan
        if (s.selected?.id === a.payload.clinicId) s.selected.plan = a.payload.plan
      })
  },
})

export const { selectClinic, setFilter, setSearch } = platformSlice.actions
export default platformSlice.reducer
