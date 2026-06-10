import { TrendingUp, TrendingDown } from 'lucide-react'
import type { MetricCardData }      from '../../types/dashboard.types'

interface MetricCardProps {
  readonly data:       MetricCardData
  readonly isLoading?: boolean
}

const COLOR = {
  brand:  {
    iconBg:   'rgba(233,154,14,0.1)',
    iconText: '#cc7809',
    strip:    'linear-gradient(90deg, #e99a0e 0%, #f5b520 100%)',
    glow:     'rgba(233,154,14,0.06)',
  },
  green: {
    iconBg:   'rgba(16,185,129,0.1)',
    iconText: '#059669',
    strip:    'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
    glow:     'rgba(16,185,129,0.05)',
  },
  blue: {
    iconBg:   'rgba(59,130,246,0.1)',
    iconText: '#2563eb',
    strip:    'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
    glow:     'rgba(59,130,246,0.05)',
  },
  purple: {
    iconBg:   'rgba(139,92,246,0.1)',
    iconText: '#7c3aed',
    strip:    'linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)',
    glow:     'rgba(139,92,246,0.05)',
  },
} as const

export function MetricCard({ data, isLoading }: MetricCardProps) {
  const Icon   = data.icon
  const colors = COLOR[data.color]

  return (
    <div
      className="relative flex flex-col gap-4 overflow-hidden rounded-2xl p-5"
      style={{
        background:  '#ffffff',
        border:      '1px solid #efede9',
        boxShadow:   '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
      }}
    >
      {/* Color accent strip */}
      <div
        className="absolute inset-x-0 top-0 h-[2.5px]"
        style={{ background: colors.strip, opacity: 0.8 }}
      />

      <div className="flex items-start justify-between pt-1">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: colors.iconBg }}
        >
          <Icon size={17} strokeWidth={1.8} style={{ color: colors.iconText }} />
        </div>

        {data.trend && (
          <div
            className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={
              data.trend.isPositive
                ? { background: 'rgba(16,185,129,0.08)', color: '#059669' }
                : { background: 'rgba(239,68,68,0.08)',  color: '#dc2626' }
            }
          >
            {data.trend.isPositive
              ? <TrendingUp size={11} />
              : <TrendingDown size={11} />}
            {Math.abs(data.trend.value)}%
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          <div className="h-7 w-14 animate-pulse rounded-lg" style={{ background: '#efede9' }} />
          <div className="h-3.5 w-20 animate-pulse rounded-lg" style={{ background: '#efede9' }} />
        </div>
      ) : (
        <div className="flex flex-col gap-0.5">
          <span
            className="text-[26px] font-bold tabular-nums leading-none tracking-[-0.02em]"
            style={{ color: '#17150f' }}
          >
            {data.value.toLocaleString()}
          </span>
          <span className="text-[12px]" style={{ color: '#908c85' }}>
            {data.label}
          </span>
        </div>
      )}
    </div>
  )
}
