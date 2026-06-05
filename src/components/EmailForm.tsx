'use client'
import Image from 'next/image'

export default function EmailForm() {
  return (
    <div className="container mx-auto px-4 md:px-20 pt-8">
      <div className="flex flex-col md:flex-row items-stretch gap-6">
        <div className="hidden md:block md:w-1/2 md:py-0">
          <div className="h-full rounded-2xl overflow-hidden">
            <Image
              src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1780613174/Gemini_Generated_Image_7t3wzq7t3wzq7t3w_1_b7adja.png"
              alt=""
              width={600}
              height={500}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center pb-8 md:py-12">
          <h2 className="text-4xl text-center font-bold text-matheo-blue mb-2">
            Mandanos un mensaje
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Déjanos tu consulta y te responderemos a la brevedad
          </p>
          <div className="w-full bg-white rounded-2xl shadow-2xl p-4 md:p-6 border border-gray-100">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget as HTMLFormElement
                const data = new FormData(form)
                const name = data.get('name') as string
                const email = data.get('email') as string
                const message = data.get('message') as string
                const subject = 'Consulta desde la web - MATHEO'
                const body = `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`
                window.location.href = `mailto:ventas@matheocompany.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
              }}
              className="space-y-3"
            >
              <div>
                <label htmlFor="form-name" className="block text-xs font-bold text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="form-name"
                  name="name"
                  required
                  className="w-full px-3 py-2 bg-gray-50 border-2 border-transparent rounded-xl focus:border-matheo-blue focus:bg-white focus:outline-none transition-all text-sm"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label htmlFor="form-email" className="block text-xs font-bold text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="form-email"
                  name="email"
                  required
                  className="w-full px-3 py-2 bg-gray-50 border-2 border-transparent rounded-xl focus:border-matheo-blue focus:bg-white focus:outline-none transition-all text-sm"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label htmlFor="form-message" className="block text-xs font-bold text-gray-700 mb-1">
                  Mensaje *
                </label>
                <textarea
                  id="form-message"
                  name="message"
                  required
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 border-2 border-transparent rounded-xl focus:border-matheo-blue focus:bg-white focus:outline-none transition-all resize-none text-sm"
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-matheo-red hover:bg-red-700 text-white py-2.5 rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-2xl"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
