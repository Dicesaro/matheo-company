import type { Metadata } from 'next'
import PrivadoView from '@/views/PrivadoView'

export const metadata: Metadata = {
  title: 'Acceso restringido - MATHEO',
  robots: { index: false, follow: false },
}

export default function DocumentoRestringidoPage() {
  return <PrivadoView />
}
