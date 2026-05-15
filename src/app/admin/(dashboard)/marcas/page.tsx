import { Plus, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marcas</h1>
          <p className="text-gray-500">Gestiona las marcas de productos</p>
        </div>
        <ButtonLink href="/admin/marcas/nuevo" className="bg-matheo-red hover:bg-matheo-red/90 text-white shadow-lg shadow-matheo-red/25">
          <Plus className="mr-2 h-4 w-4" />
          Nueva marca
        </ButtonLink>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-white rounded-t-xl border-b">
          <CardTitle className="text-gray-900">Todas las marcas</CardTitle>
          <span className="text-sm text-gray-400">{brands.length} en total</span>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-gray-500 font-semibold">ID</TableHead>
                <TableHead className="text-gray-500 font-semibold">Nombre</TableHead>
                <TableHead className="w-24 text-gray-500 font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center text-gray-400">
                    No hay marcas registradas
                  </TableCell>
                </TableRow>
              )}
              {paginated.map((brand) => (
                <TableRow key={brand.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-mono text-xs text-gray-400">{brand.id}</TableCell>
                  <TableCell className="font-medium text-gray-900">{brand.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ButtonLink variant="ghost" size="icon" href={`/admin/marcas/${brand.id}`}>
                        <Pencil className="h-4 w-4 text-gray-400 hover:text-matheo-red" />
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
        </CardContent>
      </Card>
    </div>
  )
}
