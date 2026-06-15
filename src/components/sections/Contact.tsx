'use client'
import { useState, useEffect } from 'react'
import { Send, MapPin, Phone, Mail, ExternalLink, Play } from 'lucide-react'

const PHONE_NUMBER = '51922922766'

// TODO: Reemplazar con las URLs reales de cada red social
const bannerLinks = ['#', '#', '#']

export default function Contact() {
  const [submitting, setSubmitting] = useState(false)
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
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
      className="pb-12 bg-linear-to-b from-gray-50 to-white pt-2 md:pt-12"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        {/* ── Bloque Superior: Info + Mapa ── */}
        <div className="flex flex-col md:flex-row justify-center items-start gap-8 mb-12">
          {/* Columna Izquierda: Datos de Contacto */}
          <div className="w-full md:w-auto md:min-w-72">
            <h2 className="text-3xl md:text-4xl font-bold text-matheo-blue mb-6">
              Contáctanos
            </h2>

            <div className="space-y-5">
              {/* Dirección */}
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-matheo-blue shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900">Dirección</p>
                  <p className="text-gray-600 text-sm">
                    Av. Argentina N° 639 Int. Calle 10 Stand B218-B219
                    C.C. UDAMPE Lima Cercado, Perú
                  </p>
                </div>
              </div>

              {/* Celular */}
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-matheo-blue shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900">Celular</p>
                  <p className="text-gray-600 text-sm">922 922 766</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-matheo-blue shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900">Email</p>
                  <a
                    href="mailto:ventas@welderpower.com.pe"
                    className="text-gray-600 text-sm hover:text-matheo-blue transition-colors"
                  >
                    ventas@matheocompany.com
                  </a>
                </div>
              </div>

              {/* Facebook */}
              <div className="flex items-start gap-4">
                <ExternalLink className="w-6 h-6 text-matheo-blue shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900">Facebook</p>
                  <a
                    href="https://www.facebook.com/IndustrialCompanyMatheo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 text-sm hover:text-matheo-blue transition-colors"
                  >
                    Facebook Oficial
                  </a>
                </div>
              </div>

              {/* TikTok */}
              <div className="flex items-start gap-4">
                <Play className="w-6 h-6 text-matheo-blue shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900">TikTok</p>
                  <a
                    href="https://www.tiktok.com/@industrialcompanymatheo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 text-sm hover:text-matheo-blue transition-colors"
                  >
                    TikTok Oficial
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Mapa */}
          <div className=" w-full md:w-300 bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 h-87 md:h-112">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d975.4946309633432!2d-77.05172132281241!3d-12.044998535099145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c935f7f5da97%3A0x7feac36b833a107e!2sIndustrial%20Company%20Matheo%20EIRL%20%7C%20Fresado%2C%20Torneado%20y%20Roscado!5e0!3m2!1ses-419!2spe!4v1777826884409!5m2!1ses-419!2spe"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Matheo Industrial"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

        {/* ── Bloque Inferior: Formulario + Banners ── */}
        <div>
          {/* Formulario */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-5 lg:p-6 border border-gray-100"
          >
            <h3 className="text-lg font-bold text-matheo-blue mb-4">
              Envíanos un mensaje
            </h3>

            <div className="space-y-3">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-bold text-gray-700 mb-1"
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
                  className="w-full px-3 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl focus:border-matheo-blue focus:bg-white focus:outline-none transition-all text-sm"
                  placeholder="Tu nombre"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-gray-700 mb-1"
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
                    className="w-full px-3 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl focus:border-matheo-blue focus:bg-white focus:outline-none transition-all text-sm"
                    placeholder="cliente@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-bold text-gray-700 mb-1"
                  >
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl focus:border-matheo-blue focus:bg-white focus:outline-none transition-all text-sm"
                    placeholder="+51 ..."
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-xs font-bold text-gray-700 mb-1"
                >
                  Asunto *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl focus:border-matheo-blue focus:bg-white focus:outline-none transition-all text-sm"
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
                  className="block text-xs font-bold text-gray-700 mb-1"
                >
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-matheo-blue focus:bg-white focus:outline-none transition-all resize-none text-sm"
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-matheo-red hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    <span>Enviar Mensaje</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
