'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

interface CustomerOption {
  id: string
  name: string
  ruc: string | null
}

interface MovementFormProps {
  customers: CustomerOption[]
  ledger?: string
  defaultCustomerId?: string
  defaultPartyName?: string
  defaultConcept?: string
  defaultType?: 'ingreso' | 'egreso'
  defaultIssueDate?: string
  defaultPaidDate?: string
  defaultAmount?: string
  defaultInvoiceNumber?: string
}

export default function MovementForm({
  customers,
  ledger = 'general',
  defaultCustomerId = '',
  defaultPartyName = '',
  defaultConcept = '',
  defaultType = 'egreso',
  defaultIssueDate = '',
  defaultPaidDate = '',
  defaultAmount = '',
  defaultInvoiceNumber = '',
}: MovementFormProps) {
  const isGeneral = ledger === 'general'

  return (
    <div className="space-y-4">
      <input type="hidden" name="ledger" value={ledger} />

      {isGeneral ? (
        <div className="space-y-2">
          <Label className="text-gray-700">Cliente / Empresa</Label>
          <Select name="customer_id" defaultValue={defaultCustomerId || undefined} required>
            <SelectTrigger className="w-full border-gray-200 focus-visible:ring-matheo-red">
              <SelectValue placeholder="Selecciona un cliente" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                  {customer.ruc ? ` — ${customer.ruc}` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="party_name" className="text-gray-700">Cliente / Referencia</Label>
          <Input
            id="party_name"
            name="party_name"
            defaultValue={defaultPartyName}
            placeholder="Ej: Nombre de la persona o referencia"
            className="border-gray-200 focus-visible:ring-matheo-red"
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="concept" className="text-gray-700">Concepto</Label>
        <Input
          id="concept"
          name="concept"
          defaultValue={defaultConcept}
          placeholder="Ej: Pago de factura, comisión, porte extracto..."
          className="border-gray-200 focus-visible:ring-matheo-red"
          required
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700">Tipo de movimiento</Label>
        <Select name="type" defaultValue={defaultType}>
          <SelectTrigger className="w-full border-gray-200 focus-visible:ring-matheo-red">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ingreso">Ingreso</SelectItem>
            <SelectItem value="egreso">Egreso</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="issue_date" className="text-gray-700">Fecha de emisión</Label>
          <Input
            id="issue_date"
            name="issue_date"
            type="date"
            defaultValue={defaultIssueDate}
            className="border-gray-200 focus-visible:ring-matheo-red"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paid_date" className="text-gray-700">Fecha de pago</Label>
          <Input
            id="paid_date"
            name="paid_date"
            type="date"
            defaultValue={defaultPaidDate}
            className="border-gray-200 focus-visible:ring-matheo-red"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-gray-700">Monto (S/)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaultAmount}
            placeholder="0.00"
            className="border-gray-200 focus-visible:ring-matheo-red"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invoice_number" className="text-gray-700">N.º de factura / boleta</Label>
          <Input
            id="invoice_number"
            name="invoice_number"
            defaultValue={defaultInvoiceNumber}
            placeholder="Ej: FQQ1-003310 (opcional)"
            className="border-gray-200 focus-visible:ring-matheo-red"
          />
        </div>
      </div>
    </div>
  )
}
