import { useState, type FormEvent } from 'react'
import { AlertCircle, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { Button } from '@shared/ui/components/Button'
import { loginSchema, type LoginFormValues } from '../../types/auth.types'

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void
  isLoading: boolean
  error: string | null
}

interface FieldError {
  email?: string
  password?: string
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [values, setValues] = useState<LoginFormValues>({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState<FieldError>({})
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setFieldErrors({})

    const result = loginSchema.safeParse(values)
    if (!result.success) {
      const errors: FieldError = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FieldError
        errors[field] = issue.message
      })
      setFieldErrors(errors)
      return
    }

    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Global error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-surface-700">
          Email
        </label>
        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none"
          />
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            placeholder="admin@restaurante.com"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            className={cn(
              'w-full rounded-xl border bg-surface-0 py-3 pl-10 pr-4 text-sm',
              'text-surface-900 placeholder:text-surface-400',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400',
              fieldErrors.email
                ? 'border-red-400 focus:ring-red-400'
                : 'border-surface-200 focus:border-brand-400',
            )}
          />
        </div>
        {fieldErrors.email && (
          <p id="email-error" role="alert" className="text-xs text-red-600">
            {fieldErrors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-surface-700">
          Contraseña
        </label>
        <div className="relative">
          <Lock
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none"
          />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={values.password}
            onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
            placeholder="••••••••"
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            className={cn(
              'w-full rounded-xl border bg-surface-0 py-3 pl-10 pr-12 text-sm',
              'text-surface-900 placeholder:text-surface-400',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400',
              fieldErrors.password
                ? 'border-red-400 focus:ring-red-400'
                : 'border-surface-200 focus:border-brand-400',
            )}
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
        {fieldErrors.password && (
          <p id="password-error" role="alert" className="text-xs text-red-600">
            {fieldErrors.password}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="mt-1 w-full" isLoading={isLoading}>
        Iniciar sesión
      </Button>
    </form>
  )
}
