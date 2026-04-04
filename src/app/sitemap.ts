import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { generateSlug } from '@/lib/utils'

const BASE_URL = 'https://industrialcompanymatheo.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Rutas estáticas ──────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/productos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // ── Categorías ───────────────────────────────────────────────────
  let categoryRoutes: MetadataRoute.Sitemap = []
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('name')
      .order('name')

    if (categories) {
      categoryRoutes = categories.map((cat) => ({
        url: `${BASE_URL}/productos/${generateSlug(cat.name)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Sitemap: error fetching categories', error)
  }

  // ── Productos ────────────────────────────────────────────────────
  let productRoutes: MetadataRoute.Sitemap = []
  try {
    const { data: products, error } = await supabase.from('products')
      .select(`
      name,
      categories (name)
    `) // ← quitamos updated_at por si no existe la columna

    if (error) {
      console.error('Sitemap products query error:', error)
    }

    if (products) {
      productRoutes = (
        products as unknown as Array<{
          name: string
          categories?: { name: string } | { name: string }[] | null
        }>
      ).map((p) => {
        const categoryName = Array.isArray(p.categories)
          ? p.categories[0]?.name || 'general'
          : p.categories?.name || 'general'

        const categorySlug = generateSlug(categoryName)
        const productSlug = generateSlug(p.name)

        return {
          url: `${BASE_URL}/producto/${categorySlug}/${productSlug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }
      })
    }
  } catch (error) {
    console.error('Sitemap: error fetching products', error)
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
