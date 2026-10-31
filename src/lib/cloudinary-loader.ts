type CloudinaryLoaderProps = {
  src: string
  width: number
  quality?: number
}

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: CloudinaryLoaderProps) {
  if (!src.includes('res.cloudinary.com') || !src.includes('/upload/')) {
    return src
  }

  if (/\.svg(?:\?|$)/i.test(src)) {
    return src
  }

  if (/\/upload\/(?:[^/]+\/)*?(?:f_|w_|q_)/.test(src)) {
    return src
  }

  const qualityValue = quality ? `q_${quality}` : 'q_auto'

  return src.replace(
    '/upload/',
    `/upload/f_auto,${qualityValue},w_${width}/`,
  )
}
