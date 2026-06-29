import { createClient } from '@/lib/supabase-server'
import { generateSlug } from '@/lib/utils'

interface ProductItem {
  id: string
  name: string
  slug: string
  categorySlug: string
  image: string
  category: string
  brand: string
  description: string
  price?: number
  rating?: number
}

interface HomePageProducts {
  productItems: ProductItem[]
  taladradoItems: ProductItem[]
  insertosItems: ProductItem[]
  fresasCarbuItems: ProductItem[]
}

export async function getHomePageProducts(): Promise<HomePageProducts> {
  const supabase = await createClient()

  async function fetchCategoryProducts(categoryName: string) {
    const catData = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .single()

    if (!catData.data) return []

    const { data } = await supabase
      .from('products')
      .select('id, name, description, image_url, price, rating, categories!inner(name), brands(name)')
      .eq('category_id', catData.data.id)
      .not('image_url', 'is', null)

    type RawProduct = {
      id: unknown
      name: unknown
      description: unknown
      image_url: unknown
      price: unknown
      rating: unknown
      categories: { name: unknown } | null
      brands: { name: unknown } | null
    }

    return (
      (data as unknown as RawProduct[])
        ?.filter((p) => p.categories?.name)
        .map((p) => ({
          id: p.id as string,
          name: p.name as string,
          slug: generateSlug(p.name as string),
          categorySlug: generateSlug((p.categories as { name: string }).name),
          image: p.image_url as string,
          category: (p.categories as { name: string }).name,
          brand: ((p.brands as { name: string } | null)?.name ?? '') as string,
          description: (p.description as string) ?? '',
          price: (p.price as number) ?? undefined,
          rating: (p.rating as number) ?? undefined,
        })) || []
    )
  }

  async function fetchChildrenProducts(parentName: string) {
    const parent = await supabase
      .from('categories')
      .select('id')
      .eq('name', parentName)
      .single()

    if (!parent.data) return []

    const children = await supabase
      .from('categories')
      .select('id')
      .eq('parent_id', parent.data.id)

    if (!children.data || children.data.length === 0) return []

    const childIds = children.data.map(c => c.id)

    const { data } = await supabase
      .from('products')
      .select('id, name, description, image_url, price, rating, categories!inner(name), brands(name)')
      .in('category_id', childIds)
      .not('image_url', 'is', null)

    type RawProduct = {
      id: unknown
      name: unknown
      description: unknown
      image_url: unknown
      price: unknown
      rating: unknown
      categories: { name: unknown } | null
      brands: { name: unknown } | null
    }

    return (
      (data as unknown as RawProduct[])
        ?.filter((p) => p.categories?.name)
        .map((p) => ({
          id: p.id as string,
          name: p.name as string,
          slug: generateSlug(p.name as string),
          categorySlug: generateSlug((p.categories as { name: string }).name),
          image: p.image_url as string,
          category: (p.categories as { name: string }).name,
          brand: ((p.brands as { name: string } | null)?.name ?? '') as string,
          description: (p.description as string) ?? '',
          price: (p.price as number) ?? undefined,
          rating: (p.rating as number) ?? undefined,
        })) || []
    )
  }

  const [productItems, taladradoItems, insertosItems, fresasCarbuItems] =
    await Promise.all([
      fetchCategoryProducts('Fresas Rotativas'),
      fetchChildrenProducts('Herramientas de Taladrado'),
      fetchCategoryProducts('Insertos para Torneado'),
      fetchCategoryProducts('Fresas Carburadas Rotativas'),
    ])

  return { productItems, taladradoItems, insertosItems, fresasCarbuItems }
}

interface CatalogProduct {
  id: string
  slug: string
  categorySlug: string
  name: string
  category: string
  brand: string
  image: string
  description: string
  price?: number
  rating?: number
}

interface CatalogData {
  allCategories: string[]
  allBrands: string[]
  allProducts: CatalogProduct[]
  parentNameMap: Record<string, string[]>
}

export async function getCatalogData(): Promise<CatalogData> {
  const supabase = await createClient()

  const catsPromise = supabase
    .from('categories')
    .select('id, name, parent_id')
    .order('name')

  const brandsPromise = supabase
    .from('brands')
    .select('name')
    .order('name')

  const prodsPromise = supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      image_url,
      price,
      rating,
      categories (name),
      brands (name)
    `)

  const [catsResult, brandsResult, prodsResult] = await Promise.all([
    catsPromise,
    brandsPromise,
    prodsPromise,
  ])

  const cats = catsResult.data || []
  const allCats = cats.map((c) => c.name)
  const idToName: Record<string, string> = {}
  for (const c of cats) idToName[c.id] = c.name

  const childrenOf: Record<string, string[]> = {}
  for (const c of cats) {
    if (c.parent_id) {
      const parentName = idToName[c.parent_id]
      if (parentName) {
        if (!childrenOf[parentName]) childrenOf[parentName] = []
        childrenOf[parentName].push(c.name)
      }
    }
  }

  const allBrands = (brandsResult.data || []).map((b) => b.name)

  type RawProduct = {
    id: string
    name: string
    description: string
    image_url: string
    price?: number
    rating?: number
    categories?: { name: string } | null
    brands?: { name: string } | null
  }

  const prods = (prodsResult.data || []) as unknown as RawProduct[]

  const allProducts = prods.map((p) => ({
    id: p.id,
    slug: generateSlug(p.name),
    categorySlug: generateSlug(p.categories?.name || 'General'),
    name: p.name,
    description: p.description,
    image: p.image_url,
    price: p.price,
    rating: p.rating,
    category: p.categories?.name || 'General',
    brand: p.brands?.name || 'Varios',
  }))

  return {
    allCategories: allCats,
    allBrands,
    allProducts,
    parentNameMap: childrenOf,
  }
}
