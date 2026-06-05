'use client'

import { Fragment } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

interface Category {
  id: string
  name: string
  parent_id: string | null
}

interface CategoryFilterProps {
  categories: Category[]
  defaultValue?: string
  searchQuery?: string
}

export default function CategoryFilter({ categories, defaultValue, searchQuery }: CategoryFilterProps) {
  const router = useRouter()
  const pathname = usePathname()

  const isValid =
    defaultValue &&
    defaultValue !== '__all__' &&
    categories.some((c) => c.name === defaultValue)
  const currentValue = isValid ? defaultValue : '__all__'

  const handleChange = (value: string | null) => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (value && value !== '__all__') params.set('categoria', value)
    const query = params.toString()
    router.push(`${pathname}${query ? `?${query}` : ''}`)
  }

  const parents = categories.filter((c) => !c.parent_id)
  const children = categories.filter((c) => c.parent_id)

  const getChildren = (parentId: string) =>
    children.filter((c) => c.parent_id === parentId)

  const orphans = children.filter(
    (c) => !parents.some((p) => p.id === c.parent_id),
  )

  return (
    <Select value={currentValue} onValueChange={handleChange}>
      <SelectTrigger className="border-gray-200 focus-visible:ring-matheo-red/30 rounded-xl">
        <SelectValue placeholder="Todas las categorías" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__all__">Todas las categorías</SelectItem>
        {parents.map((parent) => (
          <Fragment key={parent.id}>
            <SelectItem value={parent.name}>{parent.name}</SelectItem>
            {getChildren(parent.id).map((child) => (
              <SelectItem key={child.id} value={child.name} className="pl-6">
                ─ {child.name}
              </SelectItem>
            ))}
          </Fragment>
        ))}
        {orphans.map((orphan) => (
          <SelectItem key={orphan.id} value={orphan.name} className="pl-6">
            ─ {orphan.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
