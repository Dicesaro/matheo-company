'use client'
import { useEffect, useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { generateSlug } from '@/lib/utils'

interface Category {
  id: string
  name: string
  parent_id: string | null
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [catColumns, setCatColumns] = useState<{ parent: Category; children: Category[] }[][]>([])

  useEffect(() => {
    async function fetchCats() {
      const mod = await import('@/lib/actions/categories')
      const cats: Category[] = await mod.getCategories()

      const parents = cats.filter((c) => c.parent_id === null)
      const childMap: Record<string, Category[]> = {}

      cats.forEach((c) => {
        if (c.parent_id) {
          if (!childMap[c.parent_id]) childMap[c.parent_id] = []
          childMap[c.parent_id].push(c)
        }
      })

      const grouped = parents.map((p) => ({
        parent: p,
        children: childMap[p.id] || [],
      }))

      const cols: { parent: Category; children: Category[] }[][] = [[], [], []]
      grouped.forEach((item, i) => cols[i % 3].push(item))
      setCatColumns(cols)
    }
    fetchCats()
  }, [])

  const companyInfo = (
    <div>
      <div className="mb-6 flex justify-center md:justify-start">
        <Image
          src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774823626/MATHEO_logo_qneg7d.svg"
          width={200}
          height={20}
          alt="MATHEO Industrial Company"
          className="h-16 w-auto brightness-0 invert"
        />
      </div>
      <p className="text-gray-400 mb-5 leading-relaxed text-sm md:text-base text-center md:text-left">
        Importador y distribuidor líder de herramientas
        industriales de precisión para la industria
        metalmecánica en general.
      </p>

      <ul className="space-y-3 mb-5 flex flex-col items-center md:items-start">
        <li className="flex items-start gap-3 text-gray-400">
          <MapPin
            size={20}
            className="shrink-0 mt-0.5 text-matheo-red"
          />
          <span className="text-sm leading-relaxed text-left">
            Av. Argentina N° 639 Int. Calle 10
            <br />
            Stand B218-B219 C.C. UDAMPE
            <br />
            Lima Cercado, Perú
          </span>
        </li>
        <li className="flex items-center gap-3 text-gray-400">
          <Phone
            size={20}
            className="shrink-0 text-matheo-red"
          />
          <a
            href="tel:+51922922766"
            className="text-sm hover:text-white transition-colors"
          >
            +51 922 922 766
          </a>
        </li>
        <li className="flex items-center gap-3 text-gray-400">
          <Mail
            size={20}
            className="shrink-0 text-matheo-red"
          />
          <div className="text-sm">
            <a
              href="mailto:ventas@matheocompany.com"
              className="hover:text-white transition-colors"
            >
              ventas@matheocompany.com
            </a>
          </div>
        </li>
        <li className="flex justify-center md:justify-start">
          <Link
            href={'/libro-de-reclamaciones'}
            className="hover:opacity-80 transition-opacity inline-block bg-white rounded-md p-1"
          >
            <img
              src="https://tramite.qtc.pe/wp-content/uploads/2024/07/Logo-4.png"
              alt="Libro de Reclamaciones"
              className="h-16 w-auto"
            />
          </Link>
        </li>
      </ul>

      <div className="flex gap-3 justify-center md:justify-start">
        <a
          href="https://www.facebook.com/IndustrialCompanyMatheo"
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 bg-gray-800 hover:bg-matheo-red rounded-lg flex items-center justify-center transition-colors"
          aria-label="Facebook"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        </a>
        <a
          href="https://www.tiktok.com/@industrialcompanymatheo"
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 bg-gray-800 hover:bg-matheo-red rounded-lg flex items-center justify-center transition-colors"
          aria-label="TikTok"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
          </svg>
        </a>
      </div>
    </div>
  )

  return (
    <footer className="bg-linear-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Mobile: Company info centered, full width */}
        <div className="md:hidden mb-10">
          {companyInfo}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Desktop: Company Info */}
          <div className="hidden md:block md:col-span-1">
            {companyInfo}
          </div>

          {/* Columns 2-4: Categories */}
          {catColumns.map((col, colIdx) => (
            <div key={colIdx}>
              {col.map(({ parent, children }) => (
                <div key={parent.id} className="mb-6">
                  <Link
                    href={`/productos/${generateSlug(parent.name)}`}
                    className="text-sm md:text-base font-bold text-white hover:text-matheo-red uppercase tracking-wide transition-colors"
                  >
                    {parent.name}
                  </Link>
                  {children.length > 0 && (
                    <ul className="mt-2 space-y-1.5">
                      {children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={`/productos/${generateSlug(child.name)}`}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ))}
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
