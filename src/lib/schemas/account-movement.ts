import { z } from 'zod'

export const accountLedgerSchema = z.enum([
  'general',
  'yape',
  'leonel',
  'wuardadito_mercaderia',
  'wuardadito_empresa',
])

export const accountMovementPayloadSchema = z
  .object({
    ledger: accountLedgerSchema.default('general'),
    customer_id: z.string().optional().or(z.literal('')),
    party_name: z.string().optional(),
    concept: z.string().min(1, 'El concepto es requerido').max(300, 'Máximo 300 caracteres'),
    type: z.enum(['ingreso', 'egreso'], { message: 'Tipo inválido' }),
    issue_date: z.string().min(1, 'La fecha de emisión es requerida'),
    paid_date: z.string().min(1, 'La fecha de pago es requerida'),
    amount: z.coerce.number().positive('El monto debe ser mayor a 0'),
    invoice_number: z
      .string()
      .max(50, 'Máximo 50 caracteres')
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.ledger === 'general') {
      if (!data.customer_id || data.customer_id.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selecciona un cliente válido',
          path: ['customer_id'],
        })
        return
      }
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(data.customer_id.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selecciona un cliente válido',
          path: ['customer_id'],
        })
      }
      return
    }

    if (!data.party_name || data.party_name.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El cliente / referencia es requerido',
        path: ['party_name'],
      })
    } else if (data.party_name.trim().length > 150) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Máximo 150 caracteres',
        path: ['party_name'],
      })
    }
  })

export const accountMonthConfigPayloadSchema = z.object({
  ledger: accountLedgerSchema.default('general'),
  year: z.coerce.number().int().min(2000, 'Año inválido'),
  month: z.coerce.number().int().min(1, 'Mes inválido').max(12, 'Mes inválido'),
  initial_balance: z.coerce.number(),
})
