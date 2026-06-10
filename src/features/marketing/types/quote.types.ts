import { z } from 'zod'

/** Origen del lead — de qué camino del embudo vino. */
export const QUOTE_SOURCE = {
  quotePage: 'quote-page',
  pricingEnterprise: 'pricing-enterprise',
  landing: 'landing',
} as const

export type QuoteSource = (typeof QUOTE_SOURCE)[keyof typeof QUOTE_SOURCE]

/** Tamaño aproximado del menú — ayuda a estimar el alcance del trabajo. */
export const MENU_SIZE_OPTIONS = [
  { value: 'small', label: 'Hasta 20 platos' },
  { value: 'medium', label: '20 a 60 platos' },
  { value: 'large', label: 'Más de 60 platos' },
] as const

export type MenuSize = (typeof MENU_SIZE_OPTIONS)[number]['value']

export const quoteSchema = z.object({
  restaurantName: z.string().min(2, 'El nombre del restaurante es requerido'),
  contactName: z.string().min(2, 'Tu nombre es requerido'),
  email: z.string().min(1, 'El email es requerido').email('Formato de email inválido'),
  phone: z
    .string()
    .min(8, 'El teléfono es requerido')
    .regex(/^[0-9+\s()-]+$/, 'Teléfono inválido'),
  menuSize: z.enum(['small', 'medium', 'large']),
  message: z.string().max(800, 'El mensaje es muy largo').optional(),
})

export type QuoteFormValues = z.infer<typeof quoteSchema>

/** Documento persistido en la colección `quotes`. */
export interface Quote extends QuoteFormValues {
  readonly source: QuoteSource
  readonly status: 'new'
  readonly createdAt: Date
}
