'use client'

import { useRouter, usePathname } from 'next/navigation'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

interface CategoryFilterProps {
  categories: { id: string; name: string }[]
  defaultValue?: string
  searchQuery?: string
}

export default function CategoryFilter({ categories, defaultValue, searchQuery }: CategoryFilterProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (value: string | null) => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (value && value !== '__all__') params.set('categoria', value)
    const query = params.toString()
    router.push(`${pathname}${query ? `?${query}` : ''}`)
  }

  return (
    <Select value={defaultValue || ''} onValueChange={handleChange}>
      <SelectTrigger className="border-gray-200 focus-visible:ring-matheo-red/30 rounded-xl">
        <SelectValue placeholder="Todas las categorías" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__all__">Todas las categorías</SelectItem>
        {categories.map((cat) => (
          <SelectItem key={cat.id} value={cat.id}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
