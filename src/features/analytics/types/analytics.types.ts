import type { AnalyticsEventType } from '@core/domain/entities/AnalyticsEvent'

// ── Query keys ────────────────────────────────────────────────────────────────

export const analyticsQueryKeys = {
  summaries: (tenantId: string, days: number) =>
    ['analytics-summaries', tenantId, days] as const,
  dishNames: (tenantId: string) =>
    ['analytics-dish-names', tenantId] as const,
}

// ── Domain types ──────────────────────────────────────────────────────────────

export interface DailySummary {
  date: string
  totalEvents: number
  counts: Partial<Record<AnalyticsEventType, number>>
  dishes: Record<string, Partial<Record<AnalyticsEventType, number>>>
}

export interface ChartSeries {
  key: AnalyticsEventType
  label: string
  color: string
  data: number[]
}

export interface TopDishEntry {
  dishId: string
  dishName: string
  count: number
}

export type DateRange = 7 | 30 | 90

export const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: 7, label: '7 días' },
  { value: 30, label: '30 días' },
  { value: 90, label: '90 días' },
]

// ── Chart series config ───────────────────────────────────────────────────────

export const SERIES_CONFIG: Pick<ChartSeries, 'key' | 'label' | 'color'>[] = [
  { key: 'qr_scan', label: 'Escaneos QR', color: '#3b82f6' },
  { key: 'menu_view', label: 'Vistas menú', color: '#e85d04' },
  { key: 'dish_view', label: 'Vistas plato', color: '#10b981' },
  { key: 'ar_launch', label: 'Lanzamientos AR', color: '#8b5cf6' },
]

export const EVENT_TYPE_LABELS: Record<AnalyticsEventType, string> = {
  qr_scan: 'Escaneos QR',
  menu_view: 'Vistas de menú',
  dish_view: 'Vistas de plato',
  ar_launch: 'Lanzamientos AR',
  ar_error: 'Errores AR',
}
