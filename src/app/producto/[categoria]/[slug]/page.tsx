// src/app/producto/[categoria]/[slug]/page.tsx

import ProductDetailPage from '@/pages/ProductDetailPage'

interface Props {
  params: Promise<{ categoria: string; slug: string }>
}

export default async function Page({ params }: Props) {
  const { categoria, slug } = await params
  return <ProductDetailPage categoria={categoria} slug={slug} />
}
