'use client'
import { Marquee } from '@/components/ui/marquee'
import Image from 'next/image'

const brands = [
  {
    name: 'BOSCH',
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774821086/BOSCH_LOGO_posprr.webp',
  },
  {
    name: 'MITUTOYO',
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774821284/MITUTOYO_LOGO_bcm2h0.webp',
  },
  {
    name: 'MAKITA',
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774821372/MAKITA_LOGO_yorhe8.webp',
  },
  {
    name: 'TRUPER',
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774821447/TRUPER_LOGO_sszcdq.webp',
  },
  {
    name: 'DASQUA',
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774821540/DASQUA_LOGO_bdlt4m.webp',
  },
  {
    name: 'VÖLKEL',
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774821822/LOGO_VOLKEL_hvkasa.webp',
  },
  {
    name: 'BLUE MASTER',
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774821197/BLUE_MASTER_LOGO_yaqtq0.webp',
  },
  {
    name: 'VERTEX',
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774821999/VERTEX_LOGO_aufoil.webp',
  },
  {
    name: 'DORMER',
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774822069/DORMER_LOGO_tvyrix.webp',
  },
  {
    name: 'SANDVIK',
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774822518/SANDVIK_LOGO_etmxqq.webp',
  },
  {
    name: 'URANGA',
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774821926/URANGA_LOGO_cu6j0l.webp',
  },
  {
    name: 'SAN OU',
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774822808/SANOU_LOGO_apu6v0.webp',
  },
  {
    name: 'ROHM',
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774822724/ROHM_LOGO_diml9e.webp',
  },
  {
    name: 'VICTOR',
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774822662/VICTOR_LOGO_mggjl5.webp',
  },
  {
    name: 'SONGQI',
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774822601/SONGQI_LOGO_u5mjmk.webp',
  },
  {
    name: 'BWIN',
    image:
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774822435/BWIN_LOGO_hbug27.webp',
  },
]

// BrandCard component
const BrandCard = ({
  name,
  image,
}: {
  name: string
  image: string
}) => {
  return (
    <div className="relative w-48 h-32 mx-4 group cursor-pointer">
      <div className="w-full h-full flex items-center justify-center p-6">
        {/* Contenedor con tamaño fijo para fill */}
        <div className="relative w-32 h-12">
          <Image
            src={image}
            alt={name}
            fill
            sizes="128px"
            className="object-contain transition-all duration-300 grayscale group-hover:grayscale-0 group-hover:scale-110"
          />
        </div>
      </div>
    </div>
  )
}

export default function Brands() {
  return (
    <section
      id="marcas"
      className="py-20 bg-linear-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-matheo-blue mb-4">
            Marcas que Distribuimos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trabajamos con las marcas más reconocidas y confiables de
            la industria mundial
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg">
          {/* All Brands - Left to Right */}
          <Marquee className="[--duration:70s] mb-8">
            {brands.map((brand) => (
              <BrandCard key={brand.name} {...brand} />
            ))}
          </Marquee>

          {/* Gradient Overlays for fade effect */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/12 bg-linear-to-r from-white to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/12 bg-linear-to-l from-gray-50 to-transparent"></div>
        </div>

        {/* Stats */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-lg">
            <span className="font-bold text-matheo-red">
              {brands.length}+
            </span>{' '}
            marcas líderes a nivel mundial
          </p>
        </div>
      </div>
    </section>
  )
}
