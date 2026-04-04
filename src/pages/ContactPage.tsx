import { Suspense } from 'react'
import Contact from '../components/Contact'
import ScrollToTop from '../components/ScrollToTop'

export default function ContactPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ScrollToTop />
      <div className="pt-24 md:pt-32">
        <Contact />
      </div>
    </Suspense>
  )
}
