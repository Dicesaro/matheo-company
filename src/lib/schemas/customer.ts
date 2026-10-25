import { z } from 'zod'

export const customerPayloadSchema = z.object({
  name: z.string().min(1, 'El nombre o razón social es requerido').max(200, 'Máximo 200 caracteres'),
  ruc: z.preprocess(
    (v) =>
      v === null || v === undefined || (typeof v === 'string' && v.trim() === '')
        ? undefined
        : v,
    z
      .string()
      .regex(/^\d+$/, 'El RUC solo debe contener números')
      .max(11, 'El RUC debe tener máximo 11 dígitos')
      .optional()
  ),
  phone: z.string().max(50, 'Máximo 50 caracteres').nullable().optional(),
  email: z.preprocess(
    (v) =>
      v === null || v === undefined || (typeof v === 'string' && v.trim() === '')
        ? undefined
        : v,
    z.string().email('Email inválido').max(200, 'Máximo 200 caracteres').optional()
  ),
})