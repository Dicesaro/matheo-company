// src/app/productos/[categoria]/page.tsx
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { slugToCategory } from '@/lib/utils'
import ProductsPage from '@/pages/ProductsPage'

interface PageProps {
  params: Promise<{ categoria: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { categoria } = await params

  const { data: cats } = await supabase
    .from('categories')
    .select('name')
    .order('name')

  const allCats = cats?.map((c) => c.name) || []
  const categoryName = slugToCategory(categoria, allCats) || categoria

  const title = `Catálogo de ${categoryName} | Herramientas Industriales MATHEO`
  const description = `Venta y distribución de ${categoryName} para la industria metalmecánica. Cotiza precios de herramientas de alta precisión en Lima, Perú.`
  const canonical = `https://industrialcompanymatheo.com/productos/${categoria}`

  return {
    title,
    description,
    keywords: `${categoryName}, comprar en lima, comprar en perú, importar ${categoryName}, herramientas industriales Perú`,
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
  const { categoria } = await params
  return <ProductsPage categorySlug={categoria} />
}
