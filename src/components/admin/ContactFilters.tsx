'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { Calendar, X } from 'lucide-react'

export default function ContactFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  const from = searchParams.get('from') || ''
  const to = searchParams.get('to') || ''

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      startTransition(() => {
        router.push(`/admin/contactos?${params.toString()}`)
      })
    },
    [router, searchParams, startTransition],
  )

  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.push('/admin/contactos')
    })
  }, [router, startTransition])

  const hasFilters = from || to

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Calendar className="h-3.5 w-3.5" />
        <span>Filtrar por fecha:</span>
      </div>

      <input
        type="date"
        value={from}
        onChange={(e) => updateFilter('from', e.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none transition-colors focus:border-matheo-blue focus:ring-1 focus:ring-matheo-blue/20 disabled:opacity-50"
        disabled={pending}
      />

      <span className="text-xs text-gray-400">hasta</span>

      <input
        type="date"
        value={to}
        onChange={(e) => updateFilter('to', e.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none transition-colors focus:border-matheo-blue focus:ring-1 focus:ring-matheo-blue/20 disabled:opacity-50"
        disabled={pending}
      />

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
        >
          <X className="h-3 w-3" />
          Limpiar
        </button>
      )}

      {pending && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-matheo-blue" />
      )}
    </div>
  )
}
