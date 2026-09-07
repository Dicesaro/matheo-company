'use client'
import { useState, useEffect, useRef } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from 'lucide-react'
import Image from 'next/image'

interface Slide {
  id: number
  title: string
  backgroundImage: string
  mobileBackgroundImage?: string
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Herramientas de Fresado',
    backgroundImage:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1788741115/Frame_1051_1_ljda40.png',
    mobileBackgroundImage:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1788741116/Frame_1052_1_jfuaif.png',
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

  return (
    <section
      id="inicio"
      className="relative w-full aspect-760/260 sm:aspect-video md:h-[50vh] overflow-hidden"
    >
      {/* Background Images — sliding track */}
      <div
        className="absolute inset-0 h-full flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((s, index) => (
          <div key={s.id} className="relative w-full h-full shrink-0">
            {/* Mobile image */}
            {s.mobileBackgroundImage && (
              <Image
                src={s.mobileBackgroundImage}
                alt={s.title}
                fill
                sizes="(max-width: 919px) 100vw, 0vw"
                priority={index === 0}
                className="object-cover hidden max-[919px]:block"
                style={{ width: '100%', height: '100%' }}
              />
            )}
            {/* Desktop image */}
            <Image
              src={s.backgroundImage}
              alt={s.title}
              fill
              sizes="(min-width: 920px) 100vw, 0vw"
              priority={index === 0}
              className={`object-cover ${s.mobileBackgroundImage ? 'hidden min-[920px]:block' : ''}`}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ))}
      </div>

      {/* Prev / Next */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-13 md:h-13 hidden min-[920px]:flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 border border-white/30 text-white transition-all duration-200 hover:scale-110 shadow-xl"
        aria-label="Slide anterior"
      >
        <ChevronLeft size={26} strokeWidth={2.5} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-13 md:h-13 hidden min-[920px]:flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 border border-white/30 text-white transition-all duration-200 hover:scale-110 shadow-xl"
        aria-label="Slide siguiente"
      >
        <ChevronRight size={26} strokeWidth={2.5} />
      </button>

      {/* Dots */}
  
    </section>
  )
}