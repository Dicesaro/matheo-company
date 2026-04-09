import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ScrollToTop from '@/components/ScrollToTop';

export const metadata: Metadata = {
  title: "Industrial Company Matheo",
  description: "Importador y Distribuidor de Herramientas para la Industria Metalmecánica",
  icons: {
    icon: "https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774823626/MATHEO_icon_sgykvs.svg",
  },
};

function NavbarPlaceholder() {
  return <div className="h-20 bg-gray-100" />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased font-sans">
        <ScrollToTop />
        <div className="min-h-screen flex flex-col overflow-x-hidden">
          <Suspense fallback={<NavbarPlaceholder />}>
            <Navbar />
          </Suspense>
          <main className="grow">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </body>
    </html>
  );
}
