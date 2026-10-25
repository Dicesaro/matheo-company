import { Suspense } from 'react'
import { Plus } from 'lucide-react'
import { getCustomers, deleteCustomer } from '@/lib/actions/customers'
import CustomerTable from '@/components/admin/CustomerTable'
import CustomerFilters from '@/components/admin/CustomerFilters'
import ClientPagination from '@/components/admin/ClientPagination'
import ButtonLink from '@/components/admin/ButtonLink'

const PAGE_SIZE = 10

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>
}) {
  const { page: pageStr, q } = await searchParams
  const currentPage = Math.max(1, Number(pageStr) || 1)

  const customers = await getCustomers(q)

  const totalPages = Math.ceil(customers.length / PAGE_SIZE)
  const start = (currentPage - 1) * PAGE_SIZE
  const paginated = customers.slice(start, start + PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-slide-up-fade">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Clientes
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Gestiona los clientes y empresas
          </p>
        </div>
        <ButtonLink
          href="/admin/clientes/nuevo"
          className="bg-matheo-red text-white shadow-sm shadow-matheo-red/20 transition-all duration-200 hover:bg-matheo-red/90 hover:shadow-md hover:shadow-matheo-red/30"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo cliente
        </ButtonLink>
      </div>

      <div className="animate-slide-up-fade stagger-1">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Todos los clientes
                </h2>
                <span className="text-xs text-gray-400">
                  {customers.length} en total{q ? ' (filtrado)' : ''}
                </span>
              </div>
              <Suspense>
                <CustomerFilters defaultValue={q} />
              </Suspense>
            </div>
          </div>

          <CustomerTable customers={paginated} deleteAction={deleteCustomer} />

          <ClientPagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/admin/clientes"
          />
        </div>
      </div>
    </div>
  )
}