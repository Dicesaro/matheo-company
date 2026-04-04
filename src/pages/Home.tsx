import { Metadata } from 'next'
import Hero from '../components/Hero'
import Brands from '../components/Brands'
import Contact from '../components/Contact'
import FeaturedProducts from '../components/Products'

export const metadata: Metadata = {
  title:
    'Importador y Distribuidor de Herramientas Industriales | MATHEO',
  description:
    'Industrial Company MATHEO — Importador y distribuidor líder de herramientas industriales de precisión para la industria metalmecánica en Perú. Brocas, machos, fresas, insertos y más.',
  keywords:
    'herramientas industriales Peru, importador herramientas Lima, distribuidor herramientas metalmecánicas',
  alternates: {
    canonical: 'https://industrialcompanymatheo.com',
  },
  openGraph: {
    type: 'website',
    url: 'https://industrialcompanymatheo.com',
    title:
      'Importador y Distribuidor de Herramientas Industriales | MATHEO',
    description:
      'Importador y distribuidor líder de herramientas industriales de precisión para la industria metalmecánica en Perú.',
    images: [
      'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774217586/MATHEO_icon_jnkkah.ico',
    ],
    locale: 'es_PE',
    siteName: 'Industrial Company MATHEO',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Industrial Company MATHEO EIRL',
  url: 'https://industrialcompanymatheo.com',
  logo: 'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774217586/MATHEO_icon_jnkkah.ico',
  description:
    'Importador y distribuidor líder de herramientas industriales de precisión para la industria metalmecánica en Perú.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'PE',
    addressLocality: 'Lima',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: '+51922922766',
    availableLanguage: 'Spanish',
  },
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Hero />
      <FeaturedProducts />
      <Brands />
      <Contact />
    </>
  )
}
