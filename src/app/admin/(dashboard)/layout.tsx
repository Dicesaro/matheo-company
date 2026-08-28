import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import SessionGuard from '@/components/admin/SessionGuard'
import { getUnreadCount } from '@/lib/actions/contacts'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const unreadCount = await getUnreadCount()

  return (
    <SessionGuard>
      <div className="flex min-h-screen bg-[#f6f8fc]">
        <AdminSidebar unreadCount={unreadCount} />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 overflow-x-auto p-6 pt-16 lg:p-8 lg:pt-8">
            <div className="mx-auto max-w-7xl animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SessionGuard>
  )
}
