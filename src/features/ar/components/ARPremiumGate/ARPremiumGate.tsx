import { Cuboid, Lock } from 'lucide-react'

/**
 * Shown when the tenant's plan does not include the AR feature.
 * Positioned identically to the real AR button so layout is stable.
 */
export function ARPremiumGate() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-brand-300 bg-brand-50 px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100">
        <Cuboid size={18} className="text-brand-600" />
      </div>

      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-sm font-semibold text-brand-900">
          Vista en AR
        </p>
        <p className="text-xs text-brand-600">
          Disponible en el plan Pro
        </p>
      </div>

      <Lock size={14} className="text-brand-400 shrink-0" />
    </div>
  )
}
