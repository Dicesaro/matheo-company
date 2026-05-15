'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { getMutationClient } from '@/lib/supabase-admin'

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

  if (!name?.trim()) {
    return { error: 'El nombre es requerido' }
  }

  const { error } = await supabase
    .from('brands')
    .insert({ name: name.trim() })

  if (error) {
    if (error.code === '23505') return { error: 'Esta marca ya existe' }
    return { error: error.message }
  }

  revalidatePath('/admin/marcas')
  return { success: true }
}

export async function updateBrand(id: string, formData: FormData) {
  const supabase = await getMutationClient()
  const name = formData.get('name') as string

  if (!name?.trim()) {
    return { error: 'El nombre es requerido' }
  }

  const { error } = await supabase
    .from('brands')
    .update({ name: name.trim() })
    .eq('id', id)

  if (error) {
    if (error.code === '23505') return { error: 'Esta marca ya existe' }
    return { error: error.message }
  }

  revalidatePath('/admin/marcas')
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
