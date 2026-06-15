import { z } from 'zod'

export const categoryPayloadSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
  parent_id: z.string().nullable().optional(),
  image_url: z.string().url('URL de imagen inválida').nullable().optional(),
})
