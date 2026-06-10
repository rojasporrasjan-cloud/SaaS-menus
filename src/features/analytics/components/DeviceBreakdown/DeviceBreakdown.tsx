import { cn } from '@shared/utils/cn'
import type { DailySummary } from '../../types/analytics.types'

interface DeviceBreakdownProps {
  summaries: DailySummary[]
  isLoading: boolean
}

const DEVICE_CONFIG = [
  { key: 'mobile',  label: 'Móvil',       colorClass: 'bg-blue-500' },
  { key: 'tablet',  label: 'Tablet',      colorClass: 'bg-violet-500' },
  { key: 'desktop', label: 'Escritorio',  colorClass: 'bg-emerald-500' },
] as const

export function DeviceBreakdown({ summaries, isLoading }: DeviceBreakdownProps) {
  const deviceTotals = computeDeviceTotals(summaries)
  const total = deviceTotals.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-[13px] font-bold text-zinc-800">
        Dispositivos
      </h3>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="h-3 w-20 animate-pulse rounded bg-zinc-100" />
              <div className="h-2 w-full animate-pulse rounded-full bg-zinc-100" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && total === 0 && (
        <p className="py-4 text-center text-[13px] text-zinc-500">
          Sin datos de dispositivos aún.
        </p>
      )}

      {!isLoading && total > 0 && (
        <div className="flex flex-col gap-4">
          {deviceTotals.map(({ key, count }) => {
            const cfg = DEVICE_CONFIG.find((d) => d.key === key)
            if (!cfg) return null
            const pct = total > 0 ? Math.round((count / total) * 100) : 0

            return (
              <div key={key} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-zinc-700">
                    {cfg.label}
                  </span>
                  <span className="text-[11px] tabular-nums text-zinc-400 font-semibold">
                    {count.toLocaleString('es-CR')} · {pct}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", cfg.colorClass)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function computeDeviceTotals(summaries: DailySummary[]) {
  const counts: Record<string, number> = { mobile: 0, tablet: 0, desktop: 0 }

  for (const summary of summaries) {
    // safe: DailySummary may carry extra device-aggregation fields not in the typed shape
    const devices = (summary as unknown as Record<string, unknown>)['devices'] as
      | Record<string, number>
      | undefined

    if (devices) {
      for (const [device, count] of Object.entries(devices)) {
        if (device in counts) counts[device] = (counts[device] ?? 0) + count
      }
    }
  }

  return DEVICE_CONFIG.map(({ key }) => ({
    key,
    count: counts[key] ?? 0,
  }))
}
