'use client'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { generateSlug } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface ParentCategory {
  id: string
  name: string
  image_url: string | null
}

export default function CategoryProducts() {
  const [categories, setCategories] = useState<ParentCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsToShow, setItemsToShow] = useState(6)

  useEffect(() => {
    async function fetchParentCategories() {
      try {
        const { data: allCats } = await supabase
          .from('categories')
          .select('id, name, parent_id, image_url')
          .order('name')

        if (allCats) {
          const subcatNames = new Set(
            allCats.filter((c) => c.parent_id).map((c) => c.name),
          )
          const parents = allCats
            .filter((c) => !subcatNames.has(c.name))
            .map((c) => ({
              id: c.id,
              name: c.name,
              image_url: c.image_url || null,
            }))
          setCategories(parents)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchParentCategories()
  }, [])

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth
      let newItemsToShow
      if (width < 640) newItemsToShow = 2
      else if (width < 768) newItemsToShow = 3
      else if (width < 1024) newItemsToShow = 4
      else newItemsToShow = 6
      setItemsToShow((prev) => {
        if (prev !== newItemsToShow) {
          setCurrentIndex(0)
        }
        return newItemsToShow
      })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, categories.length - itemsToShow)
  const slideWidth = 100 / itemsToShow

  const prev = () => setCurrentIndex((p) => Math.max(0, p - 1))
  const next = () => setCurrentIndex((p) => Math.min(maxIndex, p + 1))

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-matheo-blue mb-3">
              Nuestras Categorías
            </h2>
            <p className="text-base md:text-xl text-gray-600">
              Explora nuestras líneas de productos.
            </p>
          </div>
          <div className="flex gap-6 justify-center max-w-5xl mx-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex-1 max-w-48">
                <div className="aspect-square rounded-full bg-gray-100 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded animate-pulse mt-4 mx-6" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) return null

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-matheo-blue mb-3">
            Nuestras Categorías
          </h2>
          <p className="text-base md:text-xl text-gray-600">
            Explora nuestras líneas de productos.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {categories.length > itemsToShow && currentIndex > 0 && (
            <button
              onClick={prev}
              className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white hover:border-matheo-blue transition-all"
              aria-label="Anterior"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {categories.length > itemsToShow && currentIndex < maxIndex && (
            <button
              onClick={next}
              className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white hover:border-matheo-blue transition-all"
              aria-label="Siguiente"
            >
              <ChevronRight size={22} />
            </button>
          )}

          <div className="overflow-hidden px-1">
            <div
              className="flex transition-transform duration-500 ease-out will-change-transform"
              style={{ transform: `translateX(-${currentIndex * slideWidth}%)` }}
            >
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="shrink-0 px-2 md:px-3"
                  style={{ flex: `0 0 ${slideWidth}%` }}
                >
                  <Link
                    href={`/productos/${generateSlug(cat.name)}`}
                    className="group block"
                  >
                    <div className="aspect-square rounded-full bg-gray-50 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ring-1 ring-gray-100 hover:ring-matheo-blue/30">
                      {cat.image_url ? (
                        <Image
                          src={cat.image_url}
                          alt={cat.name}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <span className="text-gray-300 text-5xl md:text-6xl font-bold uppercase select-none flex items-center justify-center h-full">
                          {cat.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-center font-bold text-matheo-blue text-xs md:text-sm lg:text-base uppercase tracking-wide mt-3 md:mt-4 group-hover:text-matheo-red transition-colors leading-tight px-1">
                      {cat.name}
                    </h3>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {categories.length > itemsToShow && (
            <div className="flex justify-center gap-1.5 mt-6 md:mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? 'w-6 bg-matheo-blue'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir al grupo ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
