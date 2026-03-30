'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn, generateSlug } from '../lib/utils'
import { supabase } from '../lib/supabase'
import SEOHead from '../components/SEOHead'

interface Product {
  id: string
  name: string
  category: string
  categorySlug: string
  brand: string
  image: string
  images: string[]
  description: string
  longDescription: string
  features: string[]
  benefits: string[]
  specifications: { label: string; value: string }[]
  workMaterials?: string[]
  rating?: number
}

interface ProductDetailPageProps {
  slug: string
  categoria: string
}

export default function ProductDetailPage({
  slug,
  categoria,
}: ProductDetailPageProps) {
  const pathname = usePathname()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState<'info' | 'specs'>('info')

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return
      setLoading(true)
      try {
        // Obtenemos todos los productos y buscamos por slug generado del nombre
        const { data, error } = await supabase
          .from('products')
          .select(
            `
            *,
            categories (name),
            brands (name)
          `,
          )

        if (error) throw error

        // Encontrar el producto cuyo slug coincide con la URL
        const match = data?.find(
          (item) => generateSlug(item.name) === slug,
        )

        if (match) {
          setProduct({
            id: match.id,
            name: match.name,
            description: match.description,
            longDescription: match.long_description,
            category: match.categories?.name || 'General',
            categorySlug: generateSlug(
              match.categories?.name || 'General',
            ),
            brand: match.brands?.name || 'Varios',
            image: match.image_url,
            images: match.images_gallery || [match.image_url],
            features: match.features || [],
            benefits: match.benefits || [],
            specifications: match.specifications || [],
            workMaterials: match.work_materials || [],
            rating: match.rating,
          })
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  useEffect(() => {
    if (!product || product.images.length <= 1) return

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % product.images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [product, selectedImage])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-matheo-blue animate-spin mb-4" />
        <p className="text-gray-500 font-medium">
          Cargando detalles del producto...
        </p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Producto no encontrado
          </h1>
          <Link
            href={'/productos'}
            className="text-matheo-blue hover:underline"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  const handleWhatsAppQuote = () => {
    const currentImage = product.images[selectedImage]
    const message = encodeURIComponent(
      `${currentImage}\n\n*${product.name.toUpperCase()}*\n\nHola , quisiera cotizar su producto`,
    )
    const phoneNumber = '51922922766'
    window.open(
      `https://wa.me/${phoneNumber}?text=${message}`,
      '_blank',
    )
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setSelectedImage(
      (prev) =>
        (prev - 1 + product.images.length) % product.images.length,
    )
  }

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-40 pb-20">
      {/* ── SEO Meta Tags ── */}
      <SEOHead
        title={product.name}
        description={
          product.description
            ? `${product.description.slice(0, 155)}...`
            : `${product.name} — Herramienta industrial de precisión. Importador y distribuidor en Perú. Cotiza al instante por WhatsApp.`
        }
        canonical={pathname}
        image={product.image}
        ogType="product"
        keywords={`${product.name}, ${product.category}, ${product.brand}, herramientas industriales Perú`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description:
            product.description ||
            `Herramienta industrial ${product.name}`,
          image: product.images,
          brand: {
            '@type': 'Brand',
            name: product.brand,
          },
          category: product.category,
          aggregateRating: product.rating
            ? {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                bestRating: 5,
                worstRating: 1,
                ratingCount: 24,
              }
            : undefined,
          offers: {
            '@type': 'Offer',
            url: `https://industrialcompanymatheo.com${pathname}`,
            priceCurrency: 'PEN',
            price: '0.00', // Marcador por defecto, modificar si guardan precio real
            availability: 'https://schema.org/InStock',
            seller: {
              '@type': 'Organization',
              name: 'Industrial Company MATHEO EIRL',
            },
          },
        }}
      />
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-8 hidden md:block">
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500 font-medium">
            <Link
              href={'/'}
              className="text-matheo-blue hover:underline transition-colors"
            >
              Inicio
            </Link>
            <span className="text-gray-400">›</span>
            <Link
              href={'/productos'}
              className="text-matheo-blue hover:underline transition-colors"
            >
              Productos
            </Link>
            <span className="text-gray-400">›</span>
            <Link
              href={`/productos/${categoria}`}
              className="text-matheo-blue hover:underline transition-colors"
            >
              {product.category}
            </Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-400 truncate">
              {product.name}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Column: Image Gallery */}
          <div className="space-y-6 lg:sticky lg:top-40 h-fit max-w-lg mx-auto lg:max-w-none w-full">
            <div className="relative group bg-white rounded-2xl p-4 md:p-8 aspect-square flex items-center justify-center overflow-hidden shadow-sm">
              <img
                key={selectedImage}
                src={product.images[selectedImage]}
                alt={product.name}
                className="max-w-full max-h-full object-contain transition-all duration-500 group-hover:scale-105 animate-in fade-in "
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      prevImage()
                    }}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-gray-900 bg-white/80 hover:bg-white rounded-full shadow-md transition-all z-10"
                  >
                    <ChevronLeft size={32} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-gray-900 bg-white/80 hover:bg-white rounded-full shadow-md transition-all z-10"
                  >
                    <ChevronRight size={32} strokeWidth={1.5} />
                  </button>
                </>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-4 justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      'w-20 h-20 rounded-xl border-2 p-2 transition-all overflow-hidden bg-white',
                      selectedImage === idx
                        ? 'border-matheo-blue shadow-md'
                        : 'border-gray-100 opacity-60 hover:opacity-100',
                    )}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info & Details */}
          <div className="flex flex-col">
            <div className="flex gap-8 border-b-2 border-gray-100 mb-8">
              <button
                onClick={() => setActiveTab('info')}
                className={cn(
                  'pb-4 text-sm font-bold transition-all relative',
                  activeTab === 'info'
                    ? 'text-gray-900'
                    : 'text-gray-400',
                )}
              >
                Información
                {activeTab === 'info' && (
                  <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gray-900" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={cn(
                  'pb-4 text-sm font-bold transition-all relative',
                  activeTab === 'specs'
                    ? 'text-gray-900'
                    : 'text-gray-400',
                )}
              >
                Detalles técnicos
                {activeTab === 'specs' && (
                  <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gray-900" />
                )}
              </button>
            </div>

            {activeTab === 'info' ? (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight uppercase">
                  {product.name}
                </h1>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => {
                    const ratingValue = product.rating || 5
                    const fillAmount = Math.min(
                      Math.max(ratingValue - i, 0),
                      1,
                    )

                    return (
                      <div key={i} className="relative">
                        <svg
                          className="w-5 h-5 text-gray-200 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {fillAmount > 0 && (
                          <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${fillAmount * 100}%` }}
                          >
                            <svg
                              className="w-5 h-5 text-yellow-500 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  <span className="text-sm font-black text-gray-600 ml-2">
                    {product.rating
                      ? product.rating.toFixed(1)
                      : '5.0'}
                  </span>
                </div>

                <p className="text-gray-600 text-sm md:text-base mb-8 leading-relaxed">
                  {product.description}
                </p>

                <div className="space-y-3 mb-10">
                  {product.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3"
                    >
                      <div className="bg-green-100 p-0.5 rounded-full">
                        <CheckCircle2
                          className="text-green-600"
                          size={16}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-700">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleWhatsAppQuote}
                  className="w-full md:w-fit bg-[#245e56] hover:bg-[#1b4a44] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-sm"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Cotizar precio
                </button>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="rounded-xl border border-gray-100 overflow-hidden mb-8">
                  {product.specifications.map((spec, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'grid grid-cols-2 gap-4 p-4 text-sm',
                        idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white',
                      )}
                    >
                      <span className="font-bold text-gray-900">
                        {spec.label}
                      </span>
                      <span className="text-gray-600">
                        {spec.value}
                      </span>
                    </div>
                  ))}

                  {product.workMaterials &&
                    product.workMaterials.length > 0 && (
                      <div
                        className={cn(
                          'grid grid-cols-2 gap-4 p-4 text-sm border-t border-gray-100',
                          product.specifications.length % 2 === 0
                            ? 'bg-gray-50/50'
                            : 'bg-white',
                        )}
                      >
                        <span className="font-bold text-gray-900 self-center">
                          Trabaja
                        </span>
                        <div className="flex gap-2 flex-wrap">
                          {[
                            {
                              char: 'P',
                              color: '#1e40af',
                              textColor: 'text-white',
                            },
                            {
                              char: 'M',
                              color: '#facc15',
                              textColor: 'text-gray-900',
                            },
                            {
                              char: 'K',
                              color: '#dc2626',
                              textColor: 'text-white',
                            },
                            {
                              char: 'N',
                              color: '#16a34a',
                              textColor: 'text-white',
                            },
                            {
                              char: 'S',
                              color: '#f77d0cff',
                              textColor: 'text-white',
                            },
                            {
                              char: 'H',
                              color: '#4b5563',
                              textColor: 'text-white',
                            },
                          ].map((m) => {
                            const isActive =
                              product.workMaterials?.includes(m.char)
                            return (
                              <div
                                key={m.char}
                                className={cn(
                                  'flex flex-col w-9 border rounded-md overflow-hidden transition-all duration-300',
                                  isActive
                                    ? 'border-gray-400 shadow-sm'
                                    : 'border-gray-200 opacity-40 grayscale-[0.5]',
                                )}
                              >
                                <div
                                  style={{ backgroundColor: m.color }}
                                  className={cn(
                                    'h-7 flex items-center justify-center font-black text-sm',
                                    m.textColor,
                                  )}
                                >
                                  {m.char}
                                </div>
                                <div className="h-6 bg-white flex items-center justify-center">
                                  {isActive && (
                                    <div className="w-2 h-2 rounded-full bg-gray-900 shadow-inner" />
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                </div>

                <button
                  onClick={handleWhatsAppQuote}
                  className="w-full md:w-fit bg-[#245e56] hover:bg-[#1b4a44] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-sm"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Cotizar precio
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
