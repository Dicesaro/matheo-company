'use server'

import { revalidatePath } from 'next/cache'
import { ZodError } from 'zod'
import { createClient } from '@/lib/supabase-server'
import { getMutationClient } from '@/lib/supabase-admin'
import { brandPayloadSchema } from '@/lib/schemas/brand'

export async function getBrands() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name')

  if (error) throw new Error(error.message)
  return data
}

export async function createBrand(formData: FormData) {
  const supabase = await getMutationClient()
  const name = formData.get('name') as string
  const image_url = formData.get('image_url') as string

  const payload = { name: name?.trim() || '', image_url: image_url || null }

  try {
    brandPayloadSchema.parse(payload)
  } catch (e) {
    if (e instanceof ZodError) {
      const firstError = e.issues[0]
      return { error: firstError?.message || 'Datos inválidos' }
    }
    return { error: 'Datos inválidos' }
  }

  const { error } = await supabase
    .from('brands')
    .insert(payload)

  if (error) {
    if (error.code === '23505') return { error: 'Esta marca ya existe' }
    return { error: error.message }
  }

  revalidatePath('/admin/marcas')
  revalidatePath('/marcas')
  return { success: true }
}

export async function updateBrand(id: string, formData: FormData) {
  const supabase = await getMutationClient()
  const name = formData.get('name') as string
  const image_url = formData.get('image_url') as string

  const payload = { name: name?.trim() || '', image_url: image_url || null }

  try {
    brandPayloadSchema.parse(payload)
  } catch (e) {
    if (e instanceof ZodError) {
      const firstError = e.issues[0]
      return { error: firstError?.message || 'Datos inválidos' }
    }
    return { error: 'Datos inválidos' }
  }

  const { error } = await supabase
    .from('brands')
    .update(payload)
    .eq('id', id)

  if (error) {
    if (error.code === '23505') return { error: 'Esta marca ya existe' }
    return { error: error.message }
  }

  revalidatePath('/admin/marcas')
  revalidatePath(`/admin/marcas/${id}`)
  revalidatePath('/marcas')
  return { success: true }
}

export async function deleteBrand(id: string) {
  const supabase = await getMutationClient()

  const { error } = await supabase
    .from('brands')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/marcas')
  return { success: true }
}
