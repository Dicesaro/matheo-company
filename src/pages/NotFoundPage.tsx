'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Home, ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'

export default function NotFoundPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <section className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-6xl w-full">
        <div className="flex flex-col md:flex-row items-center justify-center mb-16">
          <div className="relative p-8 md:p-12 rounded-md flex items-center justify-center flex-1 max-w-2xl">
            <h1 className="text-4xl md:text-7xl font-bold text-black tracking-tight text-center">
              Página no encontrada
            </h1>
          </div>

          <div className="flex-1 flex justify-center max-w-sm">
            <Image
              src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774824496/MATE_bnxcae.png"
              alt="Mascota Matheo"
              priority
              width={400}
              height={400}
              className="w-full h-auto"
            />
          </div>
        </div>
        {/* Description: Centered below */}
        <div className="text-center mb-12">
          <p className="text-xl text-[#333] max-w-2xl mx-auto leading-relaxed">
            Parece que has llegado a un territorio desconocido.
            <br />
            No te preocupes, te ayudaremos a encontrar el camino de
            regreso.
          </p>
        </div>

        {/* Buttons: Centered below description */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={'/'}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#4A699C] text-white font-semibold rounded-lg shadow-md transition-all hover:bg-[#3d5a8a] active:scale-95 whitespace-nowrap"
          >
            <Home className="w-5 h-5" />
            Volver al inicio
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#4A699C] border-2 border-[#4A699C]/20 font-semibold rounded-lg shadow-sm transition-all hover:bg-gray-50 active:scale-95 whitespace-nowrap"
          >
            <ArrowLeft className="w-5 h-5" />
            Regresar
          </button>
        </div>
      </div>
    </section>
  )
}
