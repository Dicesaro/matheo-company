import { Metadata } from 'next'
import { Suspense } from 'react'
import FavoritosPage from '@/views/FavoritosPage'

export const metadata: Metadata = {
  title: 'Mis Favoritos | MATHEO',
  description: 'Tus productos favoritos de herramientas industriales guardados para cotizar rápido.',
  alternates: {
    canonical: 'https://industrialcompanymatheo.com/favoritos',
  },
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <FavoritosPage />
    </Suspense>
  )
}
