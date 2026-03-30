'use client'
import { generateSlug } from '@/lib/utils'
import { Mail, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const categories = [
    'CENTROS GIRATORIOS',
    'PORTAINSERTOS P/ TORNEAR',
    'INSERTOS P/ ROSCADO',
    'MACHOS PARA ROSCAS',
    'FRESAS ROTATIVAS',
  ]

  const quickLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Productos', href: '/productos' },
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Contacto', href: '/contacto' },
  ]

  return (
    <footer className="bg-linear-to-b from-gray-900 to-black text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            {/* Logo */}
            <div className="mb-6">
              <img
                src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774823626/MATHEO_logo_qneg7d.svg"
                alt="MATHEO Industrial Company"
                className="h-20 w-auto"
              />
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Importador y distribuidor líder de herramientas
              industriales de precisión para la industria
              metalmecánica en general.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61583130317473"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-matheo-red rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@matheoindustrialc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-matheo-red rounded-lg flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-matheo-red">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-matheo-red group-hover:w-4 transition-all"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-matheo-red">
              Categorías
            </h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/productos/${generateSlug(category)}`}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-matheo-red group-hover:w-4 transition-all"></span>
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-matheo-red">
              Contacto
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin
                  size={20}
                  className="shrink-0 mt-1 text-matheo-red"
                />
                <span className="text-sm leading-relaxed">
                  Av. Argentina N° 639 Int. Calle 10
                  <br />
                  Stand B218-B219 C.C. UDAMPE
                  <br />
                  Lima Cercado, Perú
                </span>
              </li>

              <li className="flex items-center gap-3 text-gray-400">
                <Mail
                  size={20}
                  className="shrink-0 text-matheo-red"
                />
                <div className="text-sm">
                  <a
                    href="mailto:ventas@matheocompany.com"
                    className="hover:text-white transition-colors block wrap-break-word"
                  >
                    ventas@matheocompany.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>
              © {currentYear}{' '}
              <span className="text-matheo-red font-semibold">
                MATHEO
              </span>{' '}
              Industrial Company EIRL. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 flex-wrap justify-center md:justify-end">
              <Link
                href={'/politica-de-privacidad'}
                className="hover:text-white transition-colors"
              >
                Política de Privacidad
              </Link>
              <Link
                href={'/terminos-y-condiciones'}
                className="hover:text-white transition-colors"
              >
                Términos y Condiciones
              </Link>
              <Link
                href={'/libro-de-reclamaciones'}
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                Libro de Reclamaciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
