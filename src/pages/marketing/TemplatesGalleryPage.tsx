import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import { Button } from '@shared/ui/components/Button'
import { TemplateGalleryCard } from '@features/marketing'
import { TEMPLATE_DEFINITIONS } from '@features/templates/registry'

const ALL_FILTER = 'Todas'

const templates = Object.values(TEMPLATE_DEFINITIONS)

const tagOptions: string[] = [
  ALL_FILTER,
  ...Array.from(new Set(templates.flatMap((t) => t.tags))).sort((a, b) => a.localeCompare(b)),
]

export default function TemplatesGalleryPage() {
  const [activeTag, setActiveTag] = useState<string>(ALL_FILTER)

  const visibleTemplates = useMemo(() => {
    if (activeTag === ALL_FILTER) return templates
    return templates.filter((t) => t.tags.includes(activeTag))
  }, [activeTag])

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      {/* Header */}
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#cc7809]">
          {templates.length} plantillas profesionales
        </span>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[#17150f]">
          Elige el estilo de tu menú
        </h1>
        <p className="mt-3 text-[#57544f]">
          Cada plantilla está lista para usar. Elige una, personalízala con tus colores y logo, y
          publica. Podrás cambiarla cuando quieras.
        </p>
      </div>

      {/* Filtros por categoría */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {tagOptions.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
              activeTag === tag
                ? 'bg-[#17150f] text-white'
                : 'border border-[#dbd8d2] bg-white text-[#57544f] hover:border-[#bfbbb4] hover:bg-[#faf9f7]',
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleTemplates.map((template) => (
          <TemplateGalleryCard key={template.id} template={template} />
        ))}
      </div>

      {/* CTA "no encuentro la mía" */}
      <div className="mt-14 flex flex-col items-center gap-4 rounded-3xl border border-[#efede9] bg-[#faf9f7] px-8 py-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-[#17150f]">
          ¿Ninguna te convence?
        </h2>
        <p className="max-w-md text-[#57544f]">
          Empieza desde cero con el editor visual o déjanos diseñar tu menú a la medida.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to={ROUTES.auth.register}>
              Empezar desde cero
              <ArrowRight size={15} />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to={ROUTES.marketing.quote}>Cotizar con nosotros</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
