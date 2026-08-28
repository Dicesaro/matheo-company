'use client'

import { useState } from 'react'
import { Eye, Mail, MailOpen } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import DeleteButton from '@/components/admin/DeleteButton'
import ContactDetailModal from '@/components/admin/ContactDetailModal'

const subjectLabels: Record<string, string> = {
  cotizacion: 'Solicitud de Cotización',
  consulta: 'Consulta de Producto',
  garantia: 'Garantía / Servicio Técnico',
  otro: 'Otro',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
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

export default function ContactTable({
  contacts,
  deleteAction,
}: {
  contacts: Contact[]
  deleteAction: (id: string) => Promise<{ error?: string; success?: boolean }>
}) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [readIds, setReadIds] = useState<Set<string>>(new Set())

  const isRead = (contact: Contact) => contact.read || readIds.has(contact.id)

  const handleMarkedAsRead = (id: string) => {
    setReadIds((prev) => new Set(prev).add(id))
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-50">
            <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Estado
            </TableHead>
            <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Nombre
            </TableHead>
            <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Email
            </TableHead>
            <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Asunto
            </TableHead>
            <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Fecha
            </TableHead>
            <TableHead className="h-10 w-24 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-sm text-gray-400">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Mail className="h-8 w-8 text-gray-300" />
                  <p>No hay mensajes de contacto</p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {contacts.map((contact) => {
            const read = isRead(contact)
            return (
              <TableRow
                key={contact.id}
                className={`border-b border-gray-50 transition-all duration-200 hover:bg-gray-50/50 ${
                  !read ? 'bg-blue-50/30' : ''
                }`}
              >
                <TableCell className="px-4 py-3">
                  {read ? (
                    <MailOpen className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Mail className="h-4 w-4 text-matheo-blue" />
                  )}
                </TableCell>
                <TableCell className={`px-4 py-3 font-medium ${!read ? 'text-gray-900' : 'text-gray-700'}`}>
                  {contact.name}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-500">
                  {contact.email}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-500">
                  {subjectLabels[contact.subject] || contact.subject}
                </TableCell>
                <TableCell className="px-4 py-3 text-xs text-gray-400">
                  {formatDate(contact.created_at)}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedContact(contact)}
                      className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-matheo-blue transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <DeleteButton
                      id={contact.id}
                      action={deleteAction}
                      label={`el mensaje de ${contact.name}`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {selectedContact && (
        <ContactDetailModal
          contact={{ ...selectedContact, read: isRead(selectedContact) }}
          open={!!selectedContact}
          onOpenChange={(open) => {
            if (!open) setSelectedContact(null)
          }}
          onMarkedAsRead={handleMarkedAsRead}
        />
      )}
    </>
  )
}
