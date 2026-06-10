import { useState, type FormEvent } from 'react'
import { AlertCircle, Eye, EyeOff, Mail, Lock, Store, User } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { Button } from '@shared/ui/components/Button'
import { registerSchema, type RegisterFormValues } from '../../types/auth.types'

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => void
  isLoading: boolean
  error: string | null
}

type FieldErrors = Partial<Record<keyof RegisterFormValues, string>>

const EMPTY: RegisterFormValues = {
  restaurantName: '',
  ownerName: '',
  email: '',
  password: '',
}

const inputClass = (hasError: boolean): string =>
  cn(
    'w-full rounded-xl border bg-surface-0 py-3 pl-10 pr-4 text-sm',
    'text-surface-900 placeholder:text-surface-400',
    'transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400',
    hasError ? 'border-red-400 focus:ring-red-400' : 'border-surface-200 focus:border-brand-400',
  )

export function RegisterForm({ onSubmit, isLoading, error }: RegisterFormProps) {
  const [values, setValues] = useState<RegisterFormValues>(EMPTY)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [showPassword, setShowPassword] = useState(false)

  function setField<K extends keyof RegisterFormValues>(key: K, value: RegisterFormValues[K]): void {
    setValues((v) => ({ ...v, [key]: value }))
  }

  function handleSubmit(e: FormEvent): void {
    e.preventDefault()
    setFieldErrors({})

    const result = registerSchema.safeParse(values)
    if (!result.success) {
      const errors: FieldErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0]
        if (typeof field === 'string') errors[field as keyof RegisterFormValues] = issue.message
      })
      setFieldErrors(errors)
      return
    }

    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Restaurante */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="restaurantName" className="text-sm font-medium text-surface-700">
          Nombre del restaurante
        </label>
        <div className="relative">
          <Store size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            id="restaurantName"
            value={values.restaurantName}
            onChange={(e) => setField('restaurantName', e.target.value)}
            placeholder="Soda La Rústica"
            className={inputClass(Boolean(fieldErrors.restaurantName))}
          />
        </div>
        {fieldErrors.restaurantName && (
          <p className="text-xs text-red-600">{fieldErrors.restaurantName}</p>
        )}
      </div>

      {/* Owner */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="ownerName" className="text-sm font-medium text-surface-700">
          Tu nombre
        </label>
        <div className="relative">
          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            id="ownerName"
            value={values.ownerName}
            onChange={(e) => setField('ownerName', e.target.value)}
            placeholder="Ana Rojas"
            autoComplete="name"
            className={inputClass(Boolean(fieldErrors.ownerName))}
          />
        </div>
        {fieldErrors.ownerName && <p className="text-xs text-red-600">{fieldErrors.ownerName}</p>}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-surface-700">
          Email
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => setField('email', e.target.value)}
            placeholder="hola@restaurante.com"
            autoComplete="email"
            className={inputClass(Boolean(fieldErrors.email))}
          />
        </div>
        {fieldErrors.email && <p className="text-xs text-red-600">{fieldErrors.email}</p>}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-surface-700">
          Contraseña
        </label>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={(e) => setField('password', e.target.value)}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            className={cn(inputClass(Boolean(fieldErrors.password)), 'pr-12')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {fieldErrors.password && <p className="text-xs text-red-600">{fieldErrors.password}</p>}
      </div>

      <Button type="submit" size="lg" className="mt-1 w-full" isLoading={isLoading}>
        Crear mi menú
      </Button>
    </form>
  )
}
