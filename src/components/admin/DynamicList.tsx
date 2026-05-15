'use client'

import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface DynamicListProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  addLabel?: string
}

export default function DynamicList({ value, onChange, placeholder, addLabel }: DynamicListProps) {
  const addItem = () => onChange([...value, ''])
  const removeItem = (index: number) => onChange(value.filter((_, i) => i !== index))
  const updateItem = (index: number, text: string) => {
    const updated = [...value]
    updated[index] = text
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder={placeholder}
            className="border-gray-200 focus-visible:ring-matheo-red"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeItem(index)}
            className="shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        className="border-gray-200 text-gray-600 hover:bg-gray-50"
      >
        <Plus className="h-4 w-4 mr-1" />
        {addLabel || 'Agregar'}
      </Button>
    </div>
  )
}
