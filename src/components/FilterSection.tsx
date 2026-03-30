'use client'
import { ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'

interface FilterSectionProps {
  title: string
  icon: React.ElementType
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

export default function FilterSection({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  children,
}: FilterSectionProps) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 group transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="text-matheo-blue group-hover:scale-110 transition-transform duration-300">
            <Icon size={24} strokeWidth={1.5} />
          </div>
          <span className="font-bold text-gray-900 text-lg">
            {title}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'transition-transform duration-300 text-gray-400',
            isOpen && 'rotate-180',
          )}
          size={20}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-[500px] pb-6' : 'max-h-0',
        )}
      >
        {children}
      </div>
    </div>
  )
}
