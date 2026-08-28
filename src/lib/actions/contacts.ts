'use server'

import { revalidatePath } from 'next/cache'
import { ZodError } from 'zod'
import { createClient } from '@/lib/supabase-server'
import { getMutationClient } from '@/lib/supabase-admin'
import { contactPayloadSchema } from '@/lib/schemas/contact'

export async function submitContact(data: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}) {
  const supabase = await getMutationClient()

  const payload = {
    name: data.name?.trim() || '',
    email: data.email?.trim() || '',
    phone: data.phone?.trim() || null,
    subject: data.subject?.trim() || '',
    message: data.message?.trim() || '',
  }

  try {
    contactPayloadSchema.parse(payload)
  } catch (e) {
    if (e instanceof ZodError) {
      const firstError = e.issues[0]
      return { error: firstError?.message || 'Datos inválidos' }
    }
    return { error: 'Datos inválidos' }
  }

  const { error } = await supabase.from('contact_submissions').insert(payload)

  if (error) return { error: error.message }

  return { success: true }
}

export async function getContacts(filters?: { from?: string; to?: string }) {
  const supabase = await createClient()
  let query = supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.from) {
    query = query.gte('created_at', filters.from)
  }
  if (filters?.to) {
    const toDate = new Date(filters.to)
    toDate.setHours(23, 59, 59, 999)
    query = query.lte('created_at', toDate.toISOString())
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)
  return data
}

export async function getContact(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function markAsRead(id: string) {
  const supabase = await getMutationClient()

  const { error } = await supabase
    .from('contact_submissions')
    .update({ read: true })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  return { success: true }
}

export async function deleteContact(id: string) {
  const supabase = await getMutationClient()

  const { error } = await supabase
    .from('contact_submissions')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  return { success: true }
}

export async function getUnreadCount() {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('read', false)

  if (error) return 0
  return count ?? 0
}
