'use client'

import { useState, useRef } from 'react'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  onUpload: (url: string) => void
  defaultImage?: string
}

export default function ImageUpload({ onUpload, defaultImage }: ImageUploadProps) {
  const [preview, setPreview] = useState(defaultImage || '')
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
      setPreview(data.url)
      onUpload(data.url)
    } catch {
      alert('Error al subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview('')
    onUpload('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="group relative h-32 w-32 overflow-hidden rounded-xl border-2 border-gray-100 shadow-sm">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1.5 right-1.5 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
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
        )}

        {!preview && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-sm font-medium text-matheo-red hover:text-matheo-red/80 transition-colors"
            disabled={uploading}
          >
            {uploading ? 'Subiendo...' : 'Seleccionar imagen'}
          </button>
        )}
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
