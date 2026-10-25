'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useRef } from 'react'

interface CustomerOption {
  id: string
  name: string
}

export default function MovementFilters({
  customers,
}: {
  customers: CustomerOption[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const q = searchParams?.get('q') ?? ''
  const type = searchParams?.get('type') ?? 'all'
  const customer = searchParams?.get('customer') ?? 'all'

  const push = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    if (value && value !== 'all') params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSearch = (value: string) => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => push('q', value), 300)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Buscar por concepto..."
          defaultValue={q}
          onChange={(e) => handleSearch(e.target.value)}
          className="border-gray-200 pl-9 focus-visible:ring-matheo-red/30 bg-white rounded-xl"
        />
      </div>

      <Select value={type} onValueChange={(value) => push('type', value as string)}>
        <SelectTrigger className="w-full border-gray-200 sm:w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los tipos</SelectItem>
          <SelectItem value="ingreso">Ingresos</SelectItem>
          <SelectItem value="egreso">Egresos</SelectItem>
        </SelectContent>
      </Select>

      <Select value={customer} onValueChange={(value) => push('customer', value as string)}>
        <SelectTrigger className="w-full border-gray-200 sm:w-56">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los clientes</SelectItem>
          {customers.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}