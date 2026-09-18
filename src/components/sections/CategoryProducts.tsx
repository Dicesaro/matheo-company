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
  const scrollRef = useRef<HTMLDivElement>(null)

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

  const scrollByAmount = (direction: 1 | -1) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  if (categories.length === 0) return null

  return (
    <section className="relative z-20 mt-2 md:-mt-8 md:pb-10 pointer-events-none">
      <div className="container mx-auto px-4 pointer-events-auto">
        <div className="relative max-w-6xl mx-auto">
          <button
            onClick={() => scrollByAmount(-1)}
            className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-200 hidden min-[920px]:flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white hover:border-matheo-blue transition-all"
            aria-label="Anterior"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={() => scrollByAmount(1)}
            className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-200 hidden min-[920px]:flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white hover:border-matheo-blue transition-all"
            aria-label="Siguiente"
          >
            <ChevronRight size={22} />
          </button>

          <div ref={scrollRef} className="overflow-x-auto no-scrollbar">
            <div className="flex min-w-max">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="shrink-0 w-24 sm:w-28 md:w-36 lg:w-44 px-1.5 sm:px-2 md:px-3"
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
        </div>
      </div>
    </section>
  )
}