'use client'
import { useState, useEffect, useRef } from 'react'
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface HeroProps {
  banners: {
    id: string
    title: string
    image_url: string
    mobile_image_url: string | null
    link_url: string | null
  }[]
}

export default function Hero({ banners }: HeroProps) {
  const slides = banners.map((b) => ({
    id: b.id,
    title: b.title,
    backgroundImage: b.image_url,
    mobileBackgroundImage: b.mobile_image_url || undefined,
    linkUrl: b.link_url || undefined,
  }))
  const [currentSlide, setCurrentSlide] = useState(0)
  const [animating, setAnimating] = useState(false)
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
    if (slides.length === 0) return

    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
        autoPlayRef.current = null
      }
    }
  }, [slides.length])

  return (
    <section
      id="inicio"
      className="relative w-full aspect-760/260 sm:aspect-video md:h-[50vh] overflow-hidden"
    >
      {slides.length > 0 && (
          <div
            className="absolute inset-0 h-full flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((s, index) => {
              const slideContent = (
                <>
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
                </>
              )

              return (
                <div key={s.id} className="relative w-full h-full shrink-0">
                  {s.linkUrl ? (
                    <Link href={s.linkUrl} className="absolute inset-0 z-10">
                      {slideContent}
                    </Link>
                  ) : (
                    slideContent
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Prev / Next */}
        {slides.length > 1 && (
          <>
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
          </>
        )}
    </section>
  )
}