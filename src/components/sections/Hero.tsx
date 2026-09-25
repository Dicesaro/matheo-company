'use client'
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'

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
  const canLoop = slides.length > 1

  return (
    <section
      id="inicio"
      className="relative w-full aspect-760/260 sm:aspect-video md:h-[50vh] overflow-hidden"
    >
      {slides.length > 0 && (
        <Swiper
          modules={[Autoplay, Navigation]}
          slidesPerView={1}
          spaceBetween={0}
          speed={700}
          loop={canLoop}
          rewind={!canLoop}
          autoplay={
            canLoop
              ? { delay: 5000, disableOnInteraction: false }
              : false
          }
          navigation={{
            prevEl: '.hero-banner-prev',
            nextEl: '.hero-banner-next',
          }}
          className="h-full w-full"
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
              <SwiperSlide key={s.id}>
                <div className="relative w-full h-full shrink-0">
                  {s.linkUrl ? (
                    <Link href={s.linkUrl} className="absolute inset-0 z-10">
                      {slideContent}
                    </Link>
                  ) : (
                    slideContent
                  )}
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      )}

      {/* Prev / Next */}
      {slides.length > 1 && (
        <>
          <button
            className="hero-banner-prev absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-13 md:h-13 hidden min-[920px]:flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 border border-white/30 text-white transition-all duration-200 hover:scale-110 shadow-xl"
            aria-label="Slide anterior"
          >
            <ChevronLeft size={26} strokeWidth={2.5} />
          </button>

          <button
            className="hero-banner-next absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-13 md:h-13 hidden min-[920px]:flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 border border-white/30 text-white transition-all duration-200 hover:scale-110 shadow-xl"
            aria-label="Slide siguiente"
          >
            <ChevronRight size={26} strokeWidth={2.5} />
          </button>
        </>
      )}
    </section>
  )
}
