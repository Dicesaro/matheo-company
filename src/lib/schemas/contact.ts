import { z } from 'zod'

export const contactPayloadSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres'),
  email: z.string().email('Email inválido').max(200, 'Máximo 200 caracteres'),
  phone: z.string().max(50, 'Máximo 50 caracteres').nullable().optional(),
  subject: z.string().min(1, 'El asunto es requerido').max(200, 'Máximo 200 caracteres'),
  message: z.string().min(1, 'El mensaje es requerido').max(5000, 'Máximo 5000 caracteres'),
})
