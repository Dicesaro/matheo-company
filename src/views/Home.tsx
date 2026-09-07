import { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import KeyPoints from '@/components/sections/KeyPoints'
import FeaturedProducts from '@/components/sections/Products'
import CategoryProducts from '@/components/sections/CategoryProducts'
import EmailForm from '@/components/sections/EmailForm'
import { getHomePageProducts } from '@/lib/queries'

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
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '1',
    highPrice: '10000',
    priceCurrency: 'PEN',
    availability: 'https://schema.org/InStock',
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingDestination: {
        '@type': 'DefinedRegion',
        addressCountry: 'PE',
      },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: {
          '@type': 'QuantitativeValue',
          minValue: 1,
          maxValue: 3,
          unitCode: 'DAY',
        },
        transitTime: {
          '@type': 'QuantitativeValue',
          minValue: 1,
          maxValue: 7,
          unitCode: 'DAY',
        },
      },
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'PE',
      returnPolicyCategory:
        'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 30,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/ReturnShippingFees',
    },
  },
}

export default async function Home() {
  const { productItems, taladradoItems, insertosItems, fresasCarbuItems } =
    await getHomePageProducts()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
        />
      <Hero/>
      <CategoryProducts />
      <FeaturedProducts
        productItems={productItems}
        taladradoItems={taladradoItems}
        insertosItems={insertosItems}
        fresasCarbuItems={fresasCarbuItems}
      />
        <KeyPoints />
    </>
  )
}
