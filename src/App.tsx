import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'

// Layouts
import AdminLayout    from '@/components/layout/AdminLayout'
import PlatformLayout from '@/components/layout/PlatformLayout'

// Auth
import LoginPage    from '@/features/auth/components/LoginPage'
import SignupWizard from '@/features/auth/components/SignupWizard'

// Admin pages
import AdminDashboard  from '@/features/admin/dashboard/components/AdminDashboard'
import AppBuilderPage  from '@/features/admin/appbuilder/AppBuilderPage'
import BillingPage     from '@/features/admin/billing/components/BillingPage'
import StaffPage       from '@/features/admin/staff/StaffPage'
import AnalyticsPage   from '@/features/admin/analytics/AnalyticsPage'

// Platform (super admin) pages
import PlatformOverview      from '@/features/platform/pages/PlatformOverview'
import ClinicsListPage       from '@/features/platform/pages/ClinicsListPage'
import ApprovalsPage         from '@/features/platform/pages/ApprovalsPage'
import ClinicDetailPage      from '@/features/platform/pages/ClinicDetailPage'
import PlatformAnalyticsPage from '@/features/platform/pages/PlatformAnalyticsPage'
import PlatformSettingsPage  from '@/features/platform/pages/PlatformSettingsPage'

function RequireAuth({ children }: { children: JSX.Element }) {
  const token = useAppSelector((s) => s.auth.token)
  if (!token) return <Navigate to="/login" replace />
  return children
}

function RequireAdmin({ children }: { children: JSX.Element }) {
  const token = useAppSelector((s) => s.auth.token)
  const role  = useAppSelector((s) => s.auth.user?.role)
  if (!token) return <Navigate to="/login" replace />
  if (role === 'super_admin') return <Navigate to="/platform" replace />
  return children
}

function RequirePlatform({ children }: { children: JSX.Element }) {
  const token = useAppSelector((s) => s.auth.token)
  const role  = useAppSelector((s) => s.auth.user?.role)
  if (!token) return <Navigate to="/login" replace />
  if (role !== 'super_admin') return <Navigate to="/admin" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignupWizard />} />
        <Route path="/"       element={<Navigate to="/login" replace />} />

        {/* Clinic Admin */}
        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index              element={<AdminDashboard />} />
          <Route path="appbuilder"  element={<AppBuilderPage />} />
          <Route path="billing"     element={<BillingPage />} />
          <Route path="staff"       element={<StaffPage />} />
          <Route path="analytics"   element={<AnalyticsPage />} />
        </Route>

        {/* Platform Super Admin */}
        <Route path="/platform" element={<RequirePlatform><PlatformLayout /></RequirePlatform>}>
          <Route index               element={<PlatformOverview />} />
          <Route path="clinics"      element={<ClinicsListPage />} />
          <Route path="clinics/:id"  element={<ClinicDetailPage />} />
          <Route path="approvals"    element={<ApprovalsPage />} />
          <Route path="analytics"    element={<PlatformAnalyticsPage />} />
          <Route path="settings"     element={<PlatformSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
