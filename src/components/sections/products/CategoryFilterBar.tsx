'use client'
import { useEffect, useRef, useState } from 'react'
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategoryFilterBarProps {
  categories: string[]
  activeCategory: string | null
  onSelectCategory: (category: string) => void
  onOpenFilters: () => void
  hasActiveFilters: boolean
}

export default function CategoryFilterBar({
  categories,
  activeCategory,
  onSelectCategory,
  onOpenFilters,
  hasActiveFilters,
}: CategoryFilterBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    updateScroll()
    const el = scrollRef.current
    if (!el) return
    const ro = new ResizeObserver(updateScroll)
    ro.observe(el)
    window.addEventListener('resize', updateScroll)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', updateScroll)
    }
  }, [categories])

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({
      left: dir * Math.min(320, el.clientWidth * 0.8),
      behavior: 'smooth',
    })
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onOpenFilters}
        className="shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-white bg-matheo-blue hover:bg-blue-700 shadow-sm transition-all active:scale-95"
        aria-label="Abrir filtros"
      >
        <Filter size={16} strokeWidth={2} />
        Filtros
        {hasActiveFilters && (
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        )}
      </button>

      <div className="relative flex-1 min-w-0">
        {canScrollLeft && (
          <div className="hidden md:flex absolute left-0 top-0 bottom-0 items-center z-10 pr-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Categorías anteriores"
              className="pointer-events-auto w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-matheo-blue hover:text-white transition-all"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        )}

        <div
          ref={scrollRef}
          onScroll={updateScroll}
          className="flex gap-2 overflow-x-auto no-scrollbar px-1 py-1"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={cn(
                  'shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm transition-all active:scale-95',
                  isActive
                    ? 'bg-gray-900 text-white font-bold shadow-md'
                    : 'bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 hover:text-gray-900',
                )}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {canScrollRight && (
          <div className="hidden md:flex absolute right-0 top-0 bottom-0 items-center z-10 pl-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none">
            <button
              onClick={() => scrollBy(1)}
              aria-label="Más categorías"
              className="pointer-events-auto w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-matheo-blue hover:text-white transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}