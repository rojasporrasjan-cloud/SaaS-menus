import {
  QrCode, Boxes, Wand2, BarChart3, Smartphone, Palette, type LucideIcon,
} from 'lucide-react'
import { PLATFORM_FEATURES, type FeatureContent } from '../../constants/marketing.content'

const ICONS: Record<FeatureContent['icon'], LucideIcon> = {
  QrCode,
  Boxes,
  Wand2,
  BarChart3,
  Smartphone,
  Palette,
}

export function FeatureShowcase() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {PLATFORM_FEATURES.map((feature) => {
        const Icon = ICONS[feature.icon]
        return (
          <div
            key={feature.title}
            className="flex flex-col gap-3 rounded-2xl border border-[#efede9] bg-white p-6"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fbf3e2] text-[#cc7809]">
              <Icon size={20} />
            </span>
            <h3 className="text-base font-bold text-[#17150f]">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-[#57544f]">{feature.description}</p>
          </div>
        )
      })}
    </div>
  )
}
