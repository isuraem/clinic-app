import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface Transaction {
  id: string
  patientName: string
  amount: number
  fee: number
  net: number
  type: 'membership' | 'treatment' | 'bnpl'
  status: 'succeeded' | 'pending' | 'failed'
  createdAt: string
}

interface BillingState {
  stripeConnected: boolean
  stripeAccountId: string | null
  passFeesToPatient: boolean
  bnplEnabled: boolean
  platformFeePercent: number
  transactions: Transaction[]
  monthlyRevenue: number
  monthlyFees: number
  loading: boolean
  error: string | null
  connectUrl: string | null
}

const mockTransactions: Transaction[] = Array.from({ length: 12 }, (_, i) => ({
  id: `txn-${i}`,
  patientName: ['Sarah Johnson', 'Emily Clark', 'Mia Brown', 'Grace Lee'][i % 4],
  amount: [99, 150, 49, 290, 199, 120][i % 6],
  fee: +(([99, 150, 49, 290, 199, 120][i % 6]) * 0.029 + 0.30).toFixed(2),
  net: +(([99, 150, 49, 290, 199, 120][i % 6]) * 0.971 - 0.30).toFixed(2),
  type: (['membership', 'treatment', 'bnpl', 'membership'] as const)[i % 4],
  status: i === 5 ? 'pending' : 'succeeded',
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}))

export const connectStripe = createAsyncThunk('billing/connectStripe', async () => {
  await new Promise((r) => setTimeout(r, 1000))
  return { accountId: 'acct_mock_' + Math.random().toString(36).slice(2, 10), connectUrl: null }
})

export const fetchBilling = createAsyncThunk('billing/fetch', async () => {
  await new Promise((r) => setTimeout(r, 400))
  return {
    transactions: mockTransactions,
    monthlyRevenue: 12480,
    monthlyFees: 362,
  }
})

const billingSlice = createSlice({
  name: 'billing',
  initialState: {
    stripeConnected: true,
    stripeAccountId: 'acct_mock_demo1234',
    passFeesToPatient: false,
    bnplEnabled: true,
    platformFeePercent: 2.9,
    transactions: [],
    monthlyRevenue: 0,
    monthlyFees: 0,
    loading: false,
    error: null,
    connectUrl: null,
  } as BillingState,
  reducers: {
    togglePassFees(state) {
      state.passFeesToPatient = !state.passFeesToPatient
    },
    toggleBNPL(state) {
      state.bnplEnabled = !state.bnplEnabled
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectStripe.pending,   (s) => { s.loading = true })
      .addCase(connectStripe.fulfilled, (s, a) => {
        s.loading          = false
        s.stripeConnected  = true
        s.stripeAccountId  = a.payload.accountId
      })
      .addCase(fetchBilling.fulfilled, (s, a) => {
        s.transactions    = a.payload.transactions
        s.monthlyRevenue  = a.payload.monthlyRevenue
        s.monthlyFees     = a.payload.monthlyFees
      })
  },
})

export const { togglePassFees, toggleBNPL } = billingSlice.actions
export default billingSlice.reducer
