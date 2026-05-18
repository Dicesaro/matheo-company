import { Plus, Pencil, ChevronRight, FolderOpen } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { deleteCategory, getCategories } from '@/lib/actions/categories'
import { buildCategoryTree } from '@/lib/category-utils'
import DeleteButton from '@/components/admin/DeleteButton'
import ButtonLink from '@/components/admin/ButtonLink'

function TreeRow({
  node,
  depth = 0,
}: {
  node: { id: string; name: string; children: { id: string; name: string; children: any[] }[] }
  depth?: number
}) {
  return (
    <>
      <TableRow className="border-b border-gray-50 transition-all duration-200 hover:bg-gray-50/50">
        <TableCell className="px-4 py-3 font-mono text-xs text-gray-400">
          {node.id}
        </TableCell>
        <TableCell className="px-4 py-3 font-medium text-gray-900">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 28}px` }}>
            {depth > 0 && (
              <div className="h-px w-4 shrink-0 bg-gray-200" />
            )}
            {node.children.length > 0 ? (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            ) : (
              <div className="w-3.5 shrink-0" />
            )}
            <span className={depth > 0 ? 'text-gray-600' : ''}>{node.name}</span>
            {depth === 0 && node.children.length > 0 && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                {node.children.length}
              </span>
            )}
          </div>
        </TableCell>
        <TableCell className="px-4 py-3">
          <div className="flex items-center gap-1">
            <ButtonLink
              variant="ghost"
              size="icon"
              href={`/admin/categorias/${node.id}`}
            >
              <Pencil className="h-4 w-4 text-gray-400 transition-colors hover:text-matheo-red" />
            </ButtonLink>
            <DeleteButton
              id={node.id}
              action={deleteCategory}
              label={node.name}
            />
          </div>
        </TableCell>
      </TableRow>
      {node.children.map((child) => (
        <TreeRow key={child.id} node={child} depth={depth + 1} />
      ))}
    </>
  )
}

export default async function CategoriesPage() {
  const categories = await getCategories()
  const tree = buildCategoryTree(categories)

  const countParents = tree.length
  const countSubcategories = categories.length - countParents

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-slide-up-fade">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Categorías
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Gestiona las categorías y subcategorías de productos
          </p>
        </div>
        <ButtonLink
          href="/admin/categorias/nuevo"
          className="bg-matheo-red text-white shadow-sm shadow-matheo-red/20 transition-all duration-200 hover:bg-matheo-red/90 hover:shadow-md hover:shadow-matheo-red/30"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva categoría
        </ButtonLink>
      </div>

      <div className="animate-slide-up-fade stagger-1">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Todas las categorías
            </h2>
            <span className="text-xs text-gray-400">
              {countParents} categoría{countParents !== 1 && 's'}
              {countSubcategories > 0
                ? `, ${countSubcategories} subcategoría${countSubcategories !== 1 && 's'}`
                : ''}
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
              {tree.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center text-sm text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FolderOpen className="h-8 w-8 text-gray-300" />
                      <p>No hay categorías registradas</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {tree.map((node) => (
                <TreeRow key={node.id} node={node} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
