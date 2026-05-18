'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRef } from 'react'

export default function SearchInput({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const handleSearch = (value: string) => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams()
      if (value) params.set('q', value)
      router.push(`${pathname}?${params.toString()}`)
    }, 300)
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="Buscar productos..."
        defaultValue={defaultValue}
        onChange={(e) => handleSearch(e.target.value)}
        className="border-gray-200 pl-9 focus-visible:ring-matheo-red/30 bg-white rounded-xl"
      />
    </div>
  )
}
