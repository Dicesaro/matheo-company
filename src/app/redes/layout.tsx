import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nuestras Redes | Industrial Company MATHEO',
  description:
    'Síguenos en nuestras redes sociales y contáctanos por WhatsApp para asesoría técnica en herramientas industriales.',
  robots: 'noindex, nofollow',
}

export default function RedesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
