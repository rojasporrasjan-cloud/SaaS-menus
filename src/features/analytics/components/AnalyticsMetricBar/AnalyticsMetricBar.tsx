import { QrCode, Eye, Cuboid, BarChart3 } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import type { DailySummary } from '../../types/analytics.types'
import { AnalyticsPageService } from '../../services/AnalyticsPageService'

interface AnalyticsMetricBarProps {
  summaries: DailySummary[]
  isLoading: boolean
}

const METRICS = [
  {
    type:      'qr_scan' as const,
    label:     'Escaneos QR',
    icon:      QrCode,
    bgClass:   'bg-blue-50 text-blue-600 border border-blue-100/50',
  },
  {
    type:      'menu_view' as const,
    label:     'Vistas de menú',
    icon:      Eye,
    bgClass:   'bg-amber-50 text-amber-600 border border-amber-100/50',
  },
  {
    type:      'dish_view' as const,
    label:     'Vistas de plato',
    icon:      BarChart3,
    bgClass:   'bg-emerald-50 text-emerald-600 border border-emerald-100/50',
  },
  {
    type:      'ar_launch' as const,
    label:     'Lanzamientos AR',
    icon:      Cuboid,
    bgClass:   'bg-violet-50 text-violet-600 border border-violet-100/50',
  },
]

export function AnalyticsMetricBar({ summaries, isLoading }: AnalyticsMetricBarProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {METRICS.map(({ type, label, icon: Icon, bgClass }) => {
        const value = isLoading ? null : AnalyticsPageService.sumByType(summaries, type)

        return (
          <div
            key={type}
            className="flex items-center gap-3.5 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-200"
          >
            <div
              className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm", bgClass)}
            >
              <Icon size={18} />
            </div>
            <div>
              {isLoading ? (
                <div className="h-6 w-12 animate-pulse rounded bg-zinc-100" />
              ) : (
                <p className="text-xl font-extrabold tabular-nums tracking-tight text-zinc-800">
                  {value?.toLocaleString('es-CR')}
                </p>
              )}
              <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
