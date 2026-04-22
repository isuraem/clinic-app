import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { DailyMetric, StaffMember } from '@/types'
import { subDays, format } from 'date-fns'

interface DashboardState {
  metrics: DailyMetric[]
  todayMetrics: DailyMetric | null
  staff: StaffMember[]
  googleRating: number
  totalReviews: number
  activeVisitors: number
  loading: boolean
  error: string | null
  scannerActive: boolean
  lastScannedPatient: { id: string; name: string; points: number } | null
}

const generateMetrics = (): DailyMetric[] =>
  Array.from({ length: 30 }, (_, i) => ({
    date:          format(subDays(new Date(), 29 - i), 'yyyy-MM-dd'),
    revenue:       Math.floor(Math.random() * 8000 + 2000),
    newPatients:   Math.floor(Math.random() * 15 + 3),
    checkIns:      Math.floor(Math.random() * 40 + 10),
    referrals:     Math.floor(Math.random() * 8 + 1),
    googleReviews: Math.floor(Math.random() * 3),
  }))

const mockStaff: StaffMember[] = [
  { id: 's1', clinicId: 'clinic-demo', name: 'Emma Clarke',   avatarUrl: 'https://api.dicebear.com/8.x/avataaars/svg?seed=emma',   role: 'Senior Aesthetician', membershipsSold: 24, treatmentsRedeemed: 187, totalRevenue: 48200, pointsThisPeriod: 2840 },
  { id: 's2', clinicId: 'clinic-demo', name: 'James Patel',   avatarUrl: 'https://api.dicebear.com/8.x/avataaars/svg?seed=james',   role: 'Dermal Therapist',   membershipsSold: 18, treatmentsRedeemed: 142, totalRevenue: 36100, pointsThisPeriod: 2100 },
  { id: 's3', clinicId: 'clinic-demo', name: 'Sophie Nguyen', avatarUrl: 'https://api.dicebear.com/8.x/avataaars/svg?seed=sophie', role: 'Aesthetician',       membershipsSold: 12, treatmentsRedeemed: 98,  totalRevenue: 22400, pointsThisPeriod: 1560 },
  { id: 's4', clinicId: 'clinic-demo', name: 'Liam O\'Brien', avatarUrl: 'https://api.dicebear.com/8.x/avataaars/svg?seed=liam',   role: 'Nurse Prescriber',  membershipsSold: 9,  treatmentsRedeemed: 76,  totalRevenue: 19800, pointsThisPeriod: 1120 },
]

export const fetchDashboard = createAsyncThunk('dashboard/fetch', async () => {
  await new Promise((r) => setTimeout(r, 600))
  const metrics = generateMetrics()
  return { metrics, staff: mockStaff, googleRating: 4.8, totalReviews: 312, activeVisitors: 7 }
})

export const processQRScan = createAsyncThunk(
  'dashboard/processQRScan',
  async (qrCode: string) => {
    await new Promise((r) => setTimeout(r, 400))
    return { id: 'pat-' + qrCode.slice(0, 6), name: 'Sarah Johnson', points: 60 }
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    metrics: [],
    todayMetrics: null,
    staff: [],
    googleRating: 0,
    totalReviews: 0,
    activeVisitors: 0,
    loading: false,
    error: null,
    scannerActive: false,
    lastScannedPatient: null,
  } as DashboardState,
  reducers: {
    toggleScanner(state) { state.scannerActive = !state.scannerActive },
    clearScan(state)     { state.lastScannedPatient = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending,  (s) => { s.loading = true })
      .addCase(fetchDashboard.fulfilled, (s, a) => {
        s.loading       = false
        s.metrics       = a.payload.metrics
        s.todayMetrics  = a.payload.metrics[a.payload.metrics.length - 1]
        s.staff         = a.payload.staff
        s.googleRating  = a.payload.googleRating
        s.totalReviews  = a.payload.totalReviews
        s.activeVisitors = a.payload.activeVisitors
      })
      .addCase(fetchDashboard.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? null })

      .addCase(processQRScan.fulfilled, (s, a) => {
        s.lastScannedPatient = a.payload
        s.scannerActive      = false
        if (s.todayMetrics) s.todayMetrics.checkIns += 1
      })
  },
})

export const { toggleScanner, clearScan } = dashboardSlice.actions
export default dashboardSlice.reducer
