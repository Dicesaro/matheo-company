'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  currentPage: number
  totalPages: number
  basePath: string
}

export default function ClientPagination({ currentPage, totalPages, basePath }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`)
  }

  const getPages = () => {
    const pages: (number | 'ellipsis')[] = []
    const delta = 1
    const rangeStart = Math.max(2, currentPage - delta)
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta)
    pages.push(1)
    if (rangeStart > 2) pages.push('ellipsis')
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i)
    if (rangeEnd < totalPages - 1) pages.push('ellipsis')
    if (totalPages > 1) pages.push(totalPages)
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-1.5 border-t border-gray-100 px-6 py-4">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getPages().map((page, i) =>
        page === 'ellipsis' ? (
          <span key={`e-${i}`} className="flex h-9 w-9 items-center justify-center text-sm text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`flex h-9 min-w-[36px] items-center justify-center rounded-xl px-2 text-sm font-medium transition-all duration-200 ${
              page === currentPage
                ? 'bg-matheo-red text-white shadow-sm shadow-matheo-red/20'
                : 'border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
