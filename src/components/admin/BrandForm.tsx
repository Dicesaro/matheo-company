'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ImageUpload from '@/components/admin/ImageUpload'

interface BrandFormProps {
  defaultName?: string
  defaultImageUrl?: string
}

export default function BrandForm({ defaultName = '', defaultImageUrl = '' }: BrandFormProps) {
  const [imageUrl, setImageUrl] = useState(defaultImageUrl)

  return (
    <>
      <div className="space-y-2">
        <Label className="text-gray-700">Imagen de la marca</Label>
        <ImageUpload
          onUpload={setImageUrl}
          defaultImage={defaultImageUrl}
        />
        <input type="hidden" name="image_url" value={imageUrl} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-700">Nombre</Label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultName}
          placeholder="Ej: Bosch"
          className="border-gray-200 focus-visible:ring-matheo-red"
          required
        />
      </div>
    </>
  )
}
