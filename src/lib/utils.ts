import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convierte un nombre de producto a un slug SEO-friendly.
 * Ejemplo: "Macho de Roscado 3/4 NPT" → "macho-de-roscado-3-4-npt"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD') // descompone caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // elimina marcas diacríticas (tildes, etc.)
    .replace(/[^\w\s-]/g, '-') // reemplaza caracteres especiales (/, °, etc.) con guion
    .replace(/[\s_]+/g, '-') // espacios y guiones bajos → guion
    .replace(/-{2,}/g, '-') // múltiples guiones → uno solo
    .replace(/^-+|-+$/g, '') // elimina guiones al inicio/fin
}

export function slugToCategory(
  slug: string,
  categories: string[],
): string | null {
  return categories.find((cat) => generateSlug(cat) === slug) ?? null
}
