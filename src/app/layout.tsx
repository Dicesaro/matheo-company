import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from 'next/font/google'
import "./globals.css";
import AppShell from '@/components/layout/AppShell';
import { GoogleTagManager } from '@next/third-parties/google';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Industrial Company Matheo',
  description:
    'Importador y Distribuidor de Herramientas para la Industria Metalmecánica',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "";

  return (
    <html lang="es" className={plusJakarta.variable}>
      <body className="antialiased font-sans">
        <AppShell>{children}</AppShell>
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
      </body>
    </html>
  );
}
