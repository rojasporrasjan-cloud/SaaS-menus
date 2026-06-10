import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { TemplateDefinition } from '@features/templates/types'
import { ROUTES } from '@shared/constants/routes'
import { Button } from '@shared/ui/components/Button'

interface TemplateGalleryCardProps {
  readonly template: TemplateDefinition
}

/** Mini-mock del menú para dar una idea del estilo sin renderizar la plantilla real. */
function PreviewMock({ template }: TemplateGalleryCardProps) {
  const isDark = template.previewStyle === 'dark'
  const lineColor = isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.10)'
  const titleColor = isDark ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.78)'

  return (
    <div
      className="flex h-44 flex-col gap-3 p-5"
      style={{ background: template.previewBg }}
    >
      {/* Header line + accent */}
      <div className="flex items-center justify-between">
        <span
          className="text-sm font-bold tracking-tight"
          style={{ color: titleColor, fontFamily: 'Playfair Display, serif' }}
        >
          {template.name}
        </span>
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: template.previewAccent }}
        />
      </div>

      {/* Fake menu rows */}
      <div className="flex flex-col gap-2.5">
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex items-center gap-2">
            <span
              className="h-8 w-8 shrink-0 rounded-md"
              style={{ background: lineColor }}
            />
            <div className="flex flex-1 flex-col gap-1.5">
              <span
                className="h-2 rounded-full"
                style={{ background: lineColor, width: row === 1 ? '60%' : '80%' }}
              />
              <span
                className="h-1.5 rounded-full"
                style={{ background: lineColor, width: '40%' }}
              />
            </div>
            <span
              className="h-2 w-7 rounded-full"
              style={{ background: template.previewAccent, opacity: 0.7 }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function TemplateGalleryCard({ template }: TemplateGalleryCardProps) {
  const registerHref = `${ROUTES.auth.register}?template=${template.id}`

  return (
    <div className="group overflow-hidden rounded-2xl border border-[#efede9] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
      <div className="overflow-hidden">
        <PreviewMock template={template} />
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div>
          <h3 className="text-sm font-bold text-[#17150f]">{template.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#57544f]">
            {template.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#f3f1ed] px-2 py-0.5 text-[10px] font-medium text-[#57544f]"
            >
              {tag}
            </span>
          ))}
        </div>

        <Button asChild size="md" className="w-full">
          <Link to={registerHref}>
            Usar esta plantilla
            <ArrowRight size={14} />
          </Link>
        </Button>
      </div>
    </div>
  )
}
