'use client'
import { Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '../lib/utils'

interface Product {
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

interface CardProductProps {
  product: Product
  viewMode: 'grid' | 'list'
  onWhatsAppQuote?: (product: Product) => void
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

export default function CardProduct({
  product,
  viewMode,
  onWhatsAppQuote,
}: CardProductProps) {
  const [isFavorite, setIsFavorite] = useState(() =>
    getFavorites().includes(product.id),
  )

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const favorites = getFavorites()
    let updated: string[]
    if (favorites.includes(product.id)) {
      updated = favorites.filter((id) => id !== product.id)
    } else {
      updated = [...favorites, product.id]
    }
    localStorage.setItem('favorites', JSON.stringify(updated))
    setIsFavorite(!isFavorite)
  }

  const handleWhatsAppQuote = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onWhatsAppQuote?.(product)
  }

  const productUrl = `/producto/${product.categorySlug}/${product.slug}`
  const categoryUrl = `/productos/${product.categorySlug}`
  const router = useRouter()

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(categoryUrl)
  }

  return (
    <Link
      key={product.id}
      href={productUrl}
      className={cn(
        'bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer',
        viewMode === 'grid'
          ? 'flex flex-col h-full'
          : 'flex flex-row p-4 gap-4',
      )}
    >
      {/* Imagen */}
      <div
        className={cn(
          'relative flex items-center justify-center bg-gray-50/50 shrink-0',
          viewMode === 'grid'
            ? 'w-full aspect-square'
            : 'w-1/3 md:w-2/5 aspect-square rounded-xl',
        )}
      >
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          loading="eager"
          className="object-contain group-hover:scale-105 transition-transform duration-500"
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src =
              'https://placehold.co/300x300?text=Sin+Imagen'
          }}
        />
        {/* Star button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:shadow-lg transition-all duration-300 z-10"
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Star
            size={17}
            strokeWidth={2.5}
            className={cn(
              'transition-colors duration-300',
              isFavorite
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-400 hover:text-yellow-400',
            )}
          />
        </button>
      </div>

      {/* Contenido */}
      <div
        className={cn(
          'flex flex-col flex-1 min-w-0',
          viewMode === 'grid'
            ? 'p-3 sm:p-4 text-left'
            : 'justify-center py-2',
        )}
      >
        {/* Categoria */}
        <div className="mb-1.5">
          <span
            onClick={handleCategoryClick}
            className="text-[11px] font-bold text-matheo-blue uppercase tracking-wider hover:underline cursor-pointer"
          >
            {product.category}
          </span>
        </div>

        {/* Marca */}
        {product.brand && (
          <div className="mb-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              {product.brand}
            </span>
          </div>
        )}

        {/* Nombre del producto */}
        <div className="mb-3">
          <h3
            className={cn(
              'text-gray-800 font-semibold leading-tight line-clamp-2',
              viewMode === 'grid'
                ? 'text-[13px] text-left'
                : 'text-sm md:text-base text-left',
            )}
          >
            {product.name}
          </h3>
        </div>

        {/* Botones */}
        <div className="mt-auto" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleWhatsAppQuote}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-sm cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Cotizar
          </button>
        </div>
      </div>
    </Link>
  )
}
