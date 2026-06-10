import { DATE_RANGE_OPTIONS } from '../../types/analytics.types'
import type { DateRange } from '../../types/analytics.types'

interface DateRangeSelectorProps {
  value: DateRange
  onChange: (value: DateRange) => void
}

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  return (
    <div
      className="flex gap-0.5 rounded-xl p-1"
      style={{ background: '#faf9f7', border: '1px solid #efede9' }}
    >
      {DATE_RANGE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all"
          style={
            value === opt.value
              ? { background: '#ffffff', color: '#17150f', boxShadow: '0 1px 2px rgba(0,0,0,0.07)' }
              : { color: '#908c85' }
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
