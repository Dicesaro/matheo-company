'use client'
import { useState, useEffect, useRef } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  MessageCircleMore,
  Pause,
  Play,
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
  mobileBackgroundImage?: string
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'HERRAMIENTAS DE FRESADO',
    subtitle: 'Herramientas de Corte de Alto Rendimiento y Precisión',
    description:
      'Venta y distribución de fresas de carburo de tungsteno y acero rápido (HSS). La mejor calidad para acabados de precisión en metalmecánica en todo el Perú. Contamos con las mejores marcas y asesoramiento técnico especializado.',
    buttonText: 'Ver Catálogo',
    buttonLink: '/productos/herramientas-de-fresado',
    backgroundImage:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774820117/HERO_FRESADO_g0jssx.png',
    mobileBackgroundImage:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779381850/HERO_FRESADO_MOBILE_qmvco6.png',
  },
  {
    id: 2,
    title: 'HERRAMIENTAS DE ROSCADO',
    subtitle:
      'Machos de Roscar, Insertos y Herramientas de Precisión',
    description:
      'Especialistas en venta de insertos de carburo para roscar, machos de roscado NPT/Métrico y herramientas de alta resistencia para tornos CNC en Lima, Perú. Calidad garantizada para tus proyectos de roscado industrial.',
    buttonText: 'Ver Productos',
    buttonLink: '/productos/herramientas-de-roscado',
    backgroundImage:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774820117/HERO_ROSCADO_zftbr0.png',
    mobileBackgroundImage:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779383279/HERO_ROSCADO_MOBILE_aey77l.png',
  },
  {
    id: 3,
    title: 'HERRAMIENTAS DE TALADRADO',
    subtitle: 'Soluciones de Perforación para Metal y Concreto',
    description:
      'Amplio catálogo de brocas industriales de alto rendimiento para metal, concreto y materiales compuestos. Las mejores marcas para tu taller en Perú con envíos rápidos a todo el país y asesoría técnica sin costo.',
    buttonText: 'Ver Brocas',
    buttonLink: '/productos/herramientas-de-taladrado',
    backgroundImage:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774820117/HERO_TALADRADO_cerwvn.png',
    mobileBackgroundImage:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779383734/HERO_TALADRADO_MOBILE_jw2nb3.png',
  },
  {
    id: 4,
    title: 'HERRAMIENTAS DE TORNEADO',
    subtitle: 'Especialistas en Mecanizado Industrial en Lima',
    description:
      'Venta de insertos y portaherramientas de máxima duración para procesos de torneado en Lima. Potencia la producción y rentabilidad de tu empresa con herramientas de alto rendimiento y soporte técnico especializado.',
    buttonText: 'Ver Productos',
    buttonLink: '/productos/herramientas-para-torneado',
    backgroundImage:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774820117/HERO_TORNEADO_rot42d.png',
    mobileBackgroundImage:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779384252/HERO_TORNEADO_MOBILE_d2ndbh.png',
  },
  {
    id: 5,
    title: 'HERRAMIENTAS DE SUJECIÓN',
    subtitle: 'Sujeción Industrial de Alto Nivel para CNC',
    description:
      'Proveedores de mordazas, platos y sistemas de sujeción para tornos y centros de mecanizado. Soluciones confiables para metalmecánica en Lima, Perú con las mejores marcas del mercado y envío garantizado.',
    buttonText: 'Ver Productos',
    buttonLink: '/productos/herramientas-de-sujecion',
    backgroundImage:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774820117/HERO_SUJECION_ymgvjl.png',
    mobileBackgroundImage:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1779384788/HERO_SUJECION_MOBILE_vrznhr.png',
  },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
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
    if (isPaused) return

    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
        autoPlayRef.current = null
      }
    }
  }, [isPaused])

  const slide = slides[currentSlide]

  return (
    <section
      id="inicio"
      className="relative w-full h-150 sm:h-[80vh] md:h-[85vh] md:pt-24 flex items-center overflow-hidden "
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: index === currentSlide ? 1 : 0 }}
          >
            {/* Mobile image */}
            {s.mobileBackgroundImage && (
              <Image
                src={s.mobileBackgroundImage}
                alt={s.title}
                fill
                sizes="(max-width: 639px) 100vw, 0vw"
                priority={index === 0}
                className="object-cover sm:hidden"
                style={{ width: '100%', height: '100%' }}
              />
            )}
            {/* Desktop image */}
            <Image
              src={s.backgroundImage}
              alt={s.title}
              fill
              sizes="(min-width: 640px) 100vw, 0vw"
              priority={index === 0}
              className={`object-cover ${s.mobileBackgroundImage ? 'hidden sm:block' : ''}`}
              style={{ width: '100%', height: '100%' }}              
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/70" />
          </div>
        ))}
      </div>

      {/* Content — animación CSS pura al cambiar slide */}
      <div className="container mx-auto px-4 relative z-10 pt-28 md:pt-0">
          <div
            key={currentSlide} // ← key fuerza re-mount y re-anima con CSS
            className="max-w-3xl text-center sm:text-left"
            style={{
              animation: 'heroFadeIn 0.8s ease forwards',
            }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 leading-tight text-white drop-shadow-2xl line-clamp-2">
              {slide.title}
            </h1>

            <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-yellow-400 drop-shadow-lg line-clamp-2">
              {slide.subtitle}
            </h2>

            <p className="text-sm sm:text-base md:text-lg mb-2 text-white/90 max-w-xl mx-auto sm:mx-0 drop-shadow-lg line-clamp-3">
              {slide.description}
            </p>

            <div className="flex flex-row gap-2 justify-center sm:justify-start max-w-xs sm:max-w-none mx-auto sm:mx-0">
            <Link
              href={slide.buttonLink}
              className="inline-flex items-center justify-center gap-1.5 bg-matheo-red backdrop-blur-sm border-2 border-white text-white hover:bg-matheo-red hover:border-matheo-red px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-xl text-xs sm:text-sm"
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Ver Productos</span>
              <span className="sm:hidden">Ver</span>
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-1.5 bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-matheo-gray hover:border-matheo-gray px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-xl text-xs sm:text-sm"
            >
              <MessageCircleMore size={16} />
              <span className="hidden sm:inline">Escribenos</span>
              <span className="sm:hidden">Mail</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-13 md:h-13 flex items-center justify-center rounded-full  hover:bg-white/30 border border-white/30 text-white transition-all duration-200 hover:scale-110 shadow-xl"
        aria-label="Slide anterior"
      >
        <ChevronLeft size={26} strokeWidth={2.5} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-13 md:h-13 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 border border-white/30 text-white transition-all duration-200 hover:scale-110 shadow-xl"
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

        {/* Pause/Play */}
        <button
          onClick={() => setIsPaused((p) => !p)}
          className="ml-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white transition-all duration-200 hover:scale-110"
          aria-label={isPaused ? 'Reanudar' : 'Pausar'}
        >
          {isPaused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      </div>
    </section>
  )
}
