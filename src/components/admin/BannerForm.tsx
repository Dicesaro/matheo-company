'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'

interface BannerFormProps {
  defaultTitle?: string
  defaultImageUrl?: string
  defaultMobileImageUrl?: string
  defaultLinkUrl?: string
  defaultPosition?: number
  defaultActive?: boolean
}

export default function BannerForm({
  defaultTitle = '',
  defaultImageUrl = '',
  defaultMobileImageUrl = '',
  defaultLinkUrl = '',
  defaultPosition = 0,
  defaultActive = true,
}: BannerFormProps) {
  const [desktopUrl, setDesktopUrl] = useState(defaultImageUrl)
  const [mobileUrl, setMobileUrl] = useState(defaultMobileImageUrl)

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title" className="text-gray-700">Título</Label>
        <Input
          id="title"
          name="title"
          defaultValue={defaultTitle}
          placeholder="Ej: Fresas Rotativas"
          className="border-gray-200 focus-visible:ring-matheo-red"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url" className="text-gray-700">URL imagen (desktop)</Label>
        <Input
          id="image_url"
          name="image_url"
          value={desktopUrl}
          onChange={(e) => setDesktopUrl(e.target.value)}
          placeholder="https://res.cloudinary.com/..."
          className="border-gray-200 focus-visible:ring-matheo-red font-mono text-sm"
          required
        />
        {desktopUrl && (
          <div className="relative h-32 w-full overflow-hidden rounded-xl border border-gray-100 shadow-sm">
            <Image
              src={desktopUrl}
              alt="Vista previa desktop"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mobile_image_url" className="text-gray-700">
          URL imagen (móvil) <span className="text-gray-400 font-normal">— opcional</span>
        </Label>
        <Input
          id="mobile_image_url"
          name="mobile_image_url"
          value={mobileUrl}
          onChange={(e) => setMobileUrl(e.target.value)}
          placeholder="https://res.cloudinary.com/..."
          className="border-gray-200 focus-visible:ring-matheo-red font-mono text-sm"
        />
        {mobileUrl && (
          <div className="relative h-32 w-24 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
            <Image
              src={mobileUrl}
              alt="Vista previa móvil"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="link_url" className="text-gray-700">
          URL de enlace <span className="text-gray-400 font-normal">— opcional</span>
        </Label>
        <Input
          id="link_url"
          name="link_url"
          defaultValue={defaultLinkUrl}
          placeholder="https://industrialcompanymatheo.com/catalogo"
          className="border-gray-200 focus-visible:ring-matheo-red font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="position" className="text-gray-700">Posición</Label>
          <Input
            id="position"
            name="position"
            type="number"
            min={0}
            defaultValue={defaultPosition}
            className="border-gray-200 focus-visible:ring-matheo-red"
          />
        </div>
        <div className="flex items-end gap-2 pb-2">
          <Checkbox
            id="active"
            name="active"
            value="true"
            defaultChecked={defaultActive}
            className="data-[state=checked]:bg-matheo-red data-[state=checked]:border-matheo-red"
          />
          <Label htmlFor="active" className="text-gray-700">Activo</Label>
        </div>
      </div>
    </>
  )
}