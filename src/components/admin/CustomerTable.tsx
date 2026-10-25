'use client'

import Link from 'next/link'
import { Users, Pencil } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import DeleteButton from '@/components/admin/DeleteButton'
import type { Customer } from '@/lib/actions/customers'

export default function CustomerTable({
  customers,
  deleteAction,
}: {
  customers: Customer[]
  deleteAction: (id: string) => Promise<{ error?: string; success?: boolean }>
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-gray-50">
          <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Nombre
          </TableHead>
          <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            RUC
          </TableHead>
          <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Teléfono
          </TableHead>
          <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Email
          </TableHead>
          <TableHead className="h-10 w-24 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Acciones
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="h-32 text-center text-sm text-gray-400">
              <div className="flex flex-col items-center justify-center gap-2">
                <Users className="h-8 w-8 text-gray-300" />
                <p>No hay clientes registrados</p>
              </div>
            </TableCell>
          </TableRow>
        )}
        {customers.map((customer) => (
          <TableRow
            key={customer.id}
            className="border-b border-gray-50 transition-all duration-200 hover:bg-gray-50/50"
          >
            <TableCell className="px-4 py-3 font-medium text-gray-900">
              {customer.name}
            </TableCell>
            <TableCell className="px-4 py-3 text-sm text-gray-500">
              {customer.ruc ?? '—'}
            </TableCell>
            <TableCell className="px-4 py-3 text-sm text-gray-500">
              {customer.phone ?? '—'}
            </TableCell>
            <TableCell className="px-4 py-3 text-sm text-gray-500">
              {customer.email ?? '—'}
            </TableCell>
            <TableCell className="px-4 py-3">
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/clientes/${customer.id}`}
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition-colors hover:text-matheo-blue"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeleteButton
                  id={customer.id}
                  action={deleteAction}
                  label={`el cliente ${customer.name}`}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}