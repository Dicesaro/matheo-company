import { z } from 'zod'

export const bannerPayloadSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es requerido')
    .max(120, 'Máximo 120 caracteres'),
  image_url: z.string().url('URL de imagen inválida'),
  mobile_image_url: z.string().url('URL de imagen inválida').optional(),
  link_url: z.string().url('URL inválida').optional(),
  position: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
})