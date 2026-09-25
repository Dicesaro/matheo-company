'use server'

import { cookies, headers } from 'next/headers'
import { getMutationClient } from '@/lib/supabase-admin'
import {
  checkPin,
  createPinCookieValue,
  isValidPinFormat,
  PIN_COOKIE,
  PIN_TTL_SECONDS,
} from '@/lib/doc-pin'

const MAX_FAILS = 5
const LOCK_MINUTES = 15
const TABLE = 'doc_pin_attempts'

type AttemptRow = { fails: number; locked_until: string | null }

async function getClientIp() {
  const headerStore = await headers()
  const forwarded = headerStore.get('x-forwarded-for')

  if (forwarded) {
    const hops = forwarded.split(',').map((hop) => hop.trim()).filter(Boolean)
    if (hops.length > 0) return hops[hops.length - 1]
  }

  return headerStore.get('x-real-ip') ?? 'unknown'
}

export async function verifyDocPin(formData: FormData) {
  const pin = String(formData.get('pin') ?? '')

  if (!isValidPinFormat(pin)) {
    return { error: 'El PIN debe tener 6 dígitos' }
  }

  const supabase = await getMutationClient()
  const ip = await getClientIp()

  const { data } = await supabase
    .from(TABLE)
    .select('fails, locked_until')
    .eq('ip', ip)
    .maybeSingle()

  const row = data as AttemptRow | null
  const lockedUntilMs = row?.locked_until
    ? new Date(row.locked_until).getTime()
    : 0

  // Se corta antes de comparar el PIN para no filtrar nada por tiempo de respuesta
  if (lockedUntilMs > Date.now()) {
    const minutes = Math.max(1, Math.ceil((lockedUntilMs - Date.now()) / 60000))
    return { error: `Demasiados intentos. Probá de nuevo en ${minutes} min.` }
  }

  if (!checkPin(pin)) {
    const fails = (row?.fails ?? 0) + 1
    const shouldLock = fails >= MAX_FAILS

    const { error } = await supabase.from(TABLE).upsert(
      {
        ip,
        fails: shouldLock ? 0 : fails,
        locked_until: shouldLock
          ? new Date(Date.now() + LOCK_MINUTES * 60000).toISOString()
          : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'ip' }
    )

    if (error) {
      console.error('documento: no se pudo registrar el intento', error.message)
    }

    if (shouldLock) {
      return {
        error: `Demasiados intentos. IP bloqueada por ${LOCK_MINUTES} minutos.`,
      }
    }

    const remaining = MAX_FAILS - fails
    return {
      error: `PIN incorrecto. Te ${remaining === 1 ? 'queda' : 'quedan'} ${remaining} ${remaining === 1 ? 'intento' : 'intentos'}.`,
    }
  }

  if (row) {
    await supabase.from(TABLE).delete().eq('ip', ip)
  }

  const cookieStore = await cookies()
  cookieStore.set(PIN_COOKIE, createPinCookieValue(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: PIN_TTL_SECONDS,
  })

  return { success: true }
}
