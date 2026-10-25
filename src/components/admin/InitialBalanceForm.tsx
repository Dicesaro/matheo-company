'use client'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { setMonthInitialBalance } from '@/lib/actions/account-movements'

export default function InitialBalanceForm({
  initialBalance,
  year,
  month,
  ledger = 'general',
}: {
  initialBalance: number
  year: number
  month: number
  ledger?: string
}) {
  const router = useRouter()
  const [value, setValue] = useState(String(initialBalance))
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const formData = new FormData()
    formData.set('ledger', ledger)
    formData.set('year', String(year))
    formData.set('month', String(month))
    formData.set('initial_balance', value)
    const result = await setMonthInitialBalance(formData)

    if (result?.error) {
      toast.error(result.error)
      setSaving(false)
      return
    }

    toast.success('Monto inicial del mes actualizado')
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="flex items-end gap-2">
      <Input
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-36 border-gray-200 focus-visible:ring-matheo-red/30"
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-xl bg-matheo-red px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-matheo-red/90 disabled:opacity-50"
      >
        {saving ? 'Guardando...' : 'Guardar'}
      </button>
    </div>
  )
}
