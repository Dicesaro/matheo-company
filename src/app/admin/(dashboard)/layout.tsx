import AdminSidebar from '@/components/admin/AdminSidebar'
import SessionGuard from '@/components/admin/SessionGuard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-x-auto p-6 pt-16 lg:pt-6">
          {children}
        </main>
      </div>
    </SessionGuard>
  )
}
