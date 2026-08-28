'use client'
import { useState } from 'react'
import Image from 'next/image'
import { submitContact } from '@/lib/actions/contacts'

export default function EmailForm() {
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    await submitContact({
      name: formData.name,
      email: formData.email,
      subject: 'Consulta desde la web - MATHEO',
      message: formData.message,
    })

    const body = `Nombre: ${formData.name}\nEmail: ${formData.email}\n\nMensaje:\n${formData.message}`
    window.location.href = `mailto:ventas@matheocompany.com?subject=${encodeURIComponent('Consulta desde la web - MATHEO')}&body=${encodeURIComponent(body)}`

    setFormData({ name: '', email: '', message: '' })
    setSubmitting(false)
  }

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
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="form-name" className="block text-xs font-bold text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="form-name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
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
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
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
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 border-2 border-transparent rounded-xl focus:border-matheo-blue focus:bg-white focus:outline-none transition-all resize-none text-sm"
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-matheo-red hover:bg-red-700 text-white py-2.5 rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Enviar Mensaje'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
