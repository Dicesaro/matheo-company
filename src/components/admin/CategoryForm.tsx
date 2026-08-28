'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ImageUpload from '@/components/admin/ImageUpload'

interface CategoryFormProps {
  defaultName?: string
  defaultImageUrl?: string
}

export default function CategoryForm({
  defaultName = '',
  defaultImageUrl = '',
}: CategoryFormProps) {
  const [imageUrl, setImageUrl] = useState(defaultImageUrl)

  return (
    <>
      <div className="space-y-2">
        <Label className="text-gray-700">Imagen de la categoría</Label>
        <ImageUpload
          onUpload={setImageUrl}
          defaultImage={defaultImageUrl}
        />
        <input type="hidden" name="image_url" value={imageUrl} />
        <p className="text-xs text-gray-400">
          Se muestra en la sección &quot;Nuestras Categorías&quot; de la web
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-700">Nombre</Label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultName}
          placeholder="Ej: Herramientas de Corte"
          className="border-gray-200 focus-visible:ring-matheo-red"
          required
        />
      </div>
    </>
  )
}