import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { createClient } from '@/lib/supabase-server'

cloudinary.config({
  cloud_name: process.env.NEXT_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_CLOUDINARY_API_SECRET,
})

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: Request) {
  try {
    // 1. Verificar autenticación
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // 2. Validar archivo
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No se encontró el archivo' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Solo JPEG, PNG y WebP' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Archivo demasiado grande (máx 5MB)' },
        { status: 400 }
      )
    }

    // 3. Subir a Cloudinary
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'matheo_products/' },
          (error, result) => {
            if (error) reject(error)
            else resolve(result as { secure_url: string; public_id: string })
          }
        )
        uploadStream.end(buffer)
      }
    )

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch {
    return NextResponse.json(
      { error: 'Error al subir la imagen' },
      { status: 500 }
    )
  }
}
