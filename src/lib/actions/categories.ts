'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { getMutationClient } from '@/lib/supabase-admin'

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) throw new Error(error.message)
  return data as { id: string; name: string; parent_id: string | null }[]
}

export async function createCategory(formData: FormData) {
  const supabase = await getMutationClient()
  const name = formData.get('name') as string
  const parentId = formData.get('parent_id') as string

  if (!name?.trim()) {
    return { error: 'El nombre es requerido' }
  }

  const resolvedParentId = !parentId || parentId === '__none__' ? null : parentId

  const { error } = await supabase
    .from('categories')
    .insert({ name: name.trim(), parent_id: resolvedParentId })

  if (error) {
    if (error.code === '23505') return { error: 'Esta categoría ya existe' }
    return { error: error.message }
  }

  revalidatePath('/admin/categorias')
  return { success: true }
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await getMutationClient()
  const name = formData.get('name') as string
  const parentId = formData.get('parent_id') as string

  if (!name?.trim()) {
    return { error: 'El nombre es requerido' }
  }

  const resolvedParentId = !parentId || parentId === '__none__' ? null : parentId

  const { error } = await supabase
    .from('categories')
    .update({ name: name.trim(), parent_id: resolvedParentId })
    .eq('id', id)

  if (error) {
    if (error.code === '23505') return { error: 'Esta categoría ya existe' }
    return { error: error.message }
  }

  revalidatePath('/admin/categorias')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await getMutationClient()

  const { data: children } = await supabase
    .from('categories')
    .select('id')
    .eq('parent_id', id)

  if (children && children.length > 0) {
    return { error: 'No se puede eliminar: esta categoría tiene subcategorías. Elimina primero las subcategorías.' }
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/categorias')
  return { success: true }
}
