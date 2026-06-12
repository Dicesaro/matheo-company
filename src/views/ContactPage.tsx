import { Suspense } from 'react'
import Contact from '@/components/sections/Contact'
import ScrollToTop from '@/components/layout/ScrollToTop'

export default function ContactPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ScrollToTop />
      <div className="pt-28 md:pt-36">
        <Contact />
      </div>
    </Suspense>
  )
}
