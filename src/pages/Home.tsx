"use client";
import Hero from '../components/Hero';
import Brands from '../components/Brands';
import Contact from '../components/Contact';
import FeaturedProducts from '../components/Products';
import SEOHead from '../components/SEOHead';

export default function Home() {
  return (
    <>
      <SEOHead
        title="Importador y Distribuidor de Herramientas Industriales"
        description="Industrial Company MATHEO — Importador y distribuidor líder de herramientas industriales de precisión para la industria metalmecánica en Perú. Brocas, machos, fresas, insertos y más."
        canonical="/"
        keywords="herramientas industriales Peru, importador herramientas Lima, distribuidor herramientas metalmecánicas"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Industrial Company MATHEO EIRL',
          url: 'https://industrialcompanymatheo.com',
          logo: 'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774217586/MATHEO_icon_jnkkah.ico',
          description: 'Importador y distribuidor líder de herramientas industriales de precisión para la industria metalmecánica en Perú.',
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
        }}
      />
      <Hero />
      <FeaturedProducts />
      <Brands />
      <Contact />
    </>
  );
}

