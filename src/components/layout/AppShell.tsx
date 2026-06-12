'use client'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import ScrollToTop from '@/components/layout/ScrollToTop'

function NavbarPlaceholder() {
  return <div className="h-36 bg-gray-100" />
}

// Rutas en las que NO se debe mostrar el Navbar, Footer ni WhatsApp
const HIDDEN_LAYOUT_ROUTES = ['/redes']
const isAdminRoute = (pathname: string) => pathname.startsWith('/admin')

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const currentPath = pathname ?? ''
  const hideLayout = HIDDEN_LAYOUT_ROUTES.some((route) => currentPath === route) || isAdminRoute(currentPath)

  if (hideLayout) {
    return (
      <>
        <ScrollToTop />
        {children}
      </>
    )
  }

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <Suspense fallback={<NavbarPlaceholder />}>
          <Navbar />
        </Suspense>
        <main className="grow">{children}</main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  )
}
