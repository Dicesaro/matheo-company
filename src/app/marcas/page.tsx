import { createClient } from '@/lib/supabase-server'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Marcas de Distribución | MATHEO',
  description:
    'Conoce todas las marcas de herramientas industriales que distribuimos en Perú. Importación directa de brocas, fresas, machos e insertos.',
  alternates: {
    canonical: 'https://industrialcompanymatheo.com/marcas',
  },
  openGraph: {
    title: 'Marcas de Distribución | MATHEO',
    description:
      'Conoce todas las marcas de herramientas industriales que distribuimos en Perú.',
    url: 'https://industrialcompanymatheo.com/marcas',
    siteName: 'Industrial Company MATHEO',
    locale: 'es_PE',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1786062217/OPENGRAPH_MARCAS_yaahqo.png',
        width: 1200,
        height: 630,
        alt: 'Marcas de Distribución | MATHEO',
      },
    ],
  },
}

export default async function MarcasPage() {
  const supabase = await createClient()
  const { data: brands } = await supabase
    .from('brands')
    .select('name, image_url')
    .order('name')

  return (
    <main className="min-h-screen bg-white">
      <section className="container mx-auto px-4 py-10">
        {!brands || brands.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No hay marcas disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-0">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                href={`/productos?brand=${encodeURIComponent(brand.name)}`}
                className="flex flex-col items-center justify-center p-6 bg-white border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="w-full flex items-center justify-center">
                  {brand.image_url ? (
                    <Image
                      src={brand.image_url}
                      alt={brand.name}
                      width={200}
                      height={100}
                      className="max-w-full h-auto object-contain"
                    />
                  ) : (
                    <span className="text-lg font-bold text-matheo-blue uppercase select-none">
                      {brand.name.charAt(0)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
