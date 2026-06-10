import { Link } from 'react-router-dom'
import { ArrowRight, QrCode, Star } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { PLATFORM } from '@shared/constants/brand'
import { Button } from '@shared/ui/components/Button'
import {
  PathChooser,
  FeatureShowcase,
  PricingTable,
  TemplateGalleryCard,
} from '@features/marketing'
import { TEMPLATE_DEFINITIONS } from '@features/templates/registry'

const LANDING_TEMPLATE_PREVIEW_COUNT = 6

const previewTemplates = Object.values(TEMPLATE_DEFINITIONS).slice(
  0,
  LANDING_TEMPLATE_PREVIEW_COUNT,
)

const totalTemplates = Object.keys(TEMPLATE_DEFINITIONS).length

export default function LandingPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 select-none">
          <div className="absolute left-1/2 top-[-10%] h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[#fbf3e2] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-5 pt-20 pb-14 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#efede9] bg-white px-3 py-1 text-xs font-medium text-[#57544f] shadow-sm">
            <Star size={13} className="text-[#e99a0e]" />
            {totalTemplates} plantillas · QR · Realidad aumentada · IA
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-[#17150f] sm:text-5xl md:text-6xl">
            El menú digital de tu restaurante,{' '}
            <span className="bg-[linear-gradient(135deg,#e99a0e_0%,#cc7809_100%)] bg-clip-text text-transparent">
              listo en minutos
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#57544f]">
            {PLATFORM.description}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full px-7 sm:w-auto">
              <Link to={ROUTES.auth.register}>
                Crear mi menú gratis
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full px-7 sm:w-auto">
              <Link to={ROUTES.marketing.templates}>Ver plantillas</Link>
            </Button>
          </div>

          <p className="mt-4 text-xs text-[#9a968e]">
            Sin tarjeta de crédito · Empieza gratis hoy
          </p>
        </div>
      </section>

      {/* ── Los 3 caminos ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#cc7809]">
            Tres formas de empezar
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#17150f]">
            Crea tu menú como prefieras
          </h2>
          <p className="mt-3 text-[#57544f]">
            Desde cero, con una plantilla o déjanos hacerlo por ti. Tú decides.
          </p>
        </div>
        <PathChooser />
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="bg-[#faf9f7] py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#cc7809]">
              Todo incluido
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#17150f]">
              Más que un menú: una experiencia
            </h2>
          </div>
          <FeatureShowcase />
        </div>
      </section>

      {/* ── Plantillas preview ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#cc7809]">
              Plantillas profesionales
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#17150f]">
              Un diseño para cada cocina
            </h2>
            <p className="mt-3 text-[#57544f]">
              {totalTemplates} estilos listos para usar — de sodas ticas a fine dining.
            </p>
          </div>
          <Button asChild variant="secondary" size="lg">
            <Link to={ROUTES.marketing.templates}>
              Ver las {totalTemplates}
              <ArrowRight size={15} />
            </Link>
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {previewTemplates.map((template) => (
            <TemplateGalleryCard key={template.id} template={template} />
          ))}
        </div>
      </section>

      {/* ── Precios ──────────────────────────────────────────────────────── */}
      <section id="precios" className="bg-[#faf9f7] py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#cc7809]">
              Precios claros
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#17150f]">
              Empieza gratis, crece cuando quieras
            </h2>
          </div>
          <PricingTable />
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#1f1c17_0%,#2c2620_100%)] px-8 py-14 text-center">
          <div className="pointer-events-none absolute right-[-5%] top-[-30%] h-[300px] w-[300px] rounded-full bg-[#e99a0e]/20 blur-[100px]" />
          <span className="relative flex justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f5b520]">
              <QrCode size={24} />
            </span>
          </span>
          <h2 className="relative mt-5 text-3xl font-bold tracking-tight text-white">
            Tu menú digital te está esperando
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/70">
            Créalo gratis en minutos. Sin instalaciones, sin complicaciones.
          </p>
          <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full px-7 sm:w-auto">
              <Link to={ROUTES.auth.register}>
                Crear mi menú gratis
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full px-7 sm:w-auto">
              <Link to={ROUTES.marketing.quote}>Prefiero que lo hagan por mí</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
