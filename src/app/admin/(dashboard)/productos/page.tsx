import { Plus, Pencil, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { deleteProduct, getProducts } from '@/lib/actions/products'
import DeleteButton from '@/components/admin/DeleteButton'
import ButtonLink from '@/components/admin/ButtonLink'
import SearchInput from '@/components/admin/SearchInput'
import CategoryFilter from '@/components/admin/CategoryFilter'
import ClientPagination from '@/components/admin/ClientPagination'
import { createClient } from '@/lib/supabase-server'

const PAGE_SIZE = 10

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string; page?: string }>
}) {
  const { q, categoria, page: pageStr } = await searchParams
  const currentPage = Math.max(1, Number(pageStr) || 1)

  const supabase = await createClient()
  const [{ data: cats }, products] = await Promise.all([
    supabase.from('categories').select('id, name, parent_id').order('name'),
    getProducts(),
  ])

  const allCategories = cats || []

  const idToName: Record<string, string> = {}
  for (const c of allCategories) idToName[c.id] = c.name

  const categoryName = categoria && categoria !== '__all__' && idToName[categoria]
    ? idToName[categoria]
    : null

  let filtered = q
    ? products.filter((p) =>
        p.name.toLowerCase().includes(q.toLowerCase())
      )
    : products

  if (categoryName) {
    filtered = filtered.filter((p) => {
      const catName = Array.isArray(p.categories)
        ? p.categories[0]?.name
        : p.categories?.name
      return catName === categoryName
    })
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const start = (currentPage - 1) * PAGE_SIZE
  const paginated = filtered.slice(start, start + PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-500">Gestiona el catálogo de productos</p>
        </div>
        <ButtonLink href="/admin/productos/nuevo" className="bg-matheo-red hover:bg-matheo-red/90 text-white shadow-lg shadow-matheo-red/25">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo producto
        </ButtonLink>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-full max-w-sm">
          <SearchInput defaultValue={q} />
        </div>
        <div className="w-56">
          <CategoryFilter
            categories={allCategories}
            defaultValue={categoria}
            searchQuery={q}
          />
        </div>
        {(q || categoria) && (
          <p className="text-sm text-gray-500 whitespace-nowrap">
            {filtered.length} resultado{filtered.length !== 1 && 's'}
            {q && <> para &quot;{q}&quot;</>}
            {categoryName && <> en {categoryName}</>}
          </p>
        )}
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-white rounded-t-xl border-b">
          <CardTitle className="text-gray-900">Todos los productos</CardTitle>
          <span className="text-sm text-gray-400">{filtered.length} en total</span>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="w-12 text-gray-500 font-semibold">Img</TableHead>
                <TableHead className="text-gray-500 font-semibold">Nombre</TableHead>
                <TableHead className="text-gray-500 font-semibold">Categoría</TableHead>
                <TableHead className="text-gray-500 font-semibold">Marca</TableHead>
                <TableHead className="text-gray-500 font-semibold">Destacado</TableHead>
                <TableHead className="w-24 text-gray-500 font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-400">
                    {q ? 'No se encontraron productos' : 'No hay productos registrados'}
                  </TableCell>
                </TableRow>
              )}
              {paginated.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-lg object-contain border border-gray-100 bg-white"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-gray-300" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                  <TableCell className="text-gray-600">{product.categories?.name || '-'}</TableCell>
                  <TableCell className="text-gray-600">{product.brands?.name || '-'}</TableCell>
                  <TableCell>
                    {product.featured ? (
                      <Badge className="bg-matheo-red/10 text-matheo-red hover:bg-matheo-red/15 border-0">Sí</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-500 border-0">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ButtonLink variant="ghost" size="icon" href={`/admin/productos/${product.id}`}>
                        <Pencil className="h-4 w-4 text-gray-400 hover:text-matheo-red" />
                      </ButtonLink>
                      <DeleteButton
                        id={product.id}
                        action={deleteProduct}
                        label={product.name}
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
            basePath="/admin/productos"
          />
        </CardContent>
      </Card>
    </div>
  )
}
