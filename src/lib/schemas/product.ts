import { z } from 'zod'

export const productPayloadSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres'),
  description: z.string().max(5000).nullable().optional(),
  long_description: z.string().nullable().optional(),
  category_id: z.string().nullable().optional(),
  brand_id: z.string().nullable().optional(),
  price: z
    .number('El precio debe ser un número')
    .positive('El precio debe ser positivo')
    .nullable()
    .optional(),
  original_price: z
    .number('El precio original debe ser un número')
    .positive()
    .nullable()
    .optional(),
  discount: z.number().min(0).max(100).nullable().optional(),
  rating: z.number().min(0).max(5).nullable().optional(),
  featured: z.boolean(),
  image_url: z.string().url('URL de imagen inválida').nullable().optional(),
  features: z.array(z.any()).nullable().optional(),
  benefits: z.array(z.any()).nullable().optional(),
  work_materials: z.array(z.any()).nullable().optional(),
  specifications: z.array(z.any()).nullable().optional(),
  images_gallery: z.array(z.any()).nullable().optional(),
})
