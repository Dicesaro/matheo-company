'use client'

import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SpecItem {
  label: string
  value: string
}

interface SpecificationsEditorProps {
  value: SpecItem[]
  onChange: (value: SpecItem[]) => void
}

export default function SpecificationsEditor({ value, onChange }: SpecificationsEditorProps) {
  const addItem = () => onChange([...value, { label: '', value: '' }])
  const removeItem = (index: number) => onChange(value.filter((_, i) => i !== index))
  const updateItem = (index: number, field: 'label' | 'value', text: string) => {
    const updated = [...value]
    updated[index] = { ...updated[index], [field]: text }
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="grid flex-1 grid-cols-2 gap-2">
            <Input
              value={item.label}
              onChange={(e) => updateItem(index, 'label', e.target.value)}
              placeholder="Etiqueta (ej. Material)"
              className="border-gray-200 focus-visible:ring-matheo-red"
            />
            <Input
              value={item.value}
              onChange={(e) => updateItem(index, 'value', e.target.value)}
              placeholder="Valor (ej. Acero)"
              className="border-gray-200 focus-visible:ring-matheo-red"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeItem(index)}
            className="mt-0 shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
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
        Agregar especificación
      </Button>
    </div>
  )
}
