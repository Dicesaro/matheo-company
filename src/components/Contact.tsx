"use client";
import { Send, CheckCircle2 } from 'lucide-react'
import { useForm, ValidationError } from '@formspree/react'

export default function Contact() {
  const [state, handleSubmit] = useForm('xzddpdzk')

  if (state.succeeded) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto bg-green-50 p-12 rounded-3xl border border-green-100">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-matheo-blue mb-4">
              ¡Mensaje Enviado!
            </h2>
            <p className="text-gray-600 mb-8">
              Gracias por contactarnos. Nuestro equipo revisará tu
              mensaje y te responderá a la brevedad posible.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-matheo-blue text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-900 transition-colors"
            >
              Enviar otro mensaje
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="contacto"
      className="py-16 bg-linear-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            id="contacto"
            className="text-4xl md:text-5xl font-bold text-matheo-blue mb-4"
          >
            Contáctanos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos aquí para ayudarte. Envíanos tu consulta y te
            responderemos a la brevedad
          </p>
        </div>

        {/* Map and Form - Side by Side */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Contact Form */}
          <div className="h-full">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 h-full border border-gray-100"
            >
              <h3 className="text-3xl font-bold text-matheo-blue mb-8">
                Envíanos un mensaje
              </h3>

              <div className="space-y-6">
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
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-matheo-blue focus:bg-white focus:outline-none transition-all"
                    placeholder="Tu nombre"
                  />
                  <ValidationError
                    prefix="Name"
                    field="name"
                    errors={state.errors}
                    className="text-red-500 text-xs mt-1"
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
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-matheo-blue focus:bg-white focus:outline-none transition-all"
                      placeholder="cliente@email.com"
                    />
                    <ValidationError
                      prefix="Email"
                      field="email"
                      errors={state.errors}
                      className="text-red-500 text-xs mt-1"
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
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-matheo-blue focus:bg-white focus:outline-none transition-all"
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
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-matheo-blue focus:bg-white focus:outline-none transition-all"
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
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-matheo-blue focus:bg-white focus:outline-none transition-all resize-none"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                  <ValidationError
                    prefix="Message"
                    field="message"
                    errors={state.errors}
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={state.submitting}
                  className="w-full bg-matheo-red hover:bg-red-700 text-white py-5 rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {state.submitting ? (
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
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full min-h-[500px] relative border border-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1160.0652423344322!2d-77.05080696595397!3d-12.044978502457365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTLCsDAyJzQwLjgiUyA3N8KwMDMnMDMuMSJX!5e0!3m2!1sen!2spe!4v1767975991274!5m2!1sen!2spe"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '500px' }}
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
