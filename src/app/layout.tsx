import type { Metadata } from "next";
import "./globals.css";
import AppShell from '@/components/AppShell';

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
  return (
    <html lang="es">
      <body className="antialiased font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
