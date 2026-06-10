import { useState } from 'react'
import { Cuboid, Eye } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import type { DailySummary, TopDishEntry } from '../../types/analytics.types'
import { AnalyticsPageService } from '../../services/AnalyticsPageService'
import type { AnalyticsEventType } from '@core/domain/entities/AnalyticsEvent'

interface TopDishesTableProps {
  summaries: DailySummary[]
  dishNameMap: Map<string, string>
  isLoading: boolean
}

const TABS: { key: AnalyticsEventType; label: string; icon: typeof Eye }[] = [
  { key: 'ar_launch', label: 'AR', icon: Cuboid },
  { key: 'dish_view', label: 'Vistas', icon: Eye },
]

export function TopDishesTable({ summaries, dishNameMap, isLoading }: TopDishesTableProps) {
  const [activeTab, setActiveTab] = useState<AnalyticsEventType>('ar_launch')

  const topDishes: TopDishEntry[] = isLoading
    ? []
    : AnalyticsPageService.getTopDishes(summaries, activeTab, dishNameMap)

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-zinc-800">Top platos</h3>

        {/* Tab pills */}
        <div className="flex gap-0.5 rounded-xl p-0.5 bg-zinc-50 border border-zinc-200">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={cn(
                "flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all outline-none cursor-pointer",
                activeTab === key
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-650"
              )}
            >
              <Icon size={11} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Skeleton */}
      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-5 w-5 animate-pulse rounded bg-zinc-100" />
              <div className="h-4 flex-1 animate-pulse rounded bg-zinc-100" />
              <div className="h-4 w-8 animate-pulse rounded bg-zinc-100" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && topDishes.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-[13px] text-zinc-500">Sin datos para el período seleccionado.</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && topDishes.length > 0 && (
        <div className="flex flex-col gap-1">
          {topDishes.map((entry, idx) => {
            const maxCount = topDishes[0]?.count ?? 1
            const pct = maxCount > 0 ? (entry.count / maxCount) * 100 : 0

            return (
              <div key={entry.dishId} className="flex items-center gap-3 py-1">
                {/* Rank */}
                <span className="w-5 shrink-0 text-center text-[11px] font-bold text-zinc-400">
                  {idx + 1}
                </span>

                {/* Name + bar */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-bold text-zinc-700">
                    {entry.dishName}
                  </p>
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-amber-500 to-amber-600"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Count */}
                <span className="shrink-0 text-[13px] font-extrabold tabular-nums text-zinc-800">
                  {entry.count.toLocaleString('es-CR')}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
