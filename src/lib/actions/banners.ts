'use server'

import { revalidatePath } from 'next/cache'
import { ZodError } from 'zod'
import { createClient } from '@/lib/supabase-server'
import { getMutationClient } from '@/lib/supabase-admin'
import { bannerPayloadSchema } from '@/lib/schemas/banner'

export interface Banner {
  id: string
  title: string
  image_url: string
  mobile_image_url: string | null
  link_url: string | null
  position: number
  active: boolean
  created_at: string
}

export async function getBanners() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('position')

  if (error) throw new Error(error.message)
  return data as Banner[]
}

export async function getActiveBanners() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('active', true)
    .order('position')

  if (error) throw new Error(error.message)
  return data as Banner[]
}

export async function createBanner(formData: FormData) {
  const supabase = await getMutationClient()
  const title = formData.get('title') as string
  const image_url = formData.get('image_url') as string
  const mobile_image_url = formData.get('mobile_image_url') as string
  const link_url = formData.get('link_url') as string
  const position = Number(formData.get('position')) || 0
  const active = formData.get('active') === 'true'

  const payload = {
    title: title?.trim() || '',
    image_url: image_url?.trim() || '',
    mobile_image_url: mobile_image_url?.trim() || null,
    link_url: link_url?.trim() || null,
    position,
    active,
  }

  try {
    bannerPayloadSchema.parse(payload)
  } catch (e) {
    if (e instanceof ZodError) {
      const firstError = e.issues[0]
      return { error: firstError?.message || 'Datos inválidos' }
    }
    return { error: 'Datos inválidos' }
  }

  const { error } = await supabase.from('banners').insert(payload)

  if (error) return { error: error.message }

  revalidatePath('/admin/banners')
  revalidatePath('/')
  return { success: true }
}

export async function updateBanner(id: string, formData: FormData) {
  const supabase = await getMutationClient()
  const title = formData.get('title') as string
  const image_url = formData.get('image_url') as string
  const mobile_image_url = formData.get('mobile_image_url') as string
  const link_url = formData.get('link_url') as string
  const position = Number(formData.get('position')) || 0
  const active = formData.get('active') === 'true'

  const payload = {
    title: title?.trim() || '',
    image_url: image_url?.trim() || '',
    mobile_image_url: mobile_image_url?.trim() || null,
    link_url: link_url?.trim() || null,
    position,
    active,
  }

  try {
    bannerPayloadSchema.parse(payload)
  } catch (e) {
    if (e instanceof ZodError) {
      const firstError = e.issues[0]
      return { error: firstError?.message || 'Datos inválidos' }
    }
    return { error: 'Datos inválidos' }
  }

  const { error } = await supabase.from('banners').update(payload).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/banners')
  revalidatePath(`/admin/banners/${id}`)
  revalidatePath('/')
  return { success: true }
}

export async function deleteBanner(id: string) {
  const supabase = await getMutationClient()

  const { error } = await supabase.from('banners').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/banners')
  revalidatePath('/')
  return { success: true }
}