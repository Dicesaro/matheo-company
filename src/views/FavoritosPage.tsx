'use client'
import { useState, useEffect } from 'react'
import { Star, Heart, ShoppingBag, ArrowLeft } from 'lucide-react'
import { generateSlug } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  slug: string
  categorySlug: string
  name: string
  category: string
  brand: string
  image: string
  description: string
}

interface RawProduct {
  id: string
  name: string
  description: string
  image_url: string
  categories?: { name: string } | null
  brands?: { name: string } | null
}

function getFavorites(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem('favorites')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export default function FavoritosPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const ids = getFavorites()
    setFavorites(ids)

    if (ids.length === 0) {
      setLoading(false)
      return
    }

    async function fetchFavorites() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            description,
            image_url,
            categories (name),
            brands (name)
          `)
          .in('id', ids)

        if (error) throw error

        if (data) {
          const formatted = (data as unknown as RawProduct[]).map(
            (p) => ({
              id: p.id,
              slug: generateSlug(p.name),
              categorySlug: generateSlug(
                p.categories?.name || 'General',
              ),
              name: p.name,
              description: p.description,
              image: p.image_url,
              category: p.categories?.name || 'General',
              brand: p.brands?.name || 'Varios',
            }),
          )
          setProducts(formatted)
        }
      } catch (error) {
        console.error('Error fetching favorites:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  const removeFavorite = (id: string) => {
    const updated = favorites.filter((fid) => fid !== id)
    localStorage.setItem('favorites', JSON.stringify(updated))
    setFavorites(updated)
    setProducts((prev) => prev.filter((p) => p.id !== id))
    window.dispatchEvent(new Event('favoritesUpdated'))
  }

  const handleWhatsAppQuote = (product: Product) => {
    const message = encodeURIComponent(
      `${product.image}\n\n*${product.name.toUpperCase()}*\n\nHola , quisiera cotizar su producto`,
    )
    window.open(
      `https://wa.me/51922922766?text=${message}`,
      '_blank',
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      <div className="container mx-auto px-4 pt-8">    
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col animate-pulse"
              >
                <div className="w-full aspect-square bg-gray-200 shrink-0 rounded-t-2xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-9 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
            <Star size={64} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Sin favoritos aún
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Guarda tus productos favoritos haciendo clic en la estrella que aparece en cada producto
            </p>
            <button
              onClick={() => router.push('/productos')}
              className="inline-flex items-center gap-2 bg-matheo-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              <ShoppingBag size={18} />
              Explorar productos
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-500 font-medium mb-6">
              <span className="text-matheo-red font-bold">{products.length}</span> producto{products.length !== 1 ? 's' : ''} guardado{products.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
                >
                  <Link
                    href={`/producto/${product.categorySlug}/${product.slug}`}
                    className="relative w-full aspect-square bg-gray-50/50 flex items-center justify-center"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="object-contain group-hover:scale-105 transition-transform duration-500"
                      style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://placehold.co/300x300?text=Sin+Imagen'
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        removeFavorite(product.id)
                      }}
                      className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:shadow-lg transition-all z-10 text-matheo-red"
                      aria-label="Quitar de favoritos"
                    >
                      <Star size={17} strokeWidth={2.5} fill="currentColor" />
                    </button>
                  </Link>

                  <div className="flex flex-col flex-1 p-3 sm:p-4">
                    <Link href={`/producto/${product.categorySlug}/${product.slug}`}>
                      <h3 className="text-[13px] text-gray-800 font-bold leading-tight line-clamp-2 mb-3">
                        {product.name}
                      </h3>
                    </Link>

                    <Link
                      href={`/productos/${product.categorySlug}`}
                      className="text-[11px] font-semibold text-matheo-blue uppercase tracking-wider hover:underline mb-1"
                    >
                      {product.category}
                    </Link>

                    {product.brand && (
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        {product.brand}
                      </span>
                    )}

                    <div className="mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleWhatsAppQuote(product)
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-sm cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Pedir Ahora
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
