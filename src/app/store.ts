import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'

import authReducer        from '@/features/auth/authSlice'
import dashboardReducer   from '@/features/admin/dashboard/dashboardSlice'
import productsReducer    from '@/features/admin/products/productsSlice'
import membershipsReducer from '@/features/admin/memberships/membershipsSlice'
import offersReducer      from '@/features/admin/offers/offersSlice'
import billingReducer     from '@/features/admin/billing/billingSlice'
import staffReducer       from '@/features/admin/staff/staffSlice'
import platformReducer    from '@/features/platform/platformSlice'

const rootReducer = combineReducers({
  auth:         authReducer,
  dashboard:    dashboardReducer,
  products:     productsReducer,
  memberships:  membershipsReducer,
  offers:       offersReducer,
  billing:      billingReducer,
  staff:        staffReducer,
  platform:     platformReducer,
})

const persistConfig = {
  key: 'clinic-root',
  version: 1,
  storage,
  whitelist: ['auth'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState   = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
