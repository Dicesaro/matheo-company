import { Plus, Pencil, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { deleteProduct, getProducts } from '@/lib/actions/products'
import DeleteButton from '@/components/admin/DeleteButton'
import ButtonLink from '@/components/admin/ButtonLink'
import SearchInput from '@/components/admin/SearchInput'
import CategoryFilter from '@/components/admin/CategoryFilter'
import ClientPagination from '@/components/admin/ClientPagination'
import { createClient } from '@/lib/supabase-server'

const PAGE_SIZE = 7

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

  const categoryName = categoria && categoria !== '__all__' ? categoria : null

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
      <div className="flex items-center justify-between animate-slide-up-fade">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Productos
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Gestiona el catálogo de productos
          </p>
        </div>
        <ButtonLink
          href="/admin/productos/nuevo"
          className="bg-matheo-red text-white shadow-sm shadow-matheo-red/20 transition-all duration-200 hover:bg-matheo-red/90 hover:shadow-md hover:shadow-matheo-red/30"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo producto
        </ButtonLink>
      </div>

      <div className="flex items-center gap-4 animate-slide-up-fade stagger-1">
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
          <p className="whitespace-nowrap text-sm text-gray-500">
            {filtered.length} resultado{filtered.length !== 1 && 's'}
            {q && <> para &ldquo;{q}&rdquo;</>}
            {categoryName && <> en {categoryName}</>}
          </p>
        )}
      </div>

      <div className="animate-slide-up-fade stagger-2">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Todos los productos
            </h2>
            <span className="text-xs text-gray-400">
              {filtered.length} en total
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-50">
                <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Img
                </TableHead>
                <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Nombre
                </TableHead>
                <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Categoría
                </TableHead>
                <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Marca
                </TableHead>
                <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Destacado
                </TableHead>
                <TableHead className="h-10 w-24 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-sm text-gray-400">
                    {q
                      ? 'No se encontraron productos'
                      : 'No hay productos registrados'}
                  </TableCell>
                </TableRow>
              )}
              {paginated.map((product, i) => (
                <TableRow
                  key={product.id}
                  className="border-b border-gray-50 transition-all duration-200 hover:bg-gray-50/50"
                  style={{ animationDelay: `${(i + 1) * 0.03}s` }}
                >
                  <TableCell className="px-4 py-3">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-xl border border-gray-100 bg-white object-contain"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-gray-50">
                        <ImageIcon className="h-4 w-4 text-gray-300" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium text-gray-900">
                    {product.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500">
                    {product.categories?.name || (
                      <span className="text-gray-300">—</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500">
                    {product.brands?.name || (
                      <span className="text-gray-300">—</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {product.featured ? (
                      <Badge className="border-0 bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                        Sí
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="border-0 bg-gray-100 text-gray-500">
                        No
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <ButtonLink
                        variant="ghost"
                        size="icon"
                        href={`/admin/productos/${product.id}`}
                      >
                        <Pencil className="h-4 w-4 text-gray-400 transition-colors hover:text-matheo-red" />
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
        </div>
      </div>
    </div>
  )
}
