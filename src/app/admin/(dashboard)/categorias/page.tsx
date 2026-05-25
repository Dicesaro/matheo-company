import { Plus } from 'lucide-react'
import { getCategories } from '@/lib/actions/categories'
import { buildCategoryTree } from '@/lib/category-utils'
import CategoryTree from '@/components/admin/CategoryTree'
import ButtonLink from '@/components/admin/ButtonLink'

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

      <CategoryTree
        tree={tree}
        countParents={countParents}
        countSubcategories={countSubcategories}
      />
    </div>
  )
}
