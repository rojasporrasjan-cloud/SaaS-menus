import { Link } from 'react-router-dom'
import { Sparkles, LayoutTemplate, MessageCircle, ArrowRight, type LucideIcon } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { ENTRY_PATHS, ENTRY_PATH, type EntryPath, type EntryPathContent } from '../../constants/marketing.content'

const ICONS: Record<EntryPathContent['icon'], LucideIcon> = {
  Sparkles,
  LayoutTemplate,
  MessageCircle,
}

const PATH_HREF: Record<EntryPath, string> = {
  [ENTRY_PATH.scratch]: ROUTES.auth.register,
  [ENTRY_PATH.templates]: ROUTES.marketing.templates,
  [ENTRY_PATH.quote]: ROUTES.marketing.quote,
}

export function PathChooser() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {ENTRY_PATHS.map((path) => {
        const Icon = ICONS[path.icon]
        return (
          <Link
            key={path.id}
            to={PATH_HREF[path.id]}
            className="group flex flex-col gap-4 rounded-2xl border border-[#efede9] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:border-[#e8c98a] hover:shadow-[0_12px_28px_rgba(0,0,0,0.10)]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fbf3e2] text-[#cc7809]">
              <Icon size={22} />
            </span>
            <div className="flex-1">
              <h3 className="text-base font-bold text-[#17150f]">{path.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#57544f]">
                {path.description}
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-[#cc7809]">
              {path.ctaLabel}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        )
      })}
    </div>
  )
}
