import { notFound } from 'next/navigation'
import { ArrowLeft, Mail, Phone, Calendar, Tag, User } from 'lucide-react'
import { getContact, markAsRead } from '@/lib/actions/contacts'
import ButtonLink from '@/components/admin/ButtonLink'

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

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let contact
  try {
    contact = await getContact(id)
  } catch {
    notFound()
  }

  if (!contact) notFound()

  if (!contact.read) {
    await markAsRead(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 animate-slide-up-fade">
        <ButtonLink
          variant="ghost"
          size="icon"
          href="/admin/contactos"
          className="rounded-xl"
        >
          <ArrowLeft className="h-5 w-5" />
        </ButtonLink>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Mensaje de {contact.name}
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Detalle del mensaje de contacto
          </p>
        </div>
      </div>

      <div className="animate-slide-up-fade stagger-1">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Información del contacto
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-gray-100 p-2.5">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nombre</p>
                  <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-gray-100 p-2.5">
                  <Mail className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</p>
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
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Teléfono</p>
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
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Asunto</p>
                  <p className="text-sm font-medium text-gray-900">
                    {subjectLabels[contact.subject] || contact.subject}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:col-span-2">
                <div className="rounded-xl bg-gray-100 p-2.5">
                  <Calendar className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Fecha</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(contact.created_at)}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Mensaje</p>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {contact.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
