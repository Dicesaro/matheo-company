import { createHmac, timingSafeEqual } from 'node:crypto'

export const PIN_COOKIE = 'doc_access'
export const PIN_TTL_SECONDS = 60 * 60

const PIN_REGEX = /^\d{6}$/

function getSecret() {
  const secret = process.env.DOCS_COOKIE_SECRET
  if (!secret) {
    throw new Error('Falta DOCS_COOKIE_SECRET en las variables de entorno')
  }
  return secret
}

export function isValidPinFormat(pin: string) {
  return PIN_REGEX.test(pin)
}

export function safeCompare(a: string, b: string) {
  const bufferA = Buffer.from(a, 'utf8')
  const bufferB = Buffer.from(b, 'utf8')
  if (bufferA.length !== bufferB.length) return false
  return timingSafeEqual(bufferA, bufferB)
}

export function checkPin(pin: string) {
  const expected = process.env.DOCS_PIN
  if (!expected) return false
  return safeCompare(pin, expected)
}

function sign(expiresAt: string) {
  return createHmac('sha256', getSecret()).update(expiresAt).digest('hex')
}

export function createPinCookieValue() {
  const expiresAt = String(Date.now() + PIN_TTL_SECONDS * 1000)
  return `${expiresAt}.${sign(expiresAt)}`
}

export function verifyPinCookie(value: string | undefined) {
  if (!value) return false

  const [expiresAt, mac] = value.split('.')
  if (!expiresAt || !mac) return false

  const expiresAtMs = Number(expiresAt)
  if (!Number.isFinite(expiresAtMs) || expiresAtMs < Date.now()) return false

  return safeCompare(mac, sign(expiresAt))
}
