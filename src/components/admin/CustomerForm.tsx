'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CustomerFormProps {
  defaultName?: string
  defaultRuc?: string
  defaultPhone?: string
  defaultEmail?: string
}

export default function CustomerForm({
  defaultName = '',
  defaultRuc = '',
  defaultPhone = '',
  defaultEmail = '',
}: CustomerFormProps) {
  const [ruc, setRuc] = useState(defaultRuc)

  const handleRucChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '')
    setRuc(digits.slice(0, 11))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-700">Nombre o razón social</Label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultName}
          placeholder="Ej: Constructora Matheo S.A.C."
          className="border-gray-200 focus-visible:ring-matheo-red"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ruc" className="text-gray-700">RUC</Label>
        <Input
          id="ruc"
          name="ruc"
          value={ruc}
          onChange={handleRucChange}
          placeholder="Ej: 20123456789"
          inputMode="numeric"
          maxLength={11}
          className="border-gray-200 focus-visible:ring-matheo-red"
        />
        <p className="text-xs text-gray-400">Máximo 11 dígitos</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-gray-700">Teléfono</Label>
        <Input
          id="phone"
          name="phone"
          defaultValue={defaultPhone}
          placeholder="Ej: 999 123 456"
          inputMode="tel"
          className="border-gray-200 focus-visible:ring-matheo-red"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={defaultEmail}
          placeholder="Ej: cliente@empresa.com"
          className="border-gray-200 focus-visible:ring-matheo-red"
        />
      </div>
    </div>
  )
}