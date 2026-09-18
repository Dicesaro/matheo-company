import { Plus, Pencil, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { deleteBanner, getBanners } from '@/lib/actions/banners'
import DeleteButton from '@/components/admin/DeleteButton'
import ButtonLink from '@/components/admin/ButtonLink'
import ClientPagination from '@/components/admin/ClientPagination'

const PAGE_SIZE = 8

export default async function BannersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr } = await searchParams
  const currentPage = Math.max(1, Number(pageStr) || 1)
  const banners = await getBanners()

  const totalPages = Math.ceil(banners.length / PAGE_SIZE)
  const start = (currentPage - 1) * PAGE_SIZE
  const paginated = banners.slice(start, start + PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-slide-up-fade">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Banners
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Gestiona los banners del hero de la página principal
          </p>
        </div>
        <ButtonLink
          href="/admin/banners/nuevo"
          className="bg-matheo-red text-white shadow-sm shadow-matheo-red/20 transition-all duration-200 hover:bg-matheo-red/90 hover:shadow-md hover:shadow-matheo-red/30"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo banner
        </ButtonLink>
      </div>

      <div className="animate-slide-up-fade stagger-1">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Todos los banners
            </h2>
            <span className="text-xs text-gray-400">
              {banners.length} en total
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-50">
                <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Imagen
                </TableHead>
                <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Título
                </TableHead>
                <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Posición
                </TableHead>
                <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Estado
                </TableHead>
                <TableHead className="h-10 w-24 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-sm text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ImageIcon className="h-8 w-8 text-gray-300" />
                      <p>No hay banners registrados</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {paginated.map((banner) => (
                <TableRow
                  key={banner.id}
                  className="border-b border-gray-50 transition-all duration-200 hover:bg-gray-50/50"
                >
                  <TableCell className="px-4 py-3">
                    <div className="relative h-10 w-20 overflow-hidden rounded-lg border border-gray-100">
                      <Image
                        src={banner.image_url}
                        alt={banner.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium text-gray-900">
                    {banner.title}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-500">
                    {banner.position}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {banner.active ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-600">
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
                        Inactivo
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <ButtonLink
                        variant="ghost"
                        size="icon"
                        href={`/admin/banners/${banner.id}`}
                      >
                        <Pencil className="h-4 w-4 text-gray-400 transition-colors hover:text-matheo-red" />
                      </ButtonLink>
                      <DeleteButton
                        id={banner.id}
                        action={deleteBanner}
                        label={banner.title}
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
            basePath="/admin/banners"
          />
        </div>
      </div>
    </div>
  )
}