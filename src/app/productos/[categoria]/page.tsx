// src/app/productos/[categoria]/page.tsx

import ProductsPage from '@/pages/ProductsPage'

interface Props {
  params: Promise<{ categoria: string }>
}

export default async function CategoriaPage({ params }: Props) {
  const { categoria } = await params
  return <ProductsPage categorySlug={categoria} />
}
