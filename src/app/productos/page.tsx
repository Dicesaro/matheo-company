import { Metadata } from 'next'
import { Suspense } from 'react'
import ProductsPage from '@/views/ProductsPage'
import { getCatalogData } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Catálogo de Herramientas Industriales en Perú | MATHEO',
  description:
    'Catálogo completo de herramientas industriales metalmecánicas en Perú: brocas, machos de roscado, fresas e insertos. Importación directa y distribución al por mayor y menor.',
  keywords:
    'herramientas industriales Peru, importador herramientas Lima, distribuidor herramientas metalmecánicas',
  alternates: {
    canonical: 'https://industrialcompanymatheo.com/productos',
  },
  openGraph: {
    type: 'website',
    url: 'https://industrialcompanymatheo.com/productos',
    title: 'Catálogo de Herramientas Industriales en Perú | MATHEO',
    description:
      'Catálogo completo de herramientas industriales metalmecánicas en Perú.',
    locale: 'es_PE',
    siteName: 'Industrial Company MATHEO',
  },
}

export default async function Page() {
  const { allCategories, allBrands, allProducts, parentNameMap } =
    await getCatalogData()

  return (
    <Suspense fallback={null}>
      <ProductsPage
        initialProducts={allProducts}
        initialCategories={allCategories}
        initialBrands={allBrands}
        initialParentNameMap={parentNameMap}
      />
    </Suspense>
  )
}
