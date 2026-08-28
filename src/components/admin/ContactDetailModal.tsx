'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Phone, Calendar, Tag, User, Check } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { markAsRead } from '@/lib/actions/contacts'

const subjectLabels: Record<string, string> = {
  cotizacion: 'Solicitud de Cotización',
  consulta: 'Consulta de Producto',
  garantia: 'Garantía / Servicio Técnico',
  otro: 'Otro',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-PE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface Contact {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  read: boolean
  created_at: string
}

export default function ContactDetailModal({
  contact,
  open,
  onOpenChange,
  onMarkedAsRead,
}: {
  contact: Contact
  open: boolean
  onOpenChange: (open: boolean) => void
  onMarkedAsRead: (id: string) => void
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleMarkAsRead = async () => {
    setLoading(true)
    const result = await markAsRead(contact.id)
    if (!result?.error) {
      onMarkedAsRead(contact.id)
      onOpenChange(false)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Mensaje de {contact.name}
          </DialogTitle>
          <DialogDescription>
            Detalle del mensaje de contacto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-gray-100 p-2.5">
                <User className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Nombre</p>
                <p className="text-sm font-medium text-gray-900">{contact.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-gray-100 p-2.5">
                <Mail className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Email</p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-sm font-medium text-matheo-blue hover:underline"
                >
                  {contact.email}
                </a>
              </div>
            </div>

            {contact.phone && (
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-gray-100 p-2.5">
                  <Phone className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Teléfono</p>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-sm font-medium text-matheo-blue hover:underline"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-gray-100 p-2.5">
                <Tag className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Asunto</p>
                <p className="text-sm font-medium text-gray-900">
                  {subjectLabels[contact.subject] || contact.subject}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-gray-100 p-2.5">
              <Calendar className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Fecha</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(contact.created_at)}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Mensaje</p>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {contact.message}
              </p>
            </div>
          </div>
        </div>

        {!contact.read && (
          <div className="border-t border-gray-100 pt-4 flex justify-end">
            <button
              onClick={handleMarkAsRead}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-matheo-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-matheo-blue/90 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              OK
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
