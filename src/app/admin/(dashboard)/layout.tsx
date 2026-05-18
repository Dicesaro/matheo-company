import AdminSidebar from '@/components/admin/AdminSidebar'
import SessionGuard from '@/components/admin/SessionGuard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionGuard>
      <div className="flex min-h-screen bg-[#f6f8fc]">
        <AdminSidebar />
        <main className="flex-1 overflow-x-auto p-6 pt-16 lg:p-8 lg:pt-8">
          <div className="mx-auto max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </SessionGuard>
  )
}
