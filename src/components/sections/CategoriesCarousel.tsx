'use client'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { generateSlug } from '@/lib/utils'

interface ChildCategory {
  id: string
  name: string
  image: string | null
}

interface ParentCategory {
  id: string
  name: string
  children: ChildCategory[]
}

export default function CategoriesCarousel({ parents }: { parents: ParentCategory[] }) {
  const [indices, setIndices] = useState<Record<string, number>>({})
  const [itemsToShow, setItemsToShow] = useState(6)

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth
      if (width < 640) setItemsToShow(2)
      else if (width < 768) setItemsToShow(3)
      else if (width < 1024) setItemsToShow(4)
      else setItemsToShow(6)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const prevSlide = (parentName: string) => {
    setIndices((prev) => ({
      ...prev,
      [parentName]: Math.max(0, (prev[parentName] || 0) - 1),
    }))
  }

  const nextSlide = (parentName: string, maxIndex: number) => {
    setIndices((prev) => ({
      ...prev,
      [parentName]: Math.min(maxIndex, (prev[parentName] || 0) + 1),
    }))
  }

  return (
    <div className="space-y-14">
      {parents.map((parent) => {
        const currentIdx = indices[parent.name] || 0
        const maxIndex = Math.max(0, parent.children.length - itemsToShow)
        const slideWidth = 100 / itemsToShow

        return (
          <section key={parent.id}>
            <Link
              href={`/productos/${generateSlug(parent.name)}`}
              className="inline-block mb-4"
            >
              <h2 className="text-2xl font-bold text-matheo-blue hover:text-matheo-red transition-colors">
                {parent.name}
              </h2>
            </Link>

            <div className="relative">
              {parent.children.length > itemsToShow && currentIdx > 0 && (
                <button
                  onClick={() => prevSlide(parent.name)}
                  className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white transition-all"
                  aria-label="Anterior"
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              {parent.children.length > itemsToShow && currentIdx < maxIndex && (
                <button
                  onClick={() => nextSlide(parent.name, maxIndex)}
                  className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white transition-all"
                  aria-label="Siguiente"
                >
                  <ChevronRight size={20} />
                </button>
              )}

              <div className="overflow-hidden px-1">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentIdx * slideWidth}%)` }}
                >
                  {parent.children.map((child) => (
                    <div
                      key={child.id}
                      className="shrink-0 px-2 md:px-3"
                      style={{ flex: `0 0 ${slideWidth}%` }}
                    >
                      <Link
                        href={`/productos/${generateSlug(parent.name)}/${generateSlug(child.name)}`}
                        className="group block"
                      >
                        <div className="aspect-square rounded-full bg-gray-50 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ring-1 ring-gray-100 hover:ring-matheo-blue/30 mt-2">
                          {child.image ? (
                            <Image
                              src={child.image}
                              alt={child.name}
                              width={400}
                              height={400}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <span className="text-gray-300 text-4xl md:text-5xl font-bold uppercase select-none flex items-center justify-center h-full">
                              {child.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <p className="text-center font-bold text-matheo-blue text-xs md:text-sm uppercase tracking-wide mt-3 group-hover:text-matheo-red transition-colors leading-tight px-1">
                          {child.name}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
