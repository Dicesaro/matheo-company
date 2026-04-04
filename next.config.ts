import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    // 1. Sin esto, tus imágenes de Cloudinary NO se optimizan
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    // 2. Forzar WebP/AVIF (ahorro del 30-50% en peso)
    formats: ['image/avif', 'image/webp'],
  },

  // 3. Compresión de respuestas HTTP
  compress: true,

  // 4. Elimina el header X-Powered-By (seguridad + micro-mejora)
  poweredByHeader: false,
}

export default nextConfig
