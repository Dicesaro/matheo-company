import { Suspense } from 'react'
import { Metadata } from 'next'
import ScrollToTop from '@/components/ScrollToTop'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import './globals.css'

export const metadata: Metadata = {
  title: 'Industrial Company Matheo',
  description:
    'Industrial Company MATHEO — Importador y distribuidor líder de herramientas industriales de precisión para la industria metalmecánica en Perú. Brocas, machos, fresas, insertos y más.',
  verification: {
    google: 'k8m7_9fLgPXrMoJVh_NsYbpEgaLDo0n0sa_npWWvStc',
  },
  keywords:
    'herramientas industriales Peru, importador herramientas Lima, distribuidor herramientas metalmecánicas',
  icons: {
    icon: 'https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774823626/MATHEO_icon_sgykvs.svg',
  },
  alternates: {
    canonical: 'https://industrialcompanymatheo.com',
  },
  openGraph: {
    type: 'website',
    url: 'https://industrialcompanymatheo.com',
    title: 'Industrial Company MATHEO',
    description:
      'Industrial Company MATHEO — Importador y distribuidor líder de herramientas industriales de precisión para la industria metalmecánica en Perú. Brocas, machos, fresas, insertos y más.',
    locale: 'es_PE',
    siteName: 'Industrial Company MATHEO',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="antialiased font-sans">
        <ScrollToTop />
        <div className="min-h-screen flex flex-col overflow-x-hidden">
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <main className="grow">{children}</main>
          <Footer />
          <WhatsAppButton />
        </div>
      </body>
    </html>
  )
}
