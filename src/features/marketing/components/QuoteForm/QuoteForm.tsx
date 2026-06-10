import { useState, type FormEvent } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { Button } from '@shared/ui/components/Button'
import {
  quoteSchema,
  MENU_SIZE_OPTIONS,
  type QuoteFormValues,
} from '../../types/quote.types'

interface QuoteFormProps {
  onSubmit: (values: QuoteFormValues) => void
  isLoading: boolean
  error: string | null
}

type FieldErrors = Partial<Record<keyof QuoteFormValues, string>>

const EMPTY: QuoteFormValues = {
  restaurantName: '',
  contactName: '',
  email: '',
  phone: '',
  menuSize: 'medium',
  message: '',
}

const inputClass = (hasError: boolean): string =>
  cn(
    'w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#17150f] placeholder:text-[#9a968e]',
    'transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400',
    hasError ? 'border-red-400 focus:ring-red-400' : 'border-[#dbd8d2] focus:border-brand-400',
  )

export function QuoteForm({ onSubmit, isLoading, error }: QuoteFormProps) {
  const [values, setValues] = useState<QuoteFormValues>(EMPTY)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  function setField<K extends keyof QuoteFormValues>(key: K, value: QuoteFormValues[K]): void {
    setValues((v) => ({ ...v, [key]: value }))
  }

  function handleSubmit(e: FormEvent): void {
    e.preventDefault()
    setFieldErrors({})

    const result = quoteSchema.safeParse(values)
    if (!result.success) {
      const errors: FieldErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0]
        if (typeof field === 'string') errors[field as keyof QuoteFormValues] = issue.message
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="restaurantName" className="text-sm font-medium text-[#3d3b38]">
            Nombre del restaurante
          </label>
          <input
            id="restaurantName"
            value={values.restaurantName}
            onChange={(e) => setField('restaurantName', e.target.value)}
            placeholder="Soda La Rústica"
            className={inputClass(Boolean(fieldErrors.restaurantName))}
          />
          {fieldErrors.restaurantName && (
            <p className="text-xs text-red-600">{fieldErrors.restaurantName}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contactName" className="text-sm font-medium text-[#3d3b38]">
            Tu nombre
          </label>
          <input
            id="contactName"
            value={values.contactName}
            onChange={(e) => setField('contactName', e.target.value)}
            placeholder="Ana Rojas"
            className={inputClass(Boolean(fieldErrors.contactName))}
          />
          {fieldErrors.contactName && (
            <p className="text-xs text-red-600">{fieldErrors.contactName}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-[#3d3b38]">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => setField('email', e.target.value)}
            placeholder="hola@restaurante.com"
            className={inputClass(Boolean(fieldErrors.email))}
          />
          {fieldErrors.email && <p className="text-xs text-red-600">{fieldErrors.email}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-[#3d3b38]">
            Teléfono / WhatsApp
          </label>
          <input
            id="phone"
            type="tel"
            value={values.phone}
            onChange={(e) => setField('phone', e.target.value)}
            placeholder="8888 8888"
            className={inputClass(Boolean(fieldErrors.phone))}
          />
          {fieldErrors.phone && <p className="text-xs text-red-600">{fieldErrors.phone}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="menuSize" className="text-sm font-medium text-[#3d3b38]">
          Tamaño de tu menú
        </label>
        <select
          id="menuSize"
          value={values.menuSize}
          // safe: el <select> solo contiene los valores de MENU_SIZE_OPTIONS (MenuSize)
          onChange={(e) => setField('menuSize', e.target.value as QuoteFormValues['menuSize'])}
          className={inputClass(false)}
        >
          {MENU_SIZE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-[#3d3b38]">
          ¿Qué necesitas? <span className="text-[#9a968e]">(opcional)</span>
        </label>
        <textarea
          id="message"
          rows={4}
          value={values.message ?? ''}
          onChange={(e) => setField('message', e.target.value)}
          placeholder="Cuéntanos sobre tu restaurante, cuántas sucursales tienes, fechas, etc."
          className={cn(inputClass(Boolean(fieldErrors.message)), 'resize-none')}
        />
        {fieldErrors.message && <p className="text-xs text-red-600">{fieldErrors.message}</p>}
      </div>

      <Button type="submit" size="lg" className="mt-1 w-full sm:w-auto sm:self-start sm:px-8" isLoading={isLoading}>
        Enviar solicitud
      </Button>
    </form>
  )
}
