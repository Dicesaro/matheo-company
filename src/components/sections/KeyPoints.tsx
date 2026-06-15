'use client'
import { useState, useEffect } from 'react'
import { Truck, Headphones, Grid3X3, ShieldCheck } from 'lucide-react'

const points = [
  { icon: Truck, line1: 'Envíos a', line2: 'todo el Perú' },
  { icon: Headphones, line1: 'Asesoramiento', line2: 'personalizada' },
  { icon: Grid3X3, line1: 'Amplia gama', line2: 'de productos' },
  { icon: ShieldCheck, line1: 'Confianza y', line2: 'garantía asegurada' },
]

export default function KeyPoints() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % points.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className=" py-6 md:py-14">
      <div className="container mx-auto px-4">
        {/* Mobile: carousel */}
        <div className="flex md:hidden justify-center overflow-hidden relative h-24 w-full">
          {points.map((item, i) => {
            const Icon = item.icon
            return (
              <div
                key={i}
                className="absolute inset-0 flex items-center justify-center gap-4 transition-all duration-500"
                style={{
                  transform:
                    i === current
                      ? 'translateX(0)'
                      : i < current
                        ? 'translateX(-100%)'
                        : 'translateX(100%)',
                  opacity: i === current ? 1 : 0,
                }}
              >
                <Icon size={48} className="text-matheo-red shrink-0" />
                <div className="text-left">
                  <p className="text-lg font-bold text-matheo-red leading-tight whitespace-nowrap">
                    {item.line1}
                  </p>
                  <p className="text-lg font-bold text-matheo-red leading-tight whitespace-nowrap">
                    {item.line2}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop: row */}
        <div className="hidden md:flex justify-center items-start">
          {points.map((item, i) => {
            const Icon = item.icon
            return (
              <div
                key={i}
                className="flex items-center gap-3 px-8 xl:px-12 border-l border-matheo-red first:border-l-0"
              >
                <Icon size={36} className="text-matheo-red shrink-0" />
                <div className="text-left">
                  <p className="text-sm xl:text-base font-semibold text-matheo-red leading-tight whitespace-nowrap">
                    {item.line1}
                  </p>
                  <p className="text-sm xl:text-base font-semibold text-matheo-red leading-tight whitespace-nowrap">
                    {item.line2}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
