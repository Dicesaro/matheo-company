import { useEffect, useRef, useState, useCallback } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Flame,
  //   Loader2,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supabase } from '../lib/supabase'
import { generateSlug } from '../lib/utils'

gsap.registerPlugin(ScrollTrigger)

interface Product {
  id: string
  slug: string
  name: string
  category: string
  image: string
  description: string
  featured: boolean
  rating?: number
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsToShow, setItemsToShow] = useState(4)
  const [isPaused, setIsPaused] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  )

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsToShow(1)
      else if (window.innerWidth < 1024) setItemsToShow(2)
      else setItemsToShow(4)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(
            `
            id,
            name,
            description,
            image_url,
            featured,
            rating,
            categories (name)
          `,
          )
          .order('rating', { ascending: false })
          .limit(12)

        if (error) throw error

        if (data) {
          const formattedProducts = data.map(
            (p: {
              id: string
              name: string
              description: string
              image_url: string
              featured: boolean
              rating: number
              categories: { name: string } | { name: string }[] | null
            }) => ({
              id: p.id,
              slug: generateSlug(p.name),
              name: p.name,
              description: p.description,
              image: p.image_url,
              featured: p.featured,
              rating: p.rating,
              category: Array.isArray(p.categories)
                ? p.categories[0]?.name || 'General'
                : p.categories?.name || 'General',
            }),
          )
          setProducts(formattedProducts)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  useEffect(() => {
    if (loading || !carouselRef.current) return

    const ctx = gsap.context(() => {
      gsap.from(carouselRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [loading])

  const maxIndex = Math.max(0, products.length - itemsToShow)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }, [maxIndex])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1))
  }, [maxIndex])

  // Auto-play every 3 seconds
  useEffect(() => {
    if (loading || products.length === 0 || isPaused) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
        autoPlayRef.current = null
      }
      return
    }

    autoPlayRef.current = setInterval(() => {
      nextSlide()
    }, 3000)

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
        autoPlayRef.current = null
      }
    }
  }, [loading, products.length, isPaused, nextSlide])

  // Ensure we don't scroll past empty space if screen resized
  useEffect(() => {
    if (currentIndex > maxIndex) setCurrentIndex(maxIndex)
  }, [itemsToShow, products.length, maxIndex, currentIndex])

  return (
    <section
      id="productos-destacados"
      ref={sectionRef}
      className="py-16 md:py-20 bg-linear-to-b from-white to-gray-50 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Header - Centered on mobile, row on desktop */}
        <div className="flex flex-col items-center text-center md:flex-row md:justify-between md:items-end md:text-left mb-10 md:mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-matheo-blue mb-3 flex items-center justify-center md:justify-start gap-3">
              Productos Destacados
              <Flame
                className="text-matheo-red animate-pulse"
                size={32}
              />
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl">
              Lo mejor de nuestro catálogo, seleccionado para ti.
            </p>
          </div>

          {/* Arrows - hidden on mobile, shown on md+ */}
          <div className="hidden md:flex gap-2 shrink-0">
            <button
              onClick={() => {
                prevSlide()
                setIsPaused(true)
                setTimeout(() => setIsPaused(false), 5000)
              }}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-matheo-blue hover:text-white hover:border-matheo-blue transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Anterior"
            >
              <ArrowLeft size={24} />
            </button>
            <button
              onClick={() => {
                nextSlide()
                setIsPaused(true)
                setTimeout(() => setIsPaused(false), 5000)
              }}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-matheo-blue hover:text-white hover:border-matheo-blue transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Siguiente"
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="overflow-hidden mx-4 md:mx-0">
            <div className="flex w-full">
              {Array.from({ length: itemsToShow || 4 }).map(
                (_, i) => (
                  <div
                    key={`skeleton-prod-${i}`}
                    className="shrink-0 px-2 md:px-3"
                    style={{ width: `${100 / (itemsToShow || 4)}%` }}
                  >
                    <div
                      className="product-card bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col animate-pulse"
                      style={{ height: '420px' }}
                    >
                      <div className="h-52 md:h-64 bg-gray-200 shrink-0"></div>
                      <div className="p-4 md:p-6 flex flex-col flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="mt-auto h-10 md:h-12 bg-gray-200 rounded-xl w-full"></div>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-inner border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg italic">
              No hay productos destacados en este momento.
            </p>
          </div>
        ) : (
          /* Carousel Container */
          <div
            className="relative"
            ref={carouselRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => {
              setTimeout(() => setIsPaused(false), 3000)
            }}
          >
            {/* Mobile navigation arrows - overlaid on sides */}
            <button
              onClick={() => {
                prevSlide()
                setIsPaused(true)
                setTimeout(() => setIsPaused(false), 5000)
              }}
              className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center text-gray-700 active:bg-matheo-blue active:text-white active:border-matheo-blue transition-all"
              aria-label="Anterior"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => {
                nextSlide()
                setIsPaused(true)
                setTimeout(() => setIsPaused(false), 5000)
              }}
              className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center text-gray-700 active:bg-matheo-blue active:text-white active:border-matheo-blue transition-all"
              aria-label="Siguiente"
            >
              <ArrowRight size={18} />
            </button>

            <div className="overflow-hidden mx-4 md:mx-0">
              <div
                className="flex transition-transform duration-500 ease-out will-change-transform"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
                }}
              >
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="shrink-0 px-2 md:px-3"
                    style={{ width: `${100 / itemsToShow}%` }}
                  >
                    <div className="product-card group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100">
                      {/* Product Image */}
                      <div className="relative h-52 md:h-64 bg-gray-50 overflow-hidden p-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target =
                              e.target as HTMLImageElement
                            target.style.display = 'none'
                            target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-300"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>`
                          }}
                        />
                        {product.featured && (
                          <div className="absolute top-3 right-3 bg-matheo-red text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg z-10">
                            <Flame
                              size={12}
                              className="fill-current"
                            />
                            Top
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4 md:p-6 flex flex-col flex-1">
                        <div className="mb-2">
                          <span className="text-xs font-bold text-matheo-blue uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-md">
                            {product.category}
                          </span>
                        </div>

                        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-10 md:min-h-14 group-hover:text-matheo-red transition-colors">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3 md:mb-4">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-bold text-gray-700">
                            {product.rating || '5.0'}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({Math.floor(Math.random() * 50) + 10}{' '}
                            reviews)
                          </span>
                        </div>

                        <div className="mt-auto">
                          <Link
                            href={`/producto/${generateSlug(product.category)}/${product.slug}`}
                            className="w-full bg-matheo-blue hover:bg-blue-800 text-white py-2.5 md:py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn text-sm md:text-base"
                          >
                            Ver Detalles
                            <ArrowRight
                              size={18}
                              className="group-hover/btn:translate-x-1 transition-transform"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dot indicators for mobile */}
            <div className="flex md:hidden justify-center gap-1.5 mt-5">
              {Array.from({
                length: Math.min(products.length, maxIndex + 1),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    setIsPaused(true)
                    setTimeout(() => setIsPaused(false), 5000)
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-6 bg-matheo-blue'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir al producto ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* View All Button Footer */}
        <div className="text-center mt-10 md:mt-12">
          <Link
            href={'/productos'}
            className="inline-flex items-center justify-center gap-2 text-matheo-blue font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-all border-2 border-transparent hover:border-blue-100"
          >
            Ver todos los productos
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}
