'use client'
import {
  Heart,
  Users,
  Lightbulb,
  ThumbsUp,
  Settings2,
} from 'lucide-react'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

/* ─── Hook reutilizable para fade-in ────────────────────────────── */
function useFadeIn() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  })
  return { ref, inView }
}

/* ─── Wrapper con animación CSS pura ────────────────────────────── */
function FadeIn({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const { ref, inView } = useFadeIn()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/* ─── Stats counter card ─────────────────────────────────────────── */
function StatCard({
  value,
  suffix = '',
  prefix = '',
  label,
  sublabel,
}: {
  value: number
  suffix?: string
  prefix?: string
  label: string
  sublabel: string
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center px-6"
    >
      <span className="text-4xl md:text-5xl font-extrabold text-matheo-blue leading-none">
        {prefix}
        {inView ? (
          <CountUp end={value} duration={2.5} separator="," />
        ) : (
          '0'
        )}
        {suffix}
      </span>
      <span className="mt-2 text-xs font-bold uppercase tracking-widest text-matheo-red">
        {label}
      </span>
      <span className="text-xs text-gray-500 mt-0.5">{sublabel}</span>
    </div>
  )
}

/* ─── Main component ──────────────────────────────────────────────── */
export default function About() {
  const valores = [
    {
      icon: Heart,
      label: 'Honestidad',
      color: 'text-matheo-red',
      desc: 'Actuamos con transparencia y ética en cada operación.',
    },
    {
      icon: Users,
      label: 'Enfoque al Cliente',
      color: 'text-matheo-blue',
      desc: 'El cliente es el centro de cada decisión que tomamos.',
    },
    {
      icon: Lightbulb,
      label: 'Innovación',
      color: 'text-yellow-500',
      desc: 'Buscamos constantemente nuevas soluciones y tecnologías.',
    },
    {
      icon: ThumbsUp,
      label: 'Calidad',
      color: 'text-green-600',
      desc: 'Solo ofrecemos productos originales de las mejores marcas.',
    },
    {
      icon: Settings2,
      label: 'Trabajo en Equipo',
      color: 'text-purple-600',
      desc: 'Colaboramos para alcanzar la excelencia juntos.',
    },
  ]

  return (
    <section id="nosotros" className="w-full">
      {/* 1. HERO */}
      <div className="relative w-full min-h-125 flex flex-col items-center pt-20 justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            <Image
              src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774823890/FONDO_HERO_NOSOTROS_wayr8v.png"
              alt="Fondo hero nosotros"
              fill
              priority
              loading="eager"
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-black/55" />
        <FadeIn className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-5 drop-shadow-lg">
            ¿QUIÉNES SOMOS?
          </h2>
          <p className="text-gray-200 text-lg md:text-xl leading-relaxed">
            Nuestra alta eficiencia y calidad en el desempeño como el
            mejor importador de herramientas y maquinaria, de alta
            calidad ofrece sólido posicionamiento y liderazgo que nos
            garantiza sólido crecimiento y crecimiento.
          </p>
        </FadeIn>
      </div>

      {/* 2. DESCRIPCIÓN + VIDEO */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <FadeIn className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div className="mb-4">
                <div className="relative w-52 h-20">
                  <Image
                    src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774823626/MATHEO_logo_qneg7d.svg"
                    alt="Matheo Industrial"
                    fill
                    sizes="208px"
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Somos una sociedad responsable que se dedica a la
                importación y comercialización de herramientas de
                corte, metal duro, calibración, precisión, maquinarias
                CNC y convencionales.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Trabajamos para ser la mejor opción de nuestros
                clientes ofreciendo una diversificada gama de
                productos de calidad.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Así mismo contamos con un staff capacitado y
                especializado en brindar el soporte técnico para cada
                una de sus necesidades de nuestros clientes en los
                diversos sectores.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 aspect-video flex items-center justify-center">
              <video
                src="https://res.cloudinary.com/ddtmb8l1k/video/upload/v1773615493/VIDEO_MATHEO_lyvozh.mp4"
                controls
                preload="none"
                className="w-full h-full object-cover"
                poster="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1775324528/Captura_de_pantalla_2026-04-04_124105_q4bsyv.png"
              />
            </div>
          </FadeIn>
        </div>
      </div>

      {/* 3. ESTADÍSTICAS */}
      <div className="bg-gray-50 border-y border-gray-100 py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-200">
            <StatCard
              value={100}
              suffix="%"
              label="GARANTIA TOTAL"
              sublabel="Nuestros Trabajos"
            />
            <StatCard
              value={3}
              prefix="+"
              label="AÑOS DE EXPERIENCIA"
              sublabel="En la Rama Industrial"
            />
            <StatCard
              value={100}
              prefix="+"
              label="CLIENTES"
              sublabel="Empresas Satisfechas"
            />
            <StatCard
              value={20}
              prefix="+"
              label="MARCAS"
              sublabel="Líderes Trabajando"
            />
          </div>
        </div>
      </div>

      {/* 4. VISIÓN */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <FadeIn className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-5xl font-black text-center text-matheo-blue mb-6">
                VISIÓN:
              </h3>
              <p className="text-gray-700 text-xl text-center leading-relaxed font-medium">
                Aspiramos a ser uno de los importadores más
                importantes en herramientas de corte y maquinarias.
              </p>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative w-72 h-72 drop-shadow-2xl hover:scale-105 transition-transform duration-500">
                <Image
                  src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774823609/IMG-VISION_kk2p9v.png"
                  alt="Visión Matheo"
                  fill
                  sizes="288px"
                  className="object-contain"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* 5. MISIÓN */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <FadeIn className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="relative w-72 h-72 drop-shadow-2xl hover:scale-105 transition-transform duration-500">
                <Image
                  src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774823609/IMG-MISION_pahxmd.png"
                  alt="Misión Matheo"
                  fill
                  sizes="288px"
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <h3 className="text-5xl font-black text-center text-matheo-blue mb-6">
                MISIÓN:
              </h3>
              <p className="text-gray-700 text-xl text-center leading-relaxed font-medium">
                Nuestro objetivo es satisfacer de forma permanente,
                creando riqueza, las necesidades y expectativas de
                nuestros clientes, accionistas, personal y la sociedad
                en general, siendo respetuosos con nuestro entorno.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* 6. NUESTROS VALORES */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h3 className="text-4xl md:text-5xl font-extrabold text-matheo-red text-center mb-14">
              Nuestros valores
            </h3>
            <div className="flex flex-wrap justify-center gap-12">
              {valores.map((v, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center w-40 group"
                  style={{
                    // pequeño delay escalonado por valor
                    transitionDelay: `${i * 80}ms`,
                  }}
                >
                  <div className="w-20 h-20 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors mb-4 shadow-sm">
                    <v.icon
                      className={v.color}
                      size={40}
                      strokeWidth={1.8}
                    />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wide text-gray-700 leading-tight">
                    {v.label}
                  </span>
                  <p className="text-xs text-gray-500 mt-2 leading-snug">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
