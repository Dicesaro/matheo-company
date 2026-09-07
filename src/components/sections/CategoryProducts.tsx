'use client'
import { useEffect, useRef, useState } from 'react'
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
      }
    }
    fetchParentCategories()
  }, [])

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth
      let newItemsToShow
      if (width < 640) newItemsToShow = 4
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

  const touchStartX = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    const threshold = 50
    if (deltaX < -threshold) next()
    else if (deltaX > threshold) prev()
  }

  if (categories.length === 0) return null

  return (
    <section className="relative z-20 mt-2 md:-mt-8 md:pb-10 pointer-events-none">
      <div className="container mx-auto px-4 pointer-events-auto">
        <div className="relative max-w-6xl mx-auto">
          {categories.length > itemsToShow && currentIndex > 0 && (
            <button
              onClick={prev}
              className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-200 hidden min-[920px]:flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white hover:border-matheo-blue transition-all"
              aria-label="Anterior"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {categories.length > itemsToShow &&
            currentIndex < maxIndex && (
              <button
                onClick={next}
                className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-200 hidden min-[920px]:flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white hover:border-matheo-blue transition-all"
                aria-label="Siguiente"
              >
                <ChevronRight size={22} />
              </button>
            )}

          <div
            className="overflow-hidden px-1"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform ease-linear will-change-transform"
              style={{
                transform: `translateX(-${currentIndex * slideWidth}%)`,
              }}
            >
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="shrink-0 px-1.5 sm:px-2 md:px-3"
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
                        <span className="text-gray-300 text-4xl sm:text-5xl md:text-6xl font-bold uppercase select-none flex items-center justify-center h-full">
                          {cat.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-center font-bold text-matheo-blue text-[8px] md:text-sm lg:text-sm uppercase tracking-wide mt-3 md:mt-4 group-hover:text-matheo-red transition-colors leading-tight flex items-center justify-center min-h-8 line-clamp-2 wrap-break-words px-1">
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
