'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

const PHONE_NUMBER = '51922922766'

const ComplaintsBookPage = () => {
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    documentType: 'DNI',
    documentNumber: '',
    type: 'Reclamo',
    description: '',
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

    const message = `*Libro de Reclamaciones*\n\n*Nombre:* ${formData.name}\n*Email:* ${formData.email}\n*Teléfono:* ${formData.phone}\n*Documento:* ${formData.documentType} - ${formData.documentNumber}\n*Tipo:* ${formData.type}\n*Detalle:*\n${formData.description}`

    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setSubmitting(false)
  }

  return (
    <div className="container mx-auto px-4 py-10 pt-39 md:pt-40">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-matheo-red">
            Libro de Reclamaciones
          </h1>
        </div>

        <p className="600 mb-8 text-center text-lg">
          Conforme a lo establecido en el Código de Protección y
          Defensa del Consumidor, este establecimiento cuenta con un
          Libro de Reclamaciones a su disposición.
        </p>

        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-xl border border-gray-800 shadow-xl"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium 400 mb-2"
              >
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full  border border-gray-800 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-matheo-red focus:ring-1 focus:ring-matheo-red transition-colors"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium 400 mb-2"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full  border border-gray-800 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-matheo-red focus:ring-1 focus:ring-matheo-red transition-colors"
                placeholder="juan@ejemplo.com"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium 400 mb-2"
              >
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full  border border-gray-800 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-matheo-red focus:ring-1 focus:ring-matheo-red transition-colors"
                placeholder="999 999 999"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label
                  htmlFor="documentType"
                  className="block text-sm font-medium 400 mb-2"
                >
                  Documento
                </label>
                <select
                  id="documentType"
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  className="w-full  border border-gray-800 rounded-lg px-2 py-3 text-black focus:outline-none focus:border-matheo-red focus:ring-1 focus:ring-matheo-red transition-colors"
                >
                  <option value="DNI">DNI</option>
                  <option value="RUC">RUC</option>
                  <option value="CE">CE</option>
                </select>
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="documentNumber"
                  className="block text-sm font-medium 400 mb-2"
                >
                  Número
                </label>
                <input
                  type="text"
                  id="documentNumber"
                  name="documentNumber"
                  required
                  value={formData.documentNumber}
                  onChange={handleChange}
                  className="w-full  border border-gray-800 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-matheo-red focus:ring-1 focus:ring-matheo-red transition-colors"
                  placeholder="12345678"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Tipo de Solicitud
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="Reclamo"
                  checked={formData.type === 'Reclamo'}
                  onChange={handleChange}
                  className="text-matheo-red focus:ring-matheo-red  border-gray-800"
                />
                <span className="text-black">Reclamo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="Queja"
                  checked={formData.type === 'Queja'}
                  onChange={handleChange}
                  className="text-matheo-red focus:ring-matheo-red  border-gray-800"
                />
                <span>Queja</span>
              </label>
            </div>
            <p className="text-xs  mt-2">
              * <strong>Reclamo:</strong> Disconformidad relacionada a
              los productos o servicios. <br />*{' '}
              <strong>Queja:</strong> Disconformidad no relacionada a
              los productos o servicios; o, malestar o descontento
              respecto a la atención al público.
            </p>
          </div>

          <div className="mb-8">
            <label
              htmlFor="description"
              className="block text-sm font-medium 400 mb-2"
            >
              Detalle del Reclamo o Queja
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={6}
              value={formData.description}
              onChange={handleChange}
              className="w-full  border border-gray-800 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-matheo-red focus:ring-1 focus:ring-matheo-red transition-colors resize-none"
              placeholder="Describa aquí el detalle de su reclamo o queja..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-matheo-red hover:bg-red-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send size={20} />
                Enviar Hoja de Reclamación
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ComplaintsBookPage
