// src/app/producto/[categoria]/[slug]/page.tsx

import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { generateSlug } from '@/lib/utils'
import ProductDetailPage from '@/pages/ProductDetailPage'

interface PageProps {
  params: Promise<{ slug: string; categoria: string }>
}

// Genera el metadata dinámico por producto
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, categoria } = await params

  const { data } = await supabase
    .from('products')
    .select('*, categories(name), brands(name)')

  const match = data?.find((item) => generateSlug(item.name) === slug)

  if (!match) {
    return {
      title: 'Producto no encontrado | MATHEO',
    }
  }

  const productName = match.name
  const description = match.description
    ? `${match.description.slice(0, 155)}...`
    : `${productName} — Herramienta industrial de precisión. Importador y distribuidor en Perú.`
  const image = match.image_url
  const categoryName = match.categories?.name || 'General'
  const brandName = match.brands?.name || 'Varios'
  const canonicalUrl = `https://industrialcompanymatheo.com/producto/${categoria}/${slug}`

  return {
    title: `${productName} | MATHEO`,
    description,
    keywords: `${productName}, ${categoryName}, ${brandName}, herramientas industriales Perú`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: `${productName} | MATHEO`,
      description,
      images: image ? [{ url: image }] : [],
      locale: 'es_PE',
      siteName: 'Industrial Company MATHEO',
    },
  }
}

export default async function Page({ params }: PageProps) {
  const { slug, categoria } = await params

  // JSON-LD structured data
  const { data } = await supabase
    .from('products')
    .select('*, categories(name), brands(name)')

  const match = data?.find((item) => generateSlug(item.name) === slug)

  const structuredData = match
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: match.name,
        description:
          match.description || `Herramienta industrial ${match.name}`,
        image: match.images_gallery || [match.image_url],
        brand: {
          '@type': 'Brand',
          name: match.brands?.name || 'Varios',
        },
        category: match.categories?.name || 'General',
        ...(match.rating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: match.rating,
            bestRating: 5,
            worstRating: 1,
            ratingCount: 24,
          },
        }),
        offers: {
          '@type': 'Offer',
          url: `https://industrialcompanymatheo.com/producto/${categoria}/${slug}`,
          priceCurrency: 'PEN',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'Industrial Company MATHEO EIRL',
          },
        },
      }
    : null

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      <ProductDetailPage slug={slug} categoria={categoria} />
    </>
  )
}
