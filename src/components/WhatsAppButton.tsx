"use client";
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../lib/utils'

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    accepted: false,
  })

  useEffect(() => {
    // Al cargar, verificar si fue cerrado previamente en esta sesión
    const hasClosed = sessionStorage.getItem('whatsappModalClosed')
    if (!hasClosed) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1500) // Aparece 1.5s luego de que entra a la web
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem('whatsappModalClosed', 'true')
  }

  const phoneNumber = '51922922766'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.accepted) return

    const message = `*Asesoría Técnica*\n\n*Nombre:* ${formData.name}\n*Celular:* ${formData.phone}\n*Email:* ${formData.email}\n*Asunto:*\n${formData.subject}`
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, '_blank')
    handleClose()
    setFormData({
      name: '',
      phone: '',
      email: '',
      subject: '',
      accepted: false,
    })
  }

  const inputClasses =
    'w-full bg-slate-50 border border-matheo-blue/30 rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-matheo-blue focus:border-matheo-blue text-slate-800 placeholder:text-slate-500 transition-shadow'

  return (
    <>
      {/* ── Chat Modal ── */}
      <div
        className={cn(
          'fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[400px] max-h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-[0_15px_60px_rgba(0,0,0,0.2)] transition-all duration-400 origin-bottom-right',
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-8 pointer-events-none',
        )}
      >
        {/* Close Button overlapping top-left */}
        <button
          onClick={handleClose}
          className="absolute -top-3 -left-1 md:-top-4 md:-left-4 w-9 h-9 md:w-10 md:h-10 bg-matheo-red hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110 z-10"
          aria-label="Cerrar ventana"
        >
          <X size={20} strokeWidth={3} />
        </button>

        <div className="p-5 sm:p-7 md:p-8 overflow-y-auto">
          <h3 className="text-xl md:text-2xl font-black text-matheo-blue text-center mb-4 md:mb-6 drop-shadow-sm">
            Asesoría Técnica
          </h3>

          <form
            onSubmit={handleSubmit}
            className="space-y-3 md:space-y-4"
          >
            <input
              type="text"
              placeholder="Nombres y apellidos"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((p) => ({ ...p, name: e.target.value }))
              }
              className={inputClasses}
            />

            <input
              type="tel"
              placeholder="Celular"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData((p) => ({ ...p, phone: e.target.value }))
              }
              className={inputClasses}
            />

            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData((p) => ({ ...p, email: e.target.value }))
              }
              className={inputClasses}
            />

            <textarea
              placeholder="Asunto"
              required
              rows={3}
              value={formData.subject}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  subject: e.target.value,
                }))
              }
              className={cn(inputClasses, 'resize-none h-20 md:h-28')}
            />

            <label className="flex items-start gap-2.5 py-1 md:py-2 cursor-pointer group">
              <input
                type="checkbox"
                required
                checked={formData.accepted}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    accepted: e.target.checked,
                  }))
                }
                className="mt-1 shrink-0 w-4 h-4 border-matheo-blue/50 rounded text-matheo-blue focus:ring-matheo-blue cursor-pointer"
              />
              <span className="text-xs md:text-sm text-slate-600 leading-tight md:leading-snug group-hover:text-matheo-blue transition-colors">
                Declaro expresamente haber leído y aceptado las
                Políticas de Privacidad.
              </span>
            </label>

            <div className="flex justify-center pt-1 md:pt-3">
              <button
                type="submit"
                className="bg-matheo-red hover:bg-red-700 text-white font-bold text-base md:text-lg px-8 py-3 rounded-lg shadow-lg hover:shadow-red-500/40 w-full transition-all active:scale-[0.98]"
              >
                Enviar a WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Floating WhatsApp Button ── */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          if (isOpen) handleClose()
        }}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-[64px] h-[64px] bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 hover:shadow-[0_0_20px_rgba(37,211,102,0.6)] transition-all duration-300 group"
        aria-label="Abrir formulario de asesoría"
      >
        {!isOpen && (
          <>
            {/* Tooltip */}
            <span className="absolute right-full mr-4 px-4 py-2 bg-white text-gray-800 text-sm font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none border border-gray-100">
              ¿En qué podemos ayudarte?
              <span className="absolute top-1/2 -translate-y-1/2 left-full w-0 h-0 border-t-6px border-t-transparent border-b-6px border-b-transparent border-l-8px border-l-white"></span>
            </span>

            {/* Pulsing Ring Effect */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 duration-1000"></span>
          </>
        )}

        <img
          src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774823643/brand-whatsapp_xcnxmc.svg"
          alt="WhatsApp"
          className={cn(
            'w-9 h-9 relative z-10 transition-transform duration-300 brightness-0 invert',
            isOpen && 'rotate-180 scale-0 opacity-0',
          )}
        />
        {/* X icon that shows when open */}
        <X
          className={cn(
            'absolute text-white transition-all duration-300',
            isOpen
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-180 scale-0 opacity-0',
          )}
          size={32}
        />
      </button>
    </>
  )
}
