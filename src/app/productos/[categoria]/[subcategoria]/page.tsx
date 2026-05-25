import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { Suspense } from 'react'
import { slugToCategory } from '@/lib/utils'
import ProductsPage from '@/pages/ProductsPage'

interface PageProps {
  params: Promise<{ categoria: string; subcategoria: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { categoria, subcategoria } = await params

  const { data: cats } = await supabase
    .from('categories')
    .select('name')
    .order('name')

  const allCats = cats?.map((c) => c.name) || []
  const parentName = slugToCategory(categoria, allCats) || categoria
  const subName = slugToCategory(subcategoria, allCats) || subcategoria

  const title = `${subName} | ${parentName} - MATHEO`
  const description = `Venta y distribución de ${subName} dentro de ${parentName} para la industria metalmecánica. Cotiza precios de herramientas de alta precisión en Lima, Perú.`
  const canonical = `https://industrialcompanymatheo.com/productos/${categoria}/${subcategoria}`

  return {
    title,
    description,
    keywords: `${subName}, ${parentName}, comprar en lima, comprar en perú, herramientas industriales Perú`,
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      locale: 'es_PE',
      siteName: 'Industrial Company MATHEO',
    },
  }
}

export default async function Page({ params }: PageProps) {
  const { categoria, subcategoria } = await params
  return (
    <Suspense fallback={null}>
      <ProductsPage categorySlug={categoria} subcategorySlug={subcategoria} />
    </Suspense>
  )
}
