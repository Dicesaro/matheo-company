import { Plus, Pencil, Building2 } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { deleteBrand, getBrands } from '@/lib/actions/brands'
import DeleteButton from '@/components/admin/DeleteButton'
import ButtonLink from '@/components/admin/ButtonLink'
import ClientPagination from '@/components/admin/ClientPagination'

const PAGE_SIZE = 10

export default async function BrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr } = await searchParams
  const currentPage = Math.max(1, Number(pageStr) || 1)
  const brands = await getBrands()

  const totalPages = Math.ceil(brands.length / PAGE_SIZE)
  const start = (currentPage - 1) * PAGE_SIZE
  const paginated = brands.slice(start, start + PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-slide-up-fade">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Marcas
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Gestiona las marcas de productos
          </p>
        </div>
        <ButtonLink
          href="/admin/marcas/nuevo"
          className="bg-matheo-red text-white shadow-sm shadow-matheo-red/20 transition-all duration-200 hover:bg-matheo-red/90 hover:shadow-md hover:shadow-matheo-red/30"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva marca
        </ButtonLink>
      </div>

      <div className="animate-slide-up-fade stagger-1">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Todas las marcas
            </h2>
            <span className="text-xs text-gray-400">
              {brands.length} en total
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-50">
                <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  ID
                </TableHead>
                <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Nombre
                </TableHead>
                <TableHead className="h-10 w-24 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center text-sm text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Building2 className="h-8 w-8 text-gray-300" />
                      <p>No hay marcas registradas</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {paginated.map((brand) => (
                <TableRow
                  key={brand.id}
                  className="border-b border-gray-50 transition-all duration-200 hover:bg-gray-50/50"
                >
                  <TableCell className="px-4 py-3 font-mono text-xs text-gray-400">
                    {brand.id}
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium text-gray-900">
                    {brand.name}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <ButtonLink
                        variant="ghost"
                        size="icon"
                        href={`/admin/marcas/${brand.id}`}
                      >
                        <Pencil className="h-4 w-4 text-gray-400 transition-colors hover:text-matheo-red" />
                      </ButtonLink>
                      <DeleteButton
                        id={brand.id}
                        action={deleteBrand}
                        label={brand.name}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <ClientPagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/admin/marcas"
          />
        </div>
      </div>
    </div>
  )
}
