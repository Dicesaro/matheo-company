'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Code, List } from 'lucide-react'
import { toast } from 'sonner'
import { createProduct, updateProduct } from '@/lib/actions/products'
import DynamicList from '@/components/admin/DynamicList'
import SpecificationsEditor from '@/components/admin/SpecificationsEditor'
import GalleryUpload from '@/components/admin/GalleryUpload'

interface Category { id: string; name: string; parent_id?: string | null }
interface Brand { id: string; name: string }

interface ProductFormProps {
  categories: Category[]
  brands: Brand[]
  defaultValues?: {
    id: string
    name: string
    description?: string | null
    long_description?: string | null
    image_url?: string | null
    images_gallery?: string[] | null
    price?: number | null
    original_price?: number | null
    discount?: number | null
    rating?: number | null
    featured?: boolean
    category_id?: string | null
    brand_id?: string | null
    features?: string[] | null
    benefits?: string[] | null
    work_materials?: string[] | null
    specifications?: { label: string; value: string }[] | null
  }
}

const MATERIALS = [
  { char: 'P', label: 'Papel', color: '#1e40af' },
  { char: 'M', label: 'Metal', color: '#facc15' },
  { char: 'K', label: 'Plástico', color: '#dc2626' },
  { char: 'N', label: 'Telas', color: '#16a34a' },
  { char: 'S', label: 'Sublimación', color: '#f77d0c' },
  { char: 'H', label: 'Madera', color: '#4b5563' },
]

function buildCategoryOptions(cats: Category[]): { id: string; displayName: string }[] {
  const idToParentId: Record<string, string | null> = {}
  const idToName: Record<string, string> = {}
  for (const c of cats) {
    idToParentId[c.id] = c.parent_id || null
    idToName[c.id] = c.name
  }
  const result: { id: string; displayName: string }[] = []
  for (const c of cats) {
    if (!c.parent_id) {
      result.push({ id: c.id, displayName: c.name })
      const children = cats.filter((cc) => cc.parent_id === c.id)
      for (const child of children) {
        result.push({ id: child.id, displayName: `— ${child.name}` })
      }
    }
  }
  const orphans = cats.filter((c) => c.parent_id && !idToParentId[c.parent_id])
  for (const o of orphans) {
    if (!result.find((r) => r.id === o.id)) {
      result.push({ id: o.id, displayName: o.name })
    }
  }
  return result
}

export default function ProductForm({ categories, brands, defaultValues }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [features, setFeatures] = useState<string[]>(defaultValues?.features || [])
  const [benefits, setBenefits] = useState<string[]>(defaultValues?.benefits || [])
  const [featuresJson, setFeaturesJson] = useState('')
  const [benefitsJson, setBenefitsJson] = useState('')
  const [featuresMode, setFeaturesMode] = useState<'list' | 'json'>('list')
  const [benefitsMode, setBenefitsMode] = useState<'list' | 'json'>('list')
  const [specsMode, setSpecsMode] = useState<'list' | 'json'>('list')
  const [specsJson, setSpecsJson] = useState('')
  const categoryOptions = buildCategoryOptions(categories)
  const [workMaterials, setWorkMaterials] = useState<string[]>(defaultValues?.work_materials || [])
  const [specifications, setSpecifications] = useState<{ label: string; value: string }[]>(defaultValues?.specifications || [])
  const [galleryImages, setGalleryImages] = useState<string[]>(defaultValues?.images_gallery || [])

  const isEditing = !!defaultValues

  const toggleMaterial = (char: string) => {
    setWorkMaterials((prev) =>
      prev.includes(char) ? prev.filter((m) => m !== char) : [...prev, char],
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const mainImage = galleryImages[0] || ''
    if (mainImage) formData.set('image_url', mainImage)

    formData.set('features', JSON.stringify(features))
    formData.set('benefits', JSON.stringify(benefits))
    formData.set('work_materials', JSON.stringify(workMaterials))
    formData.set('specifications', JSON.stringify(specifications))
    formData.set('images_gallery', JSON.stringify(galleryImages))

    const result = isEditing
      ? await updateProduct(defaultValues!.id, formData)
      : await createProduct(formData)

    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
      return
    }

    toast.success(isEditing ? 'Producto actualizado' : 'Producto creado')
    router.push('/admin/productos')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700">Nombre *</Label>
          <Input
            id="name"
            name="name"
            defaultValue={defaultValues?.name}
            className="border-gray-200 focus-visible:ring-matheo-red"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-gray-700">Precio</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              defaultValue={defaultValues?.price ?? ''}
              className="border-gray-200 focus-visible:ring-matheo-red"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="original_price" className="text-gray-700">Precio original</Label>
            <Input
              id="original_price"
              name="original_price"
              type="number"
              step="0.01"
              defaultValue={defaultValues?.original_price ?? ''}
              className="border-gray-200 focus-visible:ring-matheo-red"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount" className="text-gray-700">Dto. (%)</Label>
            <Input
              id="discount"
              name="discount"
              type="number"
              step="0.01"
              defaultValue={defaultValues?.discount ?? ''}
              className="border-gray-200 focus-visible:ring-matheo-red"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category_id" className="text-gray-700">Categoría</Label>
          <Select name="category_id" defaultValue={defaultValues?.category_id || ''}>
            <SelectTrigger className="border-gray-200 focus-visible:ring-matheo-red">
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand_id" className="text-gray-700">Marca</Label>
          <Select name="brand_id" defaultValue={defaultValues?.brand_id || ''}>
            <SelectTrigger className="border-gray-200 focus-visible:ring-matheo-red">
              <SelectValue placeholder="Seleccionar marca" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating" className="text-gray-700">Rating (0-5)</Label>
          <Input
            id="rating"
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            defaultValue={defaultValues?.rating ?? ''}
            className="border-gray-200 focus-visible:ring-matheo-red"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700">Imagen principal</Label>
        <p className="text-xs text-gray-500">Se usa la primera imagen de la galería</p>
        {galleryImages[0] ? (
          <div className="relative h-32 w-32 overflow-hidden rounded-xl border-2 border-gray-100 shadow-sm">
            <Image src={galleryImages[0]} alt="Principal" fill className="object-cover" />
          </div>
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
            <span className="text-xs text-gray-400">Sin imagen</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700">Galería de imágenes</Label>
        <GalleryUpload value={galleryImages} onChange={setGalleryImages} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-gray-700">Descripción corta</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultValues?.description || ''}
          className="border-gray-200 focus-visible:ring-matheo-red"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="long_description" className="text-gray-700">Descripción larga</Label>
        <Textarea
          id="long_description"
          name="long_description"
          rows={5}
          defaultValue={defaultValues?.long_description || ''}
          className="border-gray-200 focus-visible:ring-matheo-red"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-gray-700">Características</Label>
          <button
            type="button"
            onClick={() => {
              if (featuresMode === 'list') {
                setFeaturesJson(JSON.stringify(features, null, 2))
                setFeaturesMode('json')
              } else {
                try {
                  const parsed = JSON.parse(featuresJson)
                  if (Array.isArray(parsed) && parsed.every((i) => typeof i === 'string')) {
                    setFeatures(parsed)
                    setFeaturesMode('list')
                  } else {
                    toast.error('El JSON debe ser un array de strings')
                  }
                } catch {
                  toast.error('JSON inválido')
                }
              }
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-matheo-blue transition-colors"
          >
            {featuresMode === 'list' ? <Code className="h-3.5 w-3.5" /> : <List className="h-3.5 w-3.5" />}
            {featuresMode === 'list' ? 'JSON' : 'Lista'}
          </button>
        </div>
        {featuresMode === 'list' ? (
          <DynamicList
            value={features}
            onChange={setFeatures}
            placeholder="Ej. Alta precisión"
            addLabel="Agregar característica"
          />
        ) : (
          <Textarea
            value={featuresJson}
            onChange={(e) => setFeaturesJson(e.target.value)}
            rows={8}
            className="border-gray-200 focus-visible:ring-matheo-red font-mono text-sm"
            placeholder='["item1", "item2"]'
          />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-gray-700">Beneficios</Label>
          <button
            type="button"
            onClick={() => {
              if (benefitsMode === 'list') {
                setBenefitsJson(JSON.stringify(benefits, null, 2))
                setBenefitsMode('json')
              } else {
                try {
                  const parsed = JSON.parse(benefitsJson)
                  if (Array.isArray(parsed) && parsed.every((i) => typeof i === 'string')) {
                    setBenefits(parsed)
                    setBenefitsMode('list')
                  } else {
                    toast.error('El JSON debe ser un array de strings')
                  }
                } catch {
                  toast.error('JSON inválido')
                }
              }
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-matheo-blue transition-colors"
          >
            {benefitsMode === 'list' ? <Code className="h-3.5 w-3.5" /> : <List className="h-3.5 w-3.5" />}
            {benefitsMode === 'list' ? 'JSON' : 'Lista'}
          </button>
        </div>
        {benefitsMode === 'list' ? (
          <DynamicList
            value={benefits}
            onChange={setBenefits}
            placeholder="Ej. Mayor durabilidad"
            addLabel="Agregar beneficio"
          />
        ) : (
          <Textarea
            value={benefitsJson}
            onChange={(e) => setBenefitsJson(e.target.value)}
            rows={8}
            className="border-gray-200 focus-visible:ring-matheo-red font-mono text-sm"
            placeholder='["item1", "item2"]'
          />
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700">Materiales de trabajo</Label>
        <div className="flex flex-wrap gap-3">
          {MATERIALS.map((m) => {
            const isActive = workMaterials.includes(m.char)
            return (
              <button
                key={m.char}
                type="button"
                onClick={() => toggleMaterial(m.char)}
                className={`flex flex-col items-center w-14 rounded-lg border-2 transition-all overflow-hidden ${
                  isActive
                    ? 'border-gray-400 shadow-md'
                    : 'border-gray-200 opacity-40 grayscale hover:opacity-60'
                }`}
              >
                <div
                  style={{ backgroundColor: m.color }}
                  className="h-8 w-full flex items-center justify-center font-black text-sm text-white"
                >
                  {m.char}
                </div>
                <div className="h-5 w-full bg-white flex items-center justify-center">
                  {isActive && <div className="w-2 h-2 rounded-full bg-gray-900 shadow-inner" />}
                </div>
                <span className="text-[10px] text-gray-500 pb-0.5">{m.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-gray-700">Especificaciones técnicas</Label>
          <button
            type="button"
            onClick={() => {
              if (specsMode === 'list') {
                setSpecsJson(JSON.stringify(specifications, null, 2))
                setSpecsMode('json')
              } else {
                try {
                  const parsed = JSON.parse(specsJson)
                  if (Array.isArray(parsed) && parsed.every((i) => typeof i.label === 'string' && typeof i.value === 'string')) {
                    setSpecifications(parsed)
                    setSpecsMode('list')
                  } else {
                    toast.error('El JSON debe ser un array de { label, value }')
                  }
                } catch {
                  toast.error('JSON inválido')
                }
              }
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-matheo-blue transition-colors"
          >
            {specsMode === 'list' ? <Code className="h-3.5 w-3.5" /> : <List className="h-3.5 w-3.5" />}
            {specsMode === 'list' ? 'JSON' : 'Lista'}
          </button>
        </div>
        {specsMode === 'list' ? (
          <SpecificationsEditor value={specifications} onChange={setSpecifications} />
        ) : (
          <Textarea
            value={specsJson}
            onChange={(e) => setSpecsJson(e.target.value)}
            rows={8}
            className="border-gray-200 focus-visible:ring-matheo-red font-mono text-sm"
            placeholder='[{"label": "Material", "value": "Acero"}]'
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="featured"
          name="featured"
          value="true"
          defaultChecked={defaultValues?.featured || false}
          className="data-[state=checked]:bg-matheo-red data-[state=checked]:border-matheo-red"
        />
        <Label htmlFor="featured" className="text-gray-700">Producto destacado</Label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="bg-matheo-red hover:bg-matheo-red/90 shadow-lg shadow-matheo-red/25"
        >
          {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/productos')}
          className="border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
