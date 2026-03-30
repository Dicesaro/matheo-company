"use client";
import { useEffect, useRef } from 'react';
import { Target, Eye, Award, TrendingUp, CheckCircle2, ShieldCheck, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Hero animation (immediate)
      gsap.from('.hero-fade', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });

      // Section animations with ScrollTrigger
      const sections = ['.info-section', '.stats-section', '.values-section', '.cta-section'];
      
      sections.forEach((section) => {
        gsap.from(`${section} .fade-in`, {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%', // Se activa un poco antes para evitar que se vea a medio cargar
            toggleActions: 'play none none none', // Asegura que solo se reproduzca una vez y termine
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          clearProps: 'all', // Limpia las propiedades de GSAP después de la animación para evitar conflictos de CSS
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const highlights = [
    'Más de 3 años de experiencia en el sector industrial',
    'Distribuidores autorizados de marcas líderes mundiales',
    'Productos 100% originales con garantía del fabricante',
    'Asesoría técnica especializada',
    'Servicio post-venta de primer nivel',
    'Stock permanente de más de 500 productos',
  ];

  const values = [
    {
      icon: Target,
      title: 'Misión',
      description: 'Proveer herramientas industriales de la más alta calidad, brindando soluciones integrales a nuestros clientes para optimizar sus procesos productivos.',
      color: 'text-matheo-red',
      bgColor: 'bg-red-50',
      image: '/IMG-MISION.png',
    },
    {
      icon: Eye,
      title: 'Visión',
      description: 'Ser la empresa líder en distribución de herramientas industriales en la región, reconocida por nuestra excelencia operativa y compromiso innegociable con la calidad.',
      color: 'text-matheo-blue',
      bgColor: 'bg-blue-50',
      image: '/IMG-VISION.png',
    },
    {
      icon: Award,
      title: 'Excelencia',
      description: 'Garantizamos productos originales de marcas reconocidas mundialmente, cumpliendo con los más altos estándares y certificaciones internacionales.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: TrendingUp,
      title: 'Innovación',
      description: 'Actualizamos constantemente nuestro catálogo con las últimas tecnologías del mercado para mantener a nuestros clientes a la vanguardia industrial.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const stats = [
    { icon: ShieldCheck, label: 'Garantía Total', value: '100%', detail: 'Productos Originales' },
    { icon: Clock, label: 'Experiencia', value: '+3 Años', detail: 'En el Sector Industrial' },
    { icon: Users, label: 'Clientes', value: '+100', detail: 'Empresas Satisfechas' },
    { icon: Award, label: 'Marcas', value: '+20', detail: 'Socios Estratégicos' },
  ];

  return (
    <div ref={sectionRef} className="min-h-screen bg-white">
      {/* Hero Section / Header */}
      <section className="relative pt-32 pb-20 bg-linear-to-br from-matheo-blue to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774823890/FONDO_HERO_NOSOTROS_wayr8v.png"
            alt="Fondo Industrial"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-matheo-blue/40 to-matheo-blue/80"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-blue-200 text-sm mb-6 hero-fade"></nav>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight hero-fade">
              Nuestra Pasión es la{' '}
              <span className="text-matheo-red">
                Precisión Industrial
              </span>
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed hero-fade">
              Desde hace más de 3 años, MATHEO Industrial Company ha
              sido el socio estratégico de confianza para las empresas
              metalmecánicas más exigentes del Perú.
            </p>
          </div>
        </div>
      </section>

      {/* Corporate Info Section */}
      <section className="py-24 info-section">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="fade-in">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-matheo-red rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-3xl">
                    M
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-matheo-blue uppercase tracking-tight">
                    MATHEO
                  </h3>
                  <p className="text-gray-500 font-medium">
                    Industrial Company EIRL
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p>
                  Somos una empresa peruana nacida con la visión de
                  elevar los estándares de la industria nacional. Nos
                  especializamos en la{' '}
                  <strong>
                    importación directa y distribución mayorista
                  </strong>{' '}
                  de herramientas de precisión y corte.
                </p>
                <p>
                  Entendemos que en la metalmecánica, cada milímetro
                  cuenta. Por ello, solo trabajamos con fabricantes
                  que garantizan excelencia tecnológica.
                </p>
                <p>
                  Nuestro equipo técnico no solo vende herramientas;
                  brinda <strong>soluciones</strong>. Desde la
                  selección del equipo adecuado hasta el soporte
                  post-venta, estamos con usted en cada etapa de su
                  producción.
                </p>
              </div>

              <div className="mt-10 grid sm:grid-cols-2 gap-4">
                {highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg"
                  >
                    <CheckCircle2
                      className="text-green-600 shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm font-medium">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="fade-in relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl relative z-10 border-8 border-gray-100">
                <img
                  src="/metalmecanica-industrial.png"
                  alt="Industria Metalmecánica"
                  className="w-full aspect-4/5 object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-matheo-blue/40 to-transparent"></div>
              </div>
              {/* Decorative block */}
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-matheo-red opacity-10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute top-1/2 -left-10 w-40 h-40 bg-matheo-blue opacity-10 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 border-y border-gray-100 stats-section">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center fade-in">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm text-matheo-blue mb-4">
                  <stat.icon size={24} />
                </div>
                <div className="text-4xl font-bold text-matheo-blue mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-500">
                  {stat.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white values-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl font-bold text-matheo-blue mb-4">
              Nuestros Pilares Corporativos
            </h2>
            <div className="w-24 h-1.5 bg-matheo-red mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group fade-in flex flex-col"
              >
                {value.image && (
                  <div className="mb-6 rounded-xl overflow-hidden bg-[#e5e7eb] flex items-center justify-center p-4">
                    <img
                      src={value.image}
                      alt={value.title}
                      className="w-full h-40 object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <div
                  className={`${value.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <value.icon className={value.color} size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-700 leading-relaxed font-medium">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white cta-section">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 fade-in">
            ¿Listo para llevar su industria al{' '}
            <span className="text-matheo-red">siguiente nivel</span>?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto fade-in">
            Contamos con el equipo y la experiencia necesarios para
            proveerle las herramientas de precisión que su negocio
            demanda.
          </p>
          <div className="flex flex-wrap justify-center gap-4 fade-in">
            <Link
              href={'/productos'}
              className="px-10 py-4 bg-matheo-red hover:bg-red-700 text-white rounded-xl font-bold transition-all transform hover:scale-105"
            >
              Ver Catálogo
            </Link>
            <Link
              href={'/contacto'}
              className="px-10 py-4 border-2 border-white hover:bg-white hover:text-black text-white rounded-xl font-bold transition-all"
            >
              Contactar Ahora
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
