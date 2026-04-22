import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import { Toaster } from 'react-hot-toast'

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
      <Toaster position="top-right" toastOptions={{ className: 'text-sm font-medium' }} />
    </div>
  )
}
