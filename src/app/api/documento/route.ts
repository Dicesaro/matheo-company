import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { cookies } from 'next/headers'
import { PIN_COOKIE, verifyPinCookie } from '@/lib/doc-pin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Segmentos literales a proposito: Turbopack necesita ver el subcarpeta
// en el statically scope para no trazar el proyecto entero al bundle.
const PDF_PATH = path.join(process.cwd(), 'private', 'docs', 'lista.pdf')
const PDF_FILENAME = 'lista.pdf'

export async function GET() {
  const cookieStore = await cookies()

  if (!verifyPinCookie(cookieStore.get(PIN_COOKIE)?.value)) {
    return new Response(null, {
      status: 401,
      headers: { 'Cache-Control': 'private, no-store' },
    })
  }

  let file: Buffer
  try {
    file = await readFile(PDF_PATH)
  } catch {
    return new Response('Documento no disponible', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }

  return new Response(new Uint8Array(file), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${PDF_FILENAME}"`,
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
    },
  })
}
