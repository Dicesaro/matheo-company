'use client'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { generateSlug } from '../lib/utils'
import { supabase } from '../lib/supabase'

const categoryImages: Record<string, string> = {
  Abrasivos: 'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779142672/Gemini_Generated_Image_mddeymddeymddeym_cva2rm.png',
  'Herramientas de Fresado': 'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779143127/Gemini_Generated_Image_njqjlpnjqjlpnjqj_bnaivs.png',
  'Herramientas de Roscado': 'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779143464/HERRAMIENTAS_DE_ROSCADO_jkyihi.png',
  'Herramientas de Sujeción': 'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779144016/HERRAMIENTAS_DE_SUJECION_cgnhby.png',
  'Herramientas de Taladrado': 'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779144394/Gemini_Generated_Image_vqr2dpvqr2dpvqr2_dtwjfv.png',
  'Herramientas para Torneado': 'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779144544/HERRAMIENTAS_DE_TORNEAR_r06qng.png',
  Soldadura: 'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779144885/SOLDADURA_qxvr8r.png',
}

interface ParentCategory {
  id: string
  name: string
}

export default function CategoryProducts() {
  const [categories, setCategories] = useState<ParentCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    async function fetchParentCategories() {
      try {
        const { data: allCats } = await supabase
          .from('categories')
          .select('id, name, parent_id')
          .order('name')

        if (allCats) {
          const subcatNames = new Set(
            allCats.filter((c) => c.parent_id).map((c) => c.name),
          )
          const parents = allCats
            .filter((c) => !subcatNames.has(c.name))
            .map((c) => ({ id: c.id, name: c.name }))
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

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? categories.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= categories.length - 1 ? 0 : prev + 1))
  }

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-matheo-blue mb-3">
              Productos por Categoría
            </h2>
            <p className="text-base md:text-xl text-gray-600">
              Explora nuestras líneas de productos.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-xl animate-pulse h-64"
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) return null

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-matheo-blue mb-3">
            Productos por Categoría
          </h2>
          <p className="text-base md:text-xl text-gray-600">
            Explora nuestras líneas de productos.
          </p>
        </div>

        {isMobile ? (
          /* ── Mobile Carousel ── */
          <div className="relative">
            <button
              onClick={prevSlide}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white hover:border-matheo-blue transition-all"
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white hover:border-matheo-blue transition-all"
              aria-label="Siguiente"
            >
              <ChevronRight size={18} />
            </button>

            <div className="overflow-hidden mx-4">
              <div
                className="flex transition-transform duration-500 ease-out will-change-transform"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="shrink-0 w-full px-2"
                  >
                    <Link
                      href={`/productos/${generateSlug(cat.name)}`}
                      className="group block bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                        {categoryImages[cat.name] ? (
                          <Image
                            src={categoryImages[cat.name]}
                            alt={cat.name}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <span className="text-gray-300 text-6xl font-bold uppercase select-none">
                            {cat.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="p-4 text-center border-t border-gray-100">
                        <h3 className="font-bold text-matheo-blue text-sm md:text-base uppercase tracking-wide group-hover:text-matheo-red transition-colors">
                          {cat.name}
                        </h3>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-1.5 mt-5">
              {categories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-6 bg-matheo-blue'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir a la categoría ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* ── Desktop Grid ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/productos/${generateSlug(cat.name)}`}
                className="group block bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                  {categoryImages[cat.name] ? (
                    <Image
                      src={categoryImages[cat.name]}
                      alt={cat.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-gray-300 text-6xl font-bold uppercase select-none">
                      {cat.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="p-4 text-center border-t border-gray-100">
                  <h3 className="font-bold text-matheo-blue text-sm md:text-base uppercase tracking-wide group-hover:text-matheo-red transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
