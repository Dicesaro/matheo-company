'use server'

import { createClient } from '@/lib/supabase-server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string

  if (password && password !== confirmPassword) {
    return { error: 'Las contraseñas no coinciden' }
  }

  if (password && password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres' }
  }

  const updates: { email?: string; password?: string } = {}

  if (email?.trim()) updates.email = email.trim()
  if (password) updates.password = password

  if (Object.keys(updates).length === 0) {
    return { error: 'No hay cambios para guardar' }
  }

  const { error } = await supabase.auth.updateUser(updates)

  if (error) return { error: error.message }

  return { success: true }
}
