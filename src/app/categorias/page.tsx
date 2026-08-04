import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import CategoriesCarousel from '@/components/sections/CategoriesCarousel'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Categorías - Industrial Company Matheo',
  description:
    'Explora todas las categorías de herramientas industriales MATHEO: fresado, torneado, taladrado, roscado, sujeción y más.',
}

export default async function CategoriesPage() {
  const { data: cats } = await supabase
    .from('categories')
    .select('id, name, parent_id, image_url')
    .order('name')

  if (!cats) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Categorías no disponibles
          </h1>
        </div>
      </div>
    )
  }

  const idToName: Record<string, string> = {}
  cats.forEach((c) => { if (c.id) idToName[c.id] = c.name })

  const subcatNames = new Set(cats.filter((c) => c.parent_id).map((c) => c.name))
  const parentCats = cats.filter((c) => !subcatNames.has(c.name))

  const childrenMap: Record<string, { id: string; name: string; image: string | null }[]> = {}
  cats.forEach((c) => {
    if (c.parent_id) {
      const parentName = idToName[c.parent_id]
      if (parentName) {
        if (!childrenMap[parentName]) childrenMap[parentName] = []
        childrenMap[parentName].push({
          id: c.id ?? '',
          name: c.name,
          image: c.image_url || null,
        })
      }
    }
  })

  const parents = parentCats
    .map((p) => ({
      id: p.id ?? '',
      name: p.name,
      children: childrenMap[p.name] || [],
    }))
    .filter((p) => p.children.length > 0)

  return (
    <div className="min-h-screen bg-white pb-20 pt-6">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-bold text-matheo-blue mb-2 text-center">
          Categorías
        </h1>
        <p className='text-center'>Explora nuestras líneas de categorias</p>

        <CategoriesCarousel parents={parents} />
      </div>
    </div>
  )
}
