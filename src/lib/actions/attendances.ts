'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { getMutationClient } from '@/lib/supabase-admin'

export interface Attendance {
  id: string
  person_name: string
  attendance_date: string
  check_in: string | null
  check_out: string | null
  created_at: string
  updated_at: string
}

function getTodayDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export async function getTodayAttendances(): Promise<Attendance[]> {
  const supabase = await createClient()
  const today = getTodayDate()

  const { data, error } = await supabase
    .from('attendances')
    .select('*')
    .eq('attendance_date', today)

  if (error) throw new Error(error.message)
  return (data ?? []) as Attendance[]
}

export async function getAttendanceHistory(personName: string): Promise<Attendance[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('attendances')
    .select('*')
    .eq('person_name', personName)
    .order('attendance_date', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Attendance[]
}

export async function markAttendance(personName: string) {
  const supabase = await getMutationClient()
  const today = getTodayDate()
  const now = new Date().toISOString()

  const { data: existing, error: fetchError } = await supabase
    .from('attendances')
    .select('*')
    .eq('person_name', personName)
    .eq('attendance_date', today)
    .maybeSingle()

  if (fetchError) return { error: fetchError.message }

  if (!existing) {
    const { error } = await supabase.from('attendances').insert({
      person_name: personName,
      attendance_date: today,
      check_in: now,
      check_out: null,
    })

    if (error) return { error: error.message }
    revalidatePath('/admin/asistencias')
    return { success: true }
  }

  if (existing.check_in && !existing.check_out) {
    const { error } = await supabase
      .from('attendances')
      .update({
        check_out: now,
        updated_at: now,
      })
      .eq('id', existing.id)

    if (error) return { error: error.message }
    revalidatePath('/admin/asistencias')
    return { success: true }
  }

  if (existing.check_in && existing.check_out) {
    return { error: 'Ya se marcó entrada y salida' }
  }

  const { error } = await supabase
    .from('attendances')
    .update({
      check_in: now,
      updated_at: now,
    })
    .eq('id', existing.id)

  if (error) return { error: error.message }
  revalidatePath('/admin/asistencias')
  return { success: true }
}
