'use client'
import { useState } from 'react'
import { Send } from 'lucide-react'

const PHONE_NUMBER = '51922922766'

export default function Contact() {
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const subjectLabels: Record<string, string> = {
      cotizacion: 'Solicitud de Cotización',
      consulta: 'Consulta de Producto',
      garantia: 'Garantía / Servicio Técnico',
      otro: 'Otro',
    }

    const message = `*Nuevo Contacto - Web*\n\n*Nombre:* ${formData.name}\n*Email:* ${formData.email}\n*Teléfono:* ${formData.phone}\n*Asunto:* ${subjectLabels[formData.subject] || formData.subject}\n*Mensaje:*\n${formData.message}`

    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setSubmitting(false)
  }

  return (
    <section
      id="contacto"
      className="py-12 bg-linear-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2
            id="contacto"
            className="text-3xl md:text-4xl font-bold text-matheo-blue mb-3"
          >
            Contáctanos
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Estamos aquí para ayudarte. Envíanos tu consulta y te
            responderemos a la brevedad
          </p>
        </div>

        {/* Map and Form - Side by Side */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Contact Form */}
          <div className="h-full">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8 h-full border border-gray-100"
            >
              <h3 className="text-2xl font-bold text-matheo-blue mb-6">
                Envíanos un mensaje
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-matheo-blue focus:bg-white focus:outline-none transition-all"
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-matheo-blue focus:bg-white focus:outline-none transition-all"
                      placeholder="cliente@email.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-matheo-blue focus:bg-white focus:outline-none transition-all"
                      placeholder="+51 ..."
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Asunto *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-matheo-blue focus:bg-white focus:outline-none transition-all"
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="cotizacion">
                      Solicitud de Cotización
                    </option>
                    <option value="consulta">
                      Consulta de Producto
                    </option>
                    <option value="garantia">
                      Garantía / Servicio Técnico
                    </option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-matheo-blue focus:bg-white focus:outline-none transition-all resize-none"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-matheo-red hover:bg-red-700 text-white py-3.5 rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={22} />
                      <span>Enviar Mensaje</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Map */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full min-h-96 relative border border-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d975.4946309633432!2d-77.05172132281241!3d-12.044998535099145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c935f7f5da97%3A0x7feac36b833a107e!2sIndustrial%20Company%20Matheo%20EIRL%20%7C%20Fresado%2C%20Torneado%20y%20Roscado!5e0!3m2!1ses-419!2spe!4v1777826884409!5m2!1ses-419!2spe"
              width="600"
              height="350"
              style={{ border: 0, minHeight: '350px' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Matheo Industrial"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}
