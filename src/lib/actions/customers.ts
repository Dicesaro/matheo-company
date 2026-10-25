'use server'

import { revalidatePath } from 'next/cache'
import { ZodError } from 'zod'
import { createClient } from '@/lib/supabase-server'
import { getMutationClient } from '@/lib/supabase-admin'
import { customerPayloadSchema } from '@/lib/schemas/customer'

export interface Customer {
  id: string
  name: string
  ruc: string | null
  phone: string | null
  email: string | null
  created_at: string
}

export async function getCustomers(search?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('customers')
    .select('*')
    .order('name', { ascending: true })

  if (search && search.trim()) {
    const term = `%${search.trim()}%`
    query = query.or(`name.ilike.${term},ruc.ilike.${term}`)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)
  return data as Customer[]
}

export async function getCustomer(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as Customer
}

export async function createCustomer(formData: FormData) {
  const supabase = await getMutationClient()

  const payload = {
    name: (formData.get('name') as string)?.trim() || '',
    ruc: (formData.get('ruc') as string)?.trim() || null,
    phone: (formData.get('phone') as string)?.trim() || null,
    email: (formData.get('email') as string)?.trim() || null,
  }

  try {
    customerPayloadSchema.parse(payload)
  } catch (e) {
    if (e instanceof ZodError) {
      const firstError = e.issues[0]
      return { error: firstError?.message || 'Datos inválidos' }
    }
    return { error: 'Datos inválidos' }
  }

  const { error } = await supabase.from('customers').insert(payload)

  if (error) {
    if (error.code === '23505') return { error: 'Este RUC ya existe' }
    return { error: error.message }
  }

  revalidatePath('/admin/clientes')
  return { success: true }
}

export async function updateCustomer(id: string, formData: FormData) {
  const supabase = await getMutationClient()

  const payload = {
    name: (formData.get('name') as string)?.trim() || '',
    ruc: (formData.get('ruc') as string)?.trim() || null,
    phone: (formData.get('phone') as string)?.trim() || null,
    email: (formData.get('email') as string)?.trim() || null,
  }

  try {
    customerPayloadSchema.parse(payload)
  } catch (e) {
    if (e instanceof ZodError) {
      const firstError = e.issues[0]
      return { error: firstError?.message || 'Datos inválidos' }
    }
    return { error: 'Datos inválidos' }
  }

  const { error } = await supabase
    .from('customers')
    .update(payload)
    .eq('id', id)

  if (error) {
    if (error.code === '23505') return { error: 'Este RUC ya existe' }
    return { error: error.message }
  }

  revalidatePath('/admin/clientes')
  revalidatePath(`/admin/clientes/${id}`)
  return { success: true }
}

export async function deleteCustomer(id: string) {
  const supabase = await getMutationClient()

  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/clientes')
  return { success: true }
}