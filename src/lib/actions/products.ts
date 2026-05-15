'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { getMutationClient } from '@/lib/supabase-admin'

export async function getProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name), brands(name)')
    .order('name')

  if (error) throw new Error(error.message)
  return data
}

export async function getProduct(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name), brands(name)')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function createProduct(formData: FormData) {
  const supabase = await getMutationClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const longDescription = formData.get('long_description') as string
  const imageUrl = formData.get('image_url') as string
  const price = formData.get('price') as string
  const originalPrice = formData.get('original_price') as string
  const discount = formData.get('discount') as string
  const rating = formData.get('rating') as string
  const categoryId = formData.get('category_id') as string
  const brandId = formData.get('brand_id') as string
  const featured = formData.get('featured') === 'true'
  const features = formData.get('features') as string
  const benefits = formData.get('benefits') as string
  const workMaterials = formData.get('work_materials') as string
  const specifications = formData.get('specifications') as string
  const imagesGallery = formData.get('images_gallery') as string

  if (!name?.trim()) {
    return { error: 'El nombre es requerido' }
  }

  const payload: Record<string, unknown> = {
    name: name.trim(),
    description: description?.trim() || null,
    long_description: longDescription?.trim() || null,
    category_id: categoryId || null,
    brand_id: brandId || null,
    price: price ? Number(price) : null,
    original_price: originalPrice ? Number(originalPrice) : null,
    discount: discount ? Number(discount) : null,
    rating: rating ? Number(rating) : null,
    featured,
  }

  if (imageUrl) payload.image_url = imageUrl

  try {
    if (features) payload.features = JSON.parse(features)
    if (benefits) payload.benefits = JSON.parse(benefits)
    if (workMaterials) payload.work_materials = JSON.parse(workMaterials)
    if (specifications) payload.specifications = JSON.parse(specifications)
    if (imagesGallery) payload.images_gallery = JSON.parse(imagesGallery)
  } catch {
    return { error: 'Error al procesar los datos del formulario' }
  }

  const { error } = await supabase.from('products').insert(payload)

  if (error) return { error: error.message }

  revalidatePath('/admin/productos')
  return { success: true }
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await getMutationClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const longDescription = formData.get('long_description') as string
  const imageUrl = formData.get('image_url') as string
  const price = formData.get('price') as string
  const originalPrice = formData.get('original_price') as string
  const discount = formData.get('discount') as string
  const rating = formData.get('rating') as string
  const categoryId = formData.get('category_id') as string
  const brandId = formData.get('brand_id') as string
  const featured = formData.get('featured') === 'true'
  const features = formData.get('features') as string
  const benefits = formData.get('benefits') as string
  const workMaterials = formData.get('work_materials') as string
  const specifications = formData.get('specifications') as string
  const imagesGallery = formData.get('images_gallery') as string

  if (!name?.trim()) {
    return { error: 'El nombre es requerido' }
  }

  const payload: Record<string, unknown> = {
    name: name.trim(),
    description: description?.trim() || null,
    long_description: longDescription?.trim() || null,
    category_id: categoryId || null,
    brand_id: brandId || null,
    price: price ? Number(price) : null,
    original_price: originalPrice ? Number(originalPrice) : null,
    discount: discount ? Number(discount) : null,
    rating: rating ? Number(rating) : null,
    featured,
  }

  if (imageUrl) payload.image_url = imageUrl

  try {
    if (features) payload.features = JSON.parse(features)
    else payload.features = []
    if (benefits) payload.benefits = JSON.parse(benefits)
    else payload.benefits = []
    if (workMaterials) payload.work_materials = JSON.parse(workMaterials)
    else payload.work_materials = []
    if (specifications) payload.specifications = JSON.parse(specifications)
    else payload.specifications = []
    if (imagesGallery) payload.images_gallery = JSON.parse(imagesGallery)
    else payload.images_gallery = []
  } catch {
    return { error: 'Error al procesar los datos del formulario' }
  }

  const { error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/productos')
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = await getMutationClient()

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/productos')
  return { success: true }
}
