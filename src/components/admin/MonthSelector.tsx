'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

export const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export default function MonthSelector({
  year,
  month,
}: {
  year?: number
  month?: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const now = new Date()
  const isInline = year !== undefined && month !== undefined

  const [selYear, setSelYear] = useState(year ?? now.getFullYear())
  const [selMonth, setSelMonth] = useState(month ?? now.getMonth() + 1)

  const years = Array.from({ length: 9 }, (_, i) => now.getFullYear() + 1 - i)

  const navigate = (yy: number, mm: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    params.set('year', String(yy))
    params.set('month', String(mm))
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleYear = (value: unknown) => {
    const yy = Number(value)
    setSelYear(yy)
    if (isInline) navigate(yy, selMonth)
  }

  const handleMonth = (value: unknown) => {
    const mm = Number(value)
    setSelMonth(mm)
    if (isInline) navigate(selYear, mm)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={String(selYear)} onValueChange={handleYear}>
        <SelectTrigger className="w-28 border-gray-200">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={String(selMonth)} onValueChange={handleMonth}>
        <SelectTrigger className="w-36 border-gray-200">
          <SelectValue>
            {(value: unknown) => MONTHS[Number(value) - 1] ?? String(value ?? '')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((name, index) => (
            <SelectItem key={name} value={String(index + 1)}>{name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!isInline && (
        <Button
          type="button"
          onClick={() => navigate(selYear, selMonth)}
          className="bg-matheo-red hover:bg-matheo-red/90 shadow-lg shadow-matheo-red/25"
        >
          Ver movimientos
        </Button>
      )}
    </div>
  )
}