import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const resetPasswordSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Formato de email inválido'),
})

export const registerSchema = z.object({
  restaurantName: z
    .string()
    .min(2, 'El nombre del restaurante es requerido'),
  ownerName: z
    .string()
    .min(2, 'Tu nombre es requerido'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>

export interface AuthFormState {
  isLoading: boolean
  error: string | null
}
