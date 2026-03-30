'use client';

import { Send, CheckCircle2 } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';

const ComplaintsBookPage = () => {
  const [state, handleSubmit] = useForm("xzddpdzk");

  if (state.succeeded) {
    return (
      <div className="container mx-auto px-4 py-16 pt-48 text-center">
        <div className="max-w-md mx-auto bg-green-50 p-12 rounded-3xl border border-green-100">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-matheo-blue mb-4">¡Reclamo Registrado!</h2>
          <p className="text-gray-600 mb-8">
            Su hoja de reclamación ha sido enviada correctamente. Se ha generado un registro y nos pondremos en contacto con usted a la brevedad posible para atender su solicitud.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-matheo-blue text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-900 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 pt-24 md:pt-32">
        <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#C41E3A]">Libro de Reclamaciones</h1>
        </div>
        
        <p className="text-gray-600 mb-8 text-center text-lg">
          Conforme a lo establecido en el Código de Protección y Defensa del Consumidor, este establecimiento cuenta con un Libro de Reclamaciones a su disposición.
        </p>

        <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-xl">
          {/* Hidden field for email subject */}
          <input type="hidden" name="_subject" value="Nuevo Reclamo/Queja - Libro de Reclamaciones" />

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Nombre Completo</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-matheo-red focus:ring-1 focus:ring-matheo-red transition-colors"
                placeholder="Juan Pérez"
              />
              <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-500 text-xs mt-1" />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-matheo-red focus:ring-1 focus:ring-matheo-red transition-colors"
                placeholder="juan@ejemplo.com"
              />
              <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-xs mt-1" />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">Teléfono</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-matheo-red focus:ring-1 focus:ring-matheo-red transition-colors"
                placeholder="999 999 999"
              />
              <ValidationError prefix="Phone" field="phone" errors={state.errors} className="text-red-500 text-xs mt-1" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label htmlFor="documentType" className="block text-sm font-medium text-gray-400 mb-2">Documento</label>
                <select
                  id="documentType"
                  name="documentType"
                  className="w-full bg-black border border-gray-800 rounded-lg px-2 py-3 text-white focus:outline-none focus:border-matheo-red focus:ring-1 focus:ring-matheo-red transition-colors"
                >
                  <option value="DNI">DNI</option>
                  <option value="RUC">RUC</option>
                  <option value="CE">CE</option>
                </select>
              </div>
              <div className="col-span-2">
                <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-400 mb-2">Número</label>
                <input
                  type="text"
                  id="documentNumber"
                  name="documentNumber"
                  required
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-matheo-red focus:ring-1 focus:ring-matheo-red transition-colors"
                  placeholder="12345678"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">Tipo de Solicitud</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="Reclamo"
                  defaultChecked
                  className="text-matheo-red focus:ring-matheo-red bg-black border-gray-800"
                />
                <span className="text-white">Reclamo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="Queja"
                  className="text-matheo-red focus:ring-matheo-red bg-black border-gray-800"
                />
                <span className="text-white">Queja</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * <strong>Reclamo:</strong> Disconformidad relacionada a los productos o servicios. <br/>
              * <strong>Queja:</strong> Disconformidad no relacionada a los productos o servicios; o, malestar o descontento respecto a la atención al público.
            </p>
          </div>

          <div className="mb-8">
            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-2">Detalle del Reclamo o Queja</label>
            <textarea
              id="description"
              name="description"
              required
              rows={6}
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-matheo-red focus:ring-1 focus:ring-matheo-red transition-colors resize-none"
              placeholder="Describa aquí el detalle de su reclamo o queja..."
            ></textarea>
            <ValidationError prefix="Description" field="description" errors={state.errors} className="text-red-500 text-xs mt-1" />
          </div>

          <button
            type="submit"
            disabled={state.submitting}
            className="w-full bg-matheo-red hover:bg-red-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.submitting ? (
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
  );
};

export default ComplaintsBookPage;
