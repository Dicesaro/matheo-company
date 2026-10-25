'use client'

import Link from 'next/link'
import { Wallet, Pencil, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import DeleteButton from '@/components/admin/DeleteButton'
import type { AccountMovement } from '@/lib/actions/account-movements'

function formatMoney(value: number) {
  return `S/ ${Number(value).toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(value: string) {
  if (!value) return '—'
  const [y, m, d] = value.split('-')
  if (!y || !m || !d) return value
  return `${d}/${m}/${y}`
}

export default function MovementTable({
  movements,
  deleteAction,
}: {
  movements: AccountMovement[]
  deleteAction: (id: string) => Promise<{ error?: string; success?: boolean }>
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-gray-50">
          <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Concepto / Empresa
          </TableHead>
          <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Tipo
          </TableHead>
          <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            N.º Factura
          </TableHead>
          <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Emisión
          </TableHead>
          <TableHead className="h-10 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Pago
          </TableHead>
          <TableHead className="h-10 px-4 text-right text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Monto
          </TableHead>
          <TableHead className="h-10 px-4 text-right text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Saldo
          </TableHead>
          <TableHead className="h-10 w-24 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Acciones
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movements.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="h-32 text-center text-sm text-gray-400">
              <div className="flex flex-col items-center justify-center gap-2">
                <Wallet className="h-8 w-8 text-gray-300" />
                <p>No hay movimientos registrados</p>
              </div>
            </TableCell>
          </TableRow>
        )}
        {movements.map((movement) => {
          const isIngreso = movement.type === 'ingreso'
          return (
            <TableRow
              key={movement.id}
              className={`border-b border-gray-50 transition-all duration-200 hover:bg-gray-50/50 ${
                isIngreso ? '' : 'bg-red-50/30'
              }`}
            >
              <TableCell className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {movement.customers?.name || movement.party_name || '—'}
                  </span>
                  <span className="text-xs text-gray-500">{movement.concept}</span>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                    isIngreso
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {isIngreso ? (
                    <ArrowDownLeft className="h-3 w-3" />
                  ) : (
                    <ArrowUpRight className="h-3 w-3" />
                  )}
                  {isIngreso ? 'Ingreso' : 'Egreso'}
                </span>
              </TableCell>
              <TableCell className="px-4 py-3 text-sm text-gray-500">
                {movement.invoice_number || '—'}
              </TableCell>
              <TableCell className="px-4 py-3 text-sm text-gray-500">
                {formatDate(movement.issue_date)}
              </TableCell>
              <TableCell className="px-4 py-3 text-sm text-gray-500">
                {formatDate(movement.paid_date)}
              </TableCell>
              <TableCell
                className={`px-4 py-3 text-right text-sm font-semibold ${
                  isIngreso ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isIngreso ? '+' : '−'} {formatMoney(movement.amount)}
              </TableCell>
              <TableCell className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                {formatMoney(movement.balance)}
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/cuenta-corriente/${movement.id}`}
                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition-colors hover:text-matheo-blue"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <DeleteButton
                    id={movement.id}
                    action={deleteAction}
                    label={`el movimiento "${movement.concept}"`}
                  />
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}