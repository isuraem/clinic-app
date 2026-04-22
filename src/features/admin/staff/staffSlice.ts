import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { StaffMember } from '@/types'

interface StaffState {
  members: StaffMember[]
  selected: StaffMember | null
  period: 'week' | 'month' | 'quarter'
  loading: boolean
}

export const fetchStaff = createAsyncThunk('staff/fetch', async () => {
  await new Promise((r) => setTimeout(r, 300))
  return [] as StaffMember[]   // populated via dashboard slice in real app
})

const staffSlice = createSlice({
  name: 'staff',
  initialState: { members: [], selected: null, period: 'month', loading: false } as StaffState,
  reducers: {
    setMembers(state, action: PayloadAction<StaffMember[]>) {
      state.members = action.payload
    },
    selectMember(state, action: PayloadAction<StaffMember | null>) {
      state.selected = action.payload
    },
    setPeriod(state, action: PayloadAction<'week' | 'month' | 'quarter'>) {
      state.period = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStaff.fulfilled, (s, a) => { s.members = a.payload })
  },
})

export const { setMembers, selectMember, setPeriod } = staffSlice.actions
export default staffSlice.reducer
