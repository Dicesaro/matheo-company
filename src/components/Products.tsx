'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useInView } from 'react-intersection-observer'

const categories = [
  {
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779138841/Frame_827_puprs5.png',
    href: '/productos/herramientas-para-torneado/insertos-para-torneado',
  },
  {
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779138840/Frame_826_sj1fvu.png',
    href: '/productos/herramientas-para-torneado/portainsertos-para-tornear',
  },
  {
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779138840/Frame_824_nx0gax.png',
    href: ' /productos/herramientas-de-taladrado/brocas',
  },
  {
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779138840/Frame_825_nx4c1z.png',
    href: '/productos/herramientas-de-fresado/fresas-rotativas',
  },
  {
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779332029/INSERTOS_PARA_TALADRADO_fongff.png',
    href: '/productos/herramientas-de-taladrado/insertos-para-taladrado',
  },
  {
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779332264/BROCAS_CORONA_nuz0fj.png',
    href: '/productos/herramientas-de-taladrado/brocas-corona',
  },
  {
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779332266/INSERTOS_PARA_ROSCAR_eix0cs.png',
    href: '/productos/herramientas-de-roscado/insertos-para-roscado',
  },
  {
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779332265/DISCOS_NORTON_lnludl.png',
    href: '/productos/abrasivos/discos',
  },
  {
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779332266/INSERTOS_PARA_PLANEADO_z4yrgb.png',
    href: '/productos/herramientas-para-torneado/insertos-para-planeado',
  },
  {
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779332266/BROCAS_CON_INSERTO_dxi7xs.png',
    href: '/productos/herramientas-de-taladrado/brocas-con-inserto',
  },
]

export default function FeaturedProducts() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsToShow, setItemsToShow] = useState(4)

  const { ref: sectionRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsToShow(1)
      else setItemsToShow(4)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const max = Math.max(0, categories.length - itemsToShow)
        return prev >= max ? 0 : prev + 1
      })
    }, 3000)
    return () => clearInterval(timer)
  }, [itemsToShow])

  const maxIndex = Math.max(0, categories.length - itemsToShow)

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  return (
    <section
      id="productos-destacados"
      ref={sectionRef}
      className="py-16 md:py-20 bg-linear-to-b from-white to-gray-50 overflow-hidden"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-matheo-blue mb-3 flex items-center justify-center gap-3">   
              Productos Destacados
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl">
              Explora nuestras categorías más populares.
            </p>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <button
            onClick={prevSlide}
            className="absolute -left-3 md:-left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-12 md:h-12 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white hover:border-matheo-blue transition-all"
            aria-label="Anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute -right-3 md:-right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-12 md:h-12 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white hover:border-matheo-blue transition-all"
            aria-label="Siguiente"
          >
            <ChevronRight size={18} />
          </button>

          <div className="overflow-hidden mx-4 md:mx-0">
            <div
              className="flex transition-transform duration-500 ease-out will-change-transform"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
              }}
            >
              {categories.map((cat, i) => (
                <div
                  key={i}
                  className="shrink-0 px-2 md:px-3"
                  style={{ width: `${100 / itemsToShow}%` }}
                >
                  <Link
                    href={cat.href}
                    className="group block overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <Image
                      src={cat.image}
                      alt=""
                      width={400}
                      height={400}
                      className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Dots mobile */}
          <div className="flex md:hidden justify-center gap-1.5 mt-5">
            {Array.from({
              length: categories.length - itemsToShow + 1,
            }).map((_, index) => (
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

        {/* Ver todos */}
        <div className="text-center mt-10 md:mt-12">
          <Link
            href="/productos"
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
