'use client'

import { useState, useRef } from 'react'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface GalleryUploadProps {
  value: string[]
  onChange: (value: string[]) => void
}

export default function GalleryUpload({ value, onChange }: GalleryUploadProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Error al subir')

      const data = await res.json()
      onChange([...value, data.url])
    } catch {
      alert('Error al subir la imagen')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3">
        {value.map((url, index) => (
          <div key={index} className="group relative h-32 w-32 overflow-hidden rounded-xl border-2 border-gray-100 shadow-sm">
            <Image
              src={url}
              alt={`Galería ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1.5 right-1.5 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <div
          onClick={() => inputRef.current?.click()}
          className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-colors hover:border-matheo-red/50 hover:bg-matheo-red/5"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-matheo-red" />
          ) : (
            <ImagePlus className="h-6 w-6 text-gray-400" />
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
