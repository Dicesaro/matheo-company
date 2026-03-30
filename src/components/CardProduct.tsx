'use client'
import { Eye } from 'lucide-react'
import Link from 'next/link'
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

export default function CardProduct({
  product,
  viewMode,
  onWhatsAppQuote,
}: CardProductProps) {
  const handleWhatsAppQuote = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onWhatsAppQuote?.(product)
  }

  return (
    <div
      key={product.id}
      className={cn(
        'bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group',
        // Móvil: siempre flex-row (horizontal)
        // ≥sm y viewMode grid: flex-col (vertical normal)
        // list en cualquier tamaño: flex-row
        viewMode === 'grid'
          ? 'flex flex-row sm:flex-col'
          : 'flex flex-row p-4 gap-4',
      )}
    >
      {/* Imagen */}
      <div
        className={cn(
          'relative flex items-center justify-center bg-gray-50/50 shrink-0',
          viewMode === 'grid'
            ? // Móvil horizontal: cuadrado fijo a la izquierda
              'w-[130px] sm:w-full aspect-square p-3 sm:p-4'
            : 'w-1/3 md:w-2/5 aspect-square rounded-xl',
        )}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src =
              'https://via.placeholder.com/300?text=Sin+Imagen'
          }}
        />
        {/* Eye icon */}
        <Link
          href={`/producto/${product.categorySlug}/${product.slug}`}
          className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-[#2B5F9E] text-white hover:shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
          aria-label="Ver detalles"
          title="Ver detalles"
          onClick={(e) => e.stopPropagation()}
        >
          <Eye
            className="text-[#2B5F9E] hover:text-white"
            size={17}
            strokeWidth={2.5}
          />
        </Link>
      </div>

      {/* Contenido */}
      <div
        className={cn(
          'flex flex-col flex-1 min-w-0',
          viewMode === 'grid'
            ? // Móvil: padding pequeño alineado a la izquierda
              // ≥sm: padding normal centrado
              'p-3 sm:p-4 text-left sm:text-center justify-center'
            : 'justify-center text-center py-2',
        )}
      >
        {/* Rating Stars */}
        <div
          className={cn(
            'flex items-center gap-1 mb-2',
            viewMode === 'grid'
              ? 'justify-start sm:justify-center'
              : 'justify-center',
          )}
        >
          {[...Array(5)].map((_, i) => {
            const rating = product.rating || 5
            const fillAmount = Math.min(Math.max(rating - i, 0), 1)

            return (
              <div key={i} className="relative">
                <svg
                  className="w-4 h-4 text-gray-200 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {fillAmount > 0 && (
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      width: `${fillAmount * 100}%`,
                    }}
                  >
                    <svg
                      className="w-4 h-4 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Nombre del producto */}
        <div className="mb-3">
          <h3
            className={cn(
              'font-bold text-gray-800 uppercase line-clamp-3 leading-tight',
              viewMode === 'grid'
                ? 'text-[13px] text-left sm:text-center'
                : 'text-sm md:text-base text-left',
            )}
          >
            {product.name}
          </h3>
        </div>

        {/* Botones */}
        <div className="space-y-2 mt-auto">
          <Link
            href={`/producto/${product.categorySlug}/${product.slug}`}
            className="w-full bg-matheo-blue hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold text-xs md:text-sm transition-all transform hover:scale-[1.02] block text-center shadow-sm"
          >
            Ver Detalles
          </Link>
          <button
            onClick={handleWhatsAppQuote}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-sm"
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
    </div>
  )
}
