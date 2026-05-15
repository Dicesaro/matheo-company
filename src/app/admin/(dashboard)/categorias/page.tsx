import { Plus, Pencil, ChevronRight } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
      <TableRow className="hover:bg-gray-50/50 transition-colors">
        <TableCell className="font-mono text-xs text-gray-400">{node.id}</TableCell>
        <TableCell className="font-medium text-gray-900">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 24}px` }}>
            {depth > 0 && (
              <div className="w-4 h-px bg-gray-300 shrink-0" />
            )}
            {node.children.length > 0 ? (
              <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            ) : (
              <div className="w-3.5 shrink-0" />
            )}
            <span className={depth > 0 ? 'text-gray-600' : ''}>{node.name}</span>
            {depth === 0 && node.children.length > 0 && (
              <span className="text-xs text-gray-400 ml-2">({node.children.length})</span>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <ButtonLink variant="ghost" size="icon" href={`/admin/categorias/${node.id}`}>
              <Pencil className="h-4 w-4 text-gray-400 hover:text-matheo-red" />
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
          <p className="text-gray-500">Gestiona las categorías y subcategorías de productos</p>
        </div>
        <ButtonLink href="/admin/categorias/nuevo" className="bg-matheo-red hover:bg-matheo-red/90 text-white shadow-lg shadow-matheo-red/25">
          <Plus className="mr-2 h-4 w-4" />
          Nueva categoría
        </ButtonLink>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-white rounded-t-xl border-b">
          <CardTitle className="text-gray-900">Todas las categorías</CardTitle>
          <span className="text-sm text-gray-400">
            {countParents} categorías{countSubcategories > 0 ? `, ${countSubcategories} subcategorías` : ''}
          </span>
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
              {tree.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center text-gray-400">
                    No hay categorías registradas
                  </TableCell>
                </TableRow>
              )}
              {tree.map((node) => (
                <TreeRow key={node.id} node={node} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
