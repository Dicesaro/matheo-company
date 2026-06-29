'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useInView } from 'react-intersection-observer'
import CardProduct from '@/components/sections/products/CardProduct'

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
    href: '/productos/herramientas-de-fresado/fresas-carburadas-rotativas',
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

const carouselItems = [
  {
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1780588617/Fresas_Espiga_Hero_cz49uo.png',
    href: '/productos/fresa-espiga-carburada',
  },
  {
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1780588618/consum_tig_ei4alo.png',
    href: '/productos/consumibles-tig',
  },
  {
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1780588617/perforadores_k5emyn.png',
    href: '/productos/herramientas-de-taladrado',
  },
  {
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1780588618/consum_mig_xzna7w.png',
    href: '/productos/consumibles-mig-mag',
  },
]

interface ProductItem {
  id: string
  name: string
  slug: string
  categorySlug: string
  image: string
  category: string
  brand: string
  description: string
  price?: number
  rating?: number
}

interface FeaturedProductsProps {
  productItems: ProductItem[]
  taladradoItems: ProductItem[]
  insertosItems: ProductItem[]
  fresasCarbuItems: ProductItem[]
}

export default function FeaturedProducts({
  productItems,
  taladradoItems,
  insertosItems,
  fresasCarbuItems,
}: FeaturedProductsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsToShow, setItemsToShow] = useState(4)
  const [currentIndex2, setCurrentIndex2] = useState(0)
  const [itemsToShow2, setItemsToShow2] = useState(3)
  const [currentIdxProd, setCurrentIdxProd] = useState(0)
  const [itemsToShowProd, setItemsToShowProd] = useState(4)
  const [currentIdxTal, setCurrentIdxTal] = useState(0)
  const [itemsToShowTal, setItemsToShowTal] = useState(4)
  const [currentIdxIns, setCurrentIdxIns] = useState(0)
  const [itemsToShowIns, setItemsToShowIns] = useState(4)
  const [currentIdxFresasCarb, setCurrentIdxFresasCarb] = useState(0)
  const [itemsToShowFresasCarb, setItemsToShowFresasCarb] = useState(4)
  const { ref: sectionRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { setItemsToShow(1); setItemsToShow2(1); setItemsToShowProd(1); setItemsToShowTal(1); setItemsToShowIns(1); setItemsToShowFresasCarb(1) }
      else { setItemsToShow(4); setItemsToShow2(3); setItemsToShowProd(4); setItemsToShowTal(4); setItemsToShowIns(4); setItemsToShowFresasCarb(4) }
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
      className="py-8 overflow-hidden"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-matheo-blue mb-4">
        Productos Destacados
      </h2>
      <p className="text-center text-gray-600 text-sm md:text-base max-w-xl mx-auto mb-8">
        Las herramientas más vendidas y mejor calificadas por nuestros
        clientes
      </p>
      <div className="container mx-auto px-4 md:px-20">
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

          <div className="overflow-hidden mx-4 md:mx-0 ">
            <div
              className="flex transition-transform duration-500 ease-out will-change-transform "
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
                    className="group relative block overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl"
                  >
                    <Image
                      src={cat.image}
                      alt=""
                      width={400}
                      height={400}
                      className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-white text-matheo-blue font-bold text-sm px-5 py-2 rounded-full shadow-lg hover:bg-matheo-blue hover:text-white transition-colors">
                        Ver más
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Dots mobile */}
          <div className="flex md:hidden justify-center gap-1.5 mt-3">
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
      </div>

      {/* ── Second Carousel (2 columns) ── */}
      <div className="container mx-auto px-4 mt-8 md:px-20">
        <div className="relative">
          <button
            onClick={() =>
              setCurrentIndex2((prev) =>
                prev <= 0
                  ? Math.max(0, carouselItems.length - itemsToShow2)
                  : prev - 1,
              )
            }
            className="absolute -left-3 md:-left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-12 md:h-12 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white hover:border-matheo-blue transition-all"
            aria-label="Anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() =>
              setCurrentIndex2((prev) =>
                prev >=
                Math.max(0, carouselItems.length - itemsToShow2)
                  ? 0
                  : prev + 1,
              )
            }
            className="absolute -right-3 md:-right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-12 md:h-12 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white hover:border-matheo-blue transition-all"
            aria-label="Siguiente"
          >
            <ChevronRight size={18} />
          </button>

          <div className="overflow-hidden mx-4 md:mx-0">
            <div
              className="flex transition-transform duration-500 ease-out will-change-transform"
              style={{
                transform: `translateX(-${currentIndex2 * (100 / itemsToShow2)}%)`,
              }}
            >
              {carouselItems.map((item, i) => (
                <div
                  key={i}
                  className="shrink-0 px-2 md:px-3"
                  style={{ width: `${100 / itemsToShow2}%` }}
                >
                  <Link
                    href={item.href}
                    className="group relative block overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl"
                  >
                    <Image
                      src={item.image}
                      alt=""
                      width={600}
                      height={400}
                      className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-white text-matheo-blue font-bold text-sm px-5 py-2 rounded-full shadow-lg hover:bg-matheo-blue hover:text-white transition-colors">
                        Ver más
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Dots mobile */}
          <div className="flex md:hidden justify-center gap-1.5 mt-3">
            {Array.from({
              length: carouselItems.length - itemsToShow2 + 1,
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex2(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex2
                    ? 'w-6 bg-matheo-blue'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir al grupo ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Product Cards Carousel ── */}
      {productItems.length > 0 && (
        <section className="bg-white py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-20">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/4">
                <div className="flex flex-row md:flex-col items-center justify-center md:justify-start gap-3 md:gap-4 mb-4 md:mb-0">
                  <div className="w-12 h-12 md:w-24 md:h-24 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                    <Image
                      src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1780695165/image-removebg-preview_12_h9k0vl.png"
                      alt="Fresas"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-base md:text-xl font-bold text-matheo-blue uppercase text-center">
                    Fresas
                  </h3>
                  <Link
                    href="/productos/herramientas-de-fresado/fresas-rotativas"
                    className="bg-matheo-red text-white font-semibold px-4 py-1.5 md:px-6 md:py-2.5 rounded-full hover:bg-matheo-red/90 transition-colors shadow-md text-xs md:text-base whitespace-nowrap"
                  >
                    Ver todo
                  </Link>
                </div>
              </div>

              <div className="w-full md:w-3/4 relative">
                <button
                  onClick={() =>
                    setCurrentIdxProd((prev) =>
                      prev <= 0
                        ? Math.max(
                            0,
                            productItems.length - itemsToShowProd,
                          )
                        : prev - 1,
                    )
                  }
                  className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white transition-all"
                  aria-label="Anterior"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() =>
                    setCurrentIdxProd((prev) =>
                      prev >=
                      Math.max(
                        0,
                        productItems.length - itemsToShowProd,
                      )
                        ? 0
                        : prev + 1,
                    )
                  }
                  className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white transition-all"
                  aria-label="Siguiente"
                >
                  <ChevronRight size={18} />
                </button>

                <div className="overflow-hidden mx-4 md:mx-0">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(-${currentIdxProd * (100 / itemsToShowProd)}%)`,
                    }}
                  >
                    {productItems.map((p) => (
                      <div
                        key={p.id}
                        className="shrink-0 px-2"
                        style={{ width: `${100 / itemsToShowProd}%` }}
                      >
                        <CardProduct product={p} viewMode="grid" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Product Cards Carousel: Herramientas de Taladrado ── */}
      {taladradoItems.length > 0 && (
        <section className="bg-white py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-20">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/4">
                <div className="flex flex-row md:flex-col items-center justify-center md:justify-start gap-3 md:gap-4 mb-4 md:mb-0">
                  <div className="w-12 h-12 md:w-24 md:h-24 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                    <Image
                      src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1780695162/CNC-drilling-2-1024x806_fg4kuc.jpg"
                      alt="Taladrado"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-base md:text-xl font-bold text-matheo-blue uppercase text-center">
                    Taladrado
                  </h3>
                  <Link
                    href="/productos/herramientas-de-taladrado"
                    className="bg-matheo-red text-white font-semibold px-4 py-1.5 md:px-6 md:py-2.5 rounded-full hover:bg-matheo-red/90 transition-colors shadow-md text-xs md:text-base whitespace-nowrap"
                  >
                    Ver todo
                  </Link>
                </div>
              </div>

              <div className="w-full md:w-3/4 relative">
                <button
                  onClick={() =>
                    setCurrentIdxTal((prev) =>
                      prev <= 0
                        ? Math.max(
                            0,
                            taladradoItems.length - itemsToShowTal,
                          )
                        : prev - 1,
                    )
                  }
                  className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white transition-all"
                  aria-label="Anterior"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() =>
                    setCurrentIdxTal((prev) =>
                      prev >=
                      Math.max(
                        0,
                        taladradoItems.length - itemsToShowTal,
                      )
                        ? 0
                        : prev + 1,
                    )
                  }
                  className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white transition-all"
                  aria-label="Siguiente"
                >
                  <ChevronRight size={18} />
                </button>

                <div className="overflow-hidden mx-4 md:mx-0">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(-${currentIdxTal * (100 / itemsToShowTal)}%)`,
                    }}
                  >
                    {taladradoItems.map((p) => (
                      <div
                        key={p.id}
                        className="shrink-0 px-2"
                        style={{ width: `${100 / itemsToShowTal}%` }}
                      >
                        <CardProduct product={p} viewMode="grid" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Product Cards Carousel: Insertos para Torneado ── */}
      {insertosItems.length > 0 && (
        <section className="bg-white py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-20">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/4">
                <div className="flex flex-row md:flex-col items-center justify-center md:justify-start gap-3 md:gap-4 mb-4 md:mb-0">
                  <div className="w-12 h-12 md:w-24 md:h-24 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                    <Image
                      src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1780695156/Apmt-Cnmg-Dnmg-Milling-Inserts-Metal-Lathe-Cutting-Tool_mfzvha.avif"
                      alt="Torneado"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-base md:text-xl font-bold text-matheo-blue uppercase text-center">
                    Torneado
                  </h3>
                  <Link
                    href="/productos/herramientas-para-torneado/insertos-para-torneado"
                    className="bg-matheo-red text-white font-semibold px-4 py-1.5 md:px-6 md:py-2.5 rounded-full hover:bg-matheo-red/90 transition-colors shadow-md text-xs md:text-base whitespace-nowrap"
                  >
                    Ver todo
                  </Link>
                </div>
              </div>

              <div className="w-full md:w-3/4 relative">
                <button
                  onClick={() =>
                    setCurrentIdxIns((prev) =>
                      prev <= 0
                        ? Math.max(
                            0,
                            insertosItems.length - itemsToShowIns,
                          )
                        : prev - 1,
                    )
                  }
                  className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white transition-all"
                  aria-label="Anterior"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() =>
                    setCurrentIdxIns((prev) =>
                      prev >=
                      Math.max(
                        0,
                        insertosItems.length - itemsToShowIns,
                      )
                        ? 0
                        : prev + 1,
                    )
                  }
                  className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white transition-all"
                  aria-label="Siguiente"
                >
                  <ChevronRight size={18} />
                </button>

                <div className="overflow-hidden mx-4 md:mx-0">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(-${currentIdxIns * (100 / itemsToShowIns)}%)`,
                    }}
                  >
                    {insertosItems.map((p) => (
                      <div
                        key={p.id}
                        className="shrink-0 px-2"
                        style={{ width: `${100 / itemsToShowIns}%` }}
                      >
                        <CardProduct product={p} viewMode="grid" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Product Cards Carousel: Fresas Carburadas Rotativas ── */}
      {fresasCarbuItems.length > 0 && (
        <section className="bg-white py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-20">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/4">
                <div className="flex flex-row md:flex-col items-center justify-center md:justify-start gap-3 md:gap-4 mb-4 md:mb-0">
                  <div className="w-12 h-12 md:w-24 md:h-24 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                    <Image
                      src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1781404755/HTB1_S1Ba7xz61VjSZFtq6yDSVXac_zhmjoe.jpg"
                      alt="Fresas Carburadas"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-base md:text-xl font-bold text-matheo-blue uppercase text-center">
                    Fresas
                  </h3>
                  <Link
                    href="/productos/herramientas-de-fresado/fresas-carburadas-rotativas"
                    className="bg-matheo-red text-white font-semibold px-4 py-1.5 md:px-6 md:py-2.5 rounded-full hover:bg-matheo-red/90 transition-colors shadow-md text-xs md:text-base whitespace-nowrap"
                  >
                    Ver todo
                  </Link>
                </div>
              </div>

              <div className="w-full md:w-3/4 relative">
                <button
                  onClick={() =>
                    setCurrentIdxFresasCarb((prev) =>
                      prev <= 0
                        ? Math.max(
                            0,
                            fresasCarbuItems.length -
                              itemsToShowFresasCarb,
                          )
                        : prev - 1,
                    )
                  }
                  className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white transition-all"
                  aria-label="Anterior"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() =>
                    setCurrentIdxFresasCarb((prev) =>
                      prev >=
                      Math.max(
                        0,
                        fresasCarbuItems.length -
                          itemsToShowFresasCarb,
                      )
                        ? 0
                        : prev + 1,
                    )
                  }
                  className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-matheo-blue hover:text-white transition-all"
                  aria-label="Siguiente"
                >
                  <ChevronRight size={18} />
                </button>

                <div className="overflow-hidden mx-4 md:mx-0">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(-${currentIdxFresasCarb * (100 / itemsToShowFresasCarb)}%)`,
                    }}
                  >
                    {fresasCarbuItems.map((p) => (
                      <div
                        key={p.id}
                        className="shrink-0 px-2"
                        style={{
                          width: `${100 / itemsToShowFresasCarb}%`,
                        }}
                      >
                        <CardProduct product={p} viewMode="grid" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Ver todos */}
      <div className="text-center mt-6 md:mt-8">
        <Link
          href="/productos"
          className="inline-flex items-center justify-center gap-2 bg-matheo-red hover:bg-red-700 text-white font-bold px-10 py-4 rounded-full transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
        >
          Ver todos los productos
          <ArrowRight size={22} />
        </Link>
      </div>
    </section>
  )
}
