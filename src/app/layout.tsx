import { Suspense } from 'react' // ← agregar este import
import ScrollToTop from '@/components/ScrollToTop'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

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
            {' '}
            {/* ← envolver Navbar */}
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
