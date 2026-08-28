import { Suspense } from 'react'
import { getContacts, deleteContact } from '@/lib/actions/contacts'
import ClientPagination from '@/components/admin/ClientPagination'
import ContactTable from '@/components/admin/ContactTable'
import ContactFilters from '@/components/admin/ContactFilters'

const PAGE_SIZE = 10

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; from?: string; to?: string }>
}) {
  const { page: pageStr, from, to } = await searchParams
  const currentPage = Math.max(1, Number(pageStr) || 1)

  const filters = { from, to }
  const hasFilters = !!(from || to)

  const contacts = await getContacts(hasFilters ? filters : undefined)

  const totalPages = Math.ceil(contacts.length / PAGE_SIZE)
  const start = (currentPage - 1) * PAGE_SIZE
  const paginated = contacts.slice(start, start + PAGE_SIZE)

  const unreadCount = contacts.filter((c) => !c.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-slide-up-fade">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Mensajes de Contacto
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {unreadCount > 0
              ? `Tienes ${unreadCount} mensaje${unreadCount > 1 ? 's' : ''} sin leer`
              : 'No hay mensajes sin leer'}
          </p>
        </div>
      </div>

      <div className="animate-slide-up-fade stagger-1">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Todos los mensajes
                </h2>
                <span className="text-xs text-gray-400">
                  {contacts.length} en total{hasFilters ? ' (filtrado)' : ''}
                </span>
              </div>
              <Suspense>
                <ContactFilters />
              </Suspense>
            </div>
          </div>

          <ContactTable contacts={paginated} deleteAction={deleteContact} />

          <ClientPagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/admin/contactos"
          />
        </div>
      </div>
    </div>
  )
}
