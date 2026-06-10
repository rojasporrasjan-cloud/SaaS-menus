import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@shared/ui/components/Button'
import type { TableFormValues } from '../../types/qr.types'

interface AddTableModalProps {
  menuId: string
  isLoading: boolean
  error: string | null
  onSubmit: (values: TableFormValues) => Promise<void>
  onClose: () => void
}

export function AddTableModal({
  menuId,
  isLoading,
  error,
  onSubmit,
  onClose,
}: AddTableModalProps) {
  const [number, setNumber] = useState('')
  const [label, setLabel] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!number.trim()) return
    await onSubmit({ number: number.trim(), label: label.trim(), menuId })
    if (!error) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-surface-0 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-surface-900">Agregar mesa</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-surface-400 hover:bg-surface-50 hover:text-surface-700"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-surface-700">
              Número de mesa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Ej: 1, A1, Terraza-1"
              required
              className="rounded-xl border border-surface-200 bg-surface-0 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-surface-700">
              Descripción <span className="text-surface-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ej: Ventana izquierda"
              className="rounded-xl border border-surface-200 bg-surface-0 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" isLoading={isLoading}>
              Agregar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
