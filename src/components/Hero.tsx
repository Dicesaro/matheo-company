'use client'
import { useState, useEffect, useRef } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  MessageCircleMore,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Slide {
  id: number
  title: string
  subtitle: string
  description: string
  buttonText: string
  buttonLink: string
  backgroundImage: string
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'FRESADO INDUSTRIAL Y CNC EN LIMA',
    subtitle: 'Herramientas de Corte de Alto Rendimiento',
    description:
      'Venta y distribución de fresas de carburo de tungsteno y acero rápido (HSS). La mejor calidad para acabados de precisión en metalmecánica en todo el Perú.',
    buttonText: 'Ver Catálogo',
    buttonLink: '/productos/herramientas-de-fresado',
    backgroundImage:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774820117/HERO_FRESADO_g0jssx.png',
  },
  {
    id: 2,
    title: 'ROSCADO INDUSTRIAL Y CNC',
    subtitle: 'Machos de Roscar e Insertos',
    description:
      'Especialistas en venta de insertos de carburo para roscar, machos de roscado NPT/Métrico y herramientas de alta resistencia para tornos CNC en Lima, Perú.',
    buttonText: 'Ver Productos',
    buttonLink: '/productos/herramientas-de-roscado',
    backgroundImage:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774820117/HERO_ROSCADO_zftbr0.png',
  },
  {
    id: 3,
    title: 'HERRAMIENTAS DE TALADRADO PROFESIONAL',
    subtitle: 'Soluciones de Perforación en Lima',
    description:
      'Amplio catálogo de brocas industriales de alto rendimiento para metal, concreto y materiales compuestos. Las mejores marcas para tu taller en Perú.',
    buttonText: 'Ver Brocas',
    buttonLink: '/productos/herramientas-de-taladrado',
    backgroundImage:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774820117/HERO_TALADRADO_cerwvn.png',
  },
  {
    id: 4,
    title: 'HERRAMIENTAS DE TORNEADO CNC',
    subtitle: 'Especialistas en Mecanizado Industrial',
    description:
      'Venta de insertos y portaherramientas de máxima duración para procesos de torneado en Lima. Potencia la producción y rentabilidad de tu empresa.',
    buttonText: 'Ver Productos',
    buttonLink: '/productos/herramientas-para-torneado',
    backgroundImage:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774820117/HERO_TORNEADO_rot42d.png',
  },
  {
    id: 5,
    title: 'EQUIPOS Y HERRAMIENTAS DE SUJECIÓN',
    subtitle: 'Sujeción Industrial de Alto Nivel',
    description:
      'Proveedores de mordazas, platos y sistemas de sujeción para tornos y centros de mecanizado. Soluciones confiables para metalmecánica en Lima, Perú.',
    buttonText: 'Ver Productos',
    buttonLink: '/productos/herramientas-de-sujecion',
    backgroundImage:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774820117/HERO_SUJECION_ymgvjl.png',
  },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [animating, setAnimating] = useState(false)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  )

  const goToSlide = (index: number) => {
    if (animating) return
    setAnimating(true)
    setCurrentSlide(index)
    // Resetear animating después de que termine la transición
    setTimeout(() => setAnimating(false), 800)
  }

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length)
  }

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length)
  }

  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [])

  const slide = slides[currentSlide]

  return (
    <section
      id="inicio"
      className="relative min-h-169.5 h-[80vh] md:h-[85vh] flex items-center overflow-hidden"
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: index === currentSlide ? 1 : 0 }}
          >
            <Image
              src={s.backgroundImage}
              alt={s.title}
              fill
              priority={index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
              className="object-cover"
              style={{ width: '100%', height: '100%' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.style.background =
                    'linear-gradient(135deg, #1e40af 0%, #dc2626 100%)'
                }
              }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/30" />
          </div>
        ))}
      </div>

      {/* Content — animación CSS pura al cambiar slide */}
      <div className="container mx-auto px-4 relative z-10 pt-28 pb-12 md:pt-0">
        <div
          key={currentSlide} // ← key fuerza re-mount y re-anima con CSS
          className="max-w-3xl"
          style={{
            animation: 'heroFadeIn 0.8s ease forwards',
          }}
        >
          <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <span className="font-semibold text-xs uppercase tracking-wider text-white">
              INDUSTRIAL COMPANY MATHEO
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight text-white drop-shadow-2xl">
            {slide.title}
          </h1>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-yellow-400 drop-shadow-lg">
            {slide.subtitle}
          </h2>

          <p className="text-base md:text-lg mb-6 text-white/90 max-w-xl drop-shadow-lg">
            {slide.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-xs sm:max-w-none">
            <Link
              href={slide.buttonLink}
              className="inline-flex items-center justify-center gap-2 bg-matheo-red backdrop-blur-sm border-2 border-white text-white hover:bg-matheo-red hover:border-matheo-red px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-xl text-sm"
            >
              <ShoppingCart />
              Ver Productos
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-matheo-gray hover:border-matheo-gray px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-xl text-sm"
            >
              <MessageCircleMore />
              Escribenos
            </Link>
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-13 md:h-13 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white transition-all duration-200 hover:scale-110 shadow-xl"
        aria-label="Slide anterior"
      >
        <ChevronLeft size={26} strokeWidth={2.5} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-13 md:h-13 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white transition-all duration-200 hover:scale-110 shadow-xl"
        aria-label="Slide siguiente"
      >
        <ChevronRight size={26} strokeWidth={2.5} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 h-3 bg-white shadow-lg'
                : 'w-3 h-3 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
