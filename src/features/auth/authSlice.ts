import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { User, Clinic, ReviewStatus } from '@/types'

interface AuthState {
  user: User | null
  clinic: Clinic | null
  token: string | null
  signupStep: 1 | 2
  loading: boolean
  error: string | null
  viewMode: 'admin' | 'platform'
}

const initialState: AuthState = {
  user: null,
  clinic: null,
  token: null,
  signupStep: 1,
  loading: false,
  error: null,
  viewMode: 'admin',
}

// ─── Mock async thunks ────────────────────────────────────────────────────────

export const signupStep1 = createAsyncThunk(
  'auth/signupStep1',
  async (payload: { email: string; password: string; name: string }, { rejectWithValue }) => {
    await new Promise((r) => setTimeout(r, 800))
    if (!payload.email.includes('@')) return rejectWithValue('Invalid business email')
    return { email: payload.email, name: payload.name }
  }
)

export const signupStep2 = createAsyncThunk(
  'auth/signupStep2',
  async (payload: {
    clinicName: string
    phone: string
    timezone: string
    country: string
    city: string
  }) => {
    await new Promise((r) => setTimeout(r, 1000))
    const clinic: Clinic = {
      id: crypto.randomUUID(),
      name: payload.clinicName,
      businessEmail: 'clinic@example.com',
      timezone: payload.timezone,
      country: payload.country,
      city: payload.city,
      phone: payload.phone,
      reviewStatus: 'pending',
      reviewSubmittedAt: new Date().toISOString(),
      stripeConnected: false,
      passFeesToPatient: false,
      bnplEnabled: false,
      createdAt: new Date().toISOString(),
    }
    const user: User = {
      id: crypto.randomUUID(),
      email: 'clinic@example.com',
      name: 'Clinic Admin',
      role: 'clinic_admin',
      clinicId: clinic.id,
      createdAt: new Date().toISOString(),
    }
    return { clinic, user, token: 'mock-jwt-token' }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string; role?: 'admin' | 'platform' }) => {
    await new Promise((r) => setTimeout(r, 700))
    const isPlatform = payload.role === 'platform'
    const user: User = {
      id: 'usr-demo',
      email: payload.email,
      name: isPlatform ? 'Platform Admin' : 'Clinic Admin',
      role: isPlatform ? 'super_admin' : 'clinic_admin',
      clinicId: isPlatform ? undefined : 'clinic-demo',
      avatarUrl: `https://api.dicebear.com/8.x/avataaars/svg?seed=${payload.email}`,
      createdAt: '2024-01-01T00:00:00Z',
    }
    const clinic: Clinic = {
      id: 'clinic-demo',
      name: 'Dermis Aesthetic Clinic',
      businessEmail: 'admin@dermis.clinic',
      timezone: 'Europe/London',
      country: 'United Kingdom',
      city: 'London',
      phone: '+44 20 1234 5678',
      reviewStatus: 'approved',
      reviewSubmittedAt: '2024-01-01T00:00:00Z',
      approvedAt: '2024-01-02T00:00:00Z',
      stripeConnected: true,
      passFeesToPatient: false,
      bnplEnabled: true,
      createdAt: '2024-01-01T00:00:00Z',
    }
    return { user, clinic, token: 'mock-jwt-demo' }
  }
)

export const approveClinic = createAsyncThunk(
  'auth/approveClinic',
  async (clinicId: string) => {
    await new Promise((r) => setTimeout(r, 500))
    return clinicId
  }
)

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user   = null
      state.clinic = null
      state.token  = null
      state.signupStep = 1
    },
    setSignupStep(state, action: PayloadAction<1 | 2>) {
      state.signupStep = action.payload
    },
    setViewMode(state, action: PayloadAction<'admin' | 'platform'>) {
      state.viewMode = action.payload
    },
    updateClinicSettings(state, action: PayloadAction<Partial<Clinic>>) {
      if (state.clinic) Object.assign(state.clinic, action.payload)
    },
    updateReviewStatus(state, action: PayloadAction<ReviewStatus>) {
      if (state.clinic) state.clinic.reviewStatus = action.payload
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupStep1.pending,  (s) => { s.loading = true; s.error = null })
      .addCase(signupStep1.fulfilled, (s) => { s.loading = false; s.signupStep = 2 })
      .addCase(signupStep1.rejected,  (s, a) => { s.loading = false; s.error = a.payload as string })

      .addCase(signupStep2.pending,  (s) => { s.loading = true })
      .addCase(signupStep2.fulfilled, (s, a) => {
        s.loading = false
        s.clinic  = a.payload.clinic
        s.user    = a.payload.user
        s.token   = a.payload.token
      })
      .addCase(signupStep2.rejected, (s) => { s.loading = false })

      .addCase(login.pending,  (s) => { s.loading = true; s.error = null })
      .addCase(login.fulfilled, (s, a) => {
        s.loading    = false
        s.user       = a.payload.user
        s.clinic     = a.payload.clinic
        s.token      = a.payload.token
        s.viewMode   = a.payload.user.role === 'super_admin' ? 'platform' : 'admin'
      })
      .addCase(login.rejected, (s) => { s.loading = false; s.error = 'Invalid credentials' })

      .addCase(approveClinic.fulfilled, (s) => {
        if (s.clinic) {
          s.clinic.reviewStatus = 'approved'
          s.clinic.approvedAt   = new Date().toISOString()
        }
      })
  },
})

export const { logout, setSignupStep, setViewMode, updateClinicSettings, updateReviewStatus, clearError } = authSlice.actions
export default authSlice.reducer
