import { CheckCircle2, XCircle, Zap, ExternalLink } from 'lucide-react'
import type { Tenant, TenantPlan } from '@core/domain/entities/Tenant'

interface PlanInfoProps {
  tenant: Tenant
}

interface FeatureRow {
  label: string
  featureKey: keyof Tenant['features'] | null
  availableFrom: TenantPlan[]
}

const PLAN_ORDER: TenantPlan[] = ['free', 'starter', 'pro', 'enterprise']

const FEATURES: FeatureRow[] = [
  {
    label: 'Menú digital QR',
    featureKey: 'qrGeneratorEnabled',
    availableFrom: ['free', 'starter', 'pro', 'enterprise'],
  },
  {
    label: 'Gestión de platos y menús',
    featureKey: null,
    availableFrom: ['free', 'starter', 'pro', 'enterprise'],
  },
  {
    label: 'Analíticas básicas (30 d)',
    featureKey: 'analyticsEnabled',
    availableFrom: ['free', 'starter', 'pro', 'enterprise'],
  },
  {
    label: 'Analíticas avanzadas (90 d)',
    featureKey: null,
    availableFrom: ['pro', 'enterprise'],
  },
  {
    label: 'Vista 3D / AR de platos',
    featureKey: 'arEnabled',
    availableFrom: ['pro', 'enterprise'],
  },
  {
    label: 'Color de marca personalizado',
    featureKey: null,
    availableFrom: ['starter', 'pro', 'enterprise'],
  },
  {
    label: 'Exportar CSV de analíticas',
    featureKey: null,
    availableFrom: ['starter', 'pro', 'enterprise'],
  },
  {
    label: 'Múltiples idiomas',
    featureKey: 'multiLanguageEnabled',
    availableFrom: ['pro', 'enterprise'],
  },
  {
    label: 'Programa de lealtad',
    featureKey: 'loyaltyEnabled',
    availableFrom: ['enterprise'],
  },
  {
    label: 'Soporte prioritario',
    featureKey: null,
    availableFrom: ['pro', 'enterprise'],
  },
]

const PLAN_LABELS: Record<TenantPlan, string> = {
  free:       'Gratuito',
  starter:    'Starter',
  pro:        'Pro',
  enterprise: 'Enterprise',
}

const PLAN_BADGE: Record<TenantPlan, string> = {
  free:       'bg-surface-100 text-surface-600',
  starter:    'bg-sky-50 text-sky-700 border border-sky-200',
  pro:        'bg-brand-50 text-brand-700 border border-brand-200',
  enterprise: 'bg-violet-50 text-violet-700 border border-violet-200',
}

function isAvailableOnPlan(row: FeatureRow, plan: TenantPlan): boolean {
  return row.availableFrom.includes(plan)
}


function FeatureCell({ active }: { active: boolean }) {
  return active ? (
    <CheckCircle2 size={16} className="text-brand-600" />
  ) : (
    <XCircle size={16} className="text-surface-300" />
  )
}

export function PlanInfo({ tenant }: PlanInfoProps) {
  const { plan, features } = tenant
  const isPaid = plan !== 'free'
  const planLabel = PLAN_LABELS[plan]
  const badgeClass = PLAN_BADGE[plan]

  // Feature flags that are explicitly enabled
  const activeFlags = Object.entries(features)
    .filter(([, v]) => v)
    .map(([k]) => k)

  return (
    <div className="flex flex-col gap-6">

      {/* Current plan card */}
      <div className="flex flex-col gap-4 rounded-2xl border border-surface-100 bg-surface-0 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <p className="text-xs text-surface-500">Plan actual</p>
          <span
            className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-semibold ${badgeClass}`}
          >
            {planLabel}
          </span>
          {activeFlags.length > 0 && (
            <p className="text-xs text-surface-400">
              {activeFlags.length} función{activeFlags.length !== 1 ? 'es' : ''} activa{activeFlags.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {isPaid ? (
          <p className="text-sm font-medium text-brand-600">✓ Plan activo</p>
        ) : (
          <a
            href="mailto:hola@sodarustica.com?subject=Upgrade%20a%20Pro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
          >
            <Zap size={14} />
            Mejorar a Pro
            <ExternalLink size={12} className="opacity-70" />
          </a>
        )}
      </div>

      {/* Feature comparison table */}
      <div className="rounded-2xl border border-surface-100 bg-surface-0 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_repeat(4,_auto)] gap-x-4 border-b border-surface-100 px-5 py-3">
          <span className="text-xs font-medium text-surface-500">Función</span>
          {PLAN_ORDER.map((p) => (
            <span
              key={p}
              className={[
                'text-xs font-medium text-center',
                p === plan ? 'text-brand-600' : 'text-surface-400',
              ].join(' ')}
            >
              {PLAN_LABELS[p]}
            </span>
          ))}
        </div>

        {/* Rows */}
        {FEATURES.map((feature, i) => (
          <div
            key={feature.label}
            className={[
              'grid grid-cols-[1fr_repeat(4,_auto)] gap-x-4 px-5 py-3 items-center',
              i % 2 === 1 ? 'bg-surface-50' : '',
            ].join(' ')}
          >
            <span className="text-sm text-surface-700">{feature.label}</span>
            {PLAN_ORDER.map((p) => (
              <div key={p} className="flex justify-center">
                <FeatureCell active={isAvailableOnPlan(feature, p)} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Your current features summary */}
      <div className="rounded-2xl border border-surface-100 bg-surface-50 px-5 py-4">
        <p className="mb-3 text-xs font-medium text-surface-600">
          Funciones habilitadas en tu cuenta
        </p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: 'arEnabled',            label: 'AR / 3D'          },
              { key: 'analyticsEnabled',      label: 'Analíticas'       },
              { key: 'qrGeneratorEnabled',    label: 'Generador QR'     },
              { key: 'multiLanguageEnabled',  label: 'Multi-idioma'     },
              { key: 'loyaltyEnabled',        label: 'Lealtad'          },
            ] as { key: keyof Tenant['features']; label: string }[]
          ).map(({ key, label }) => (
            <span
              key={key}
              className={[
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                features[key]
                  ? 'bg-brand-50 text-brand-700 border border-brand-200'
                  : 'bg-surface-100 text-surface-400 line-through',
              ].join(' ')}
            >
              {features[key] ? (
                <CheckCircle2 size={11} />
              ) : (
                <XCircle size={11} />
              )}
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Upgrade CTA (only for free plan) */}
      {!isPaid && (
        <div className="flex flex-col gap-3 rounded-2xl border border-brand-100 bg-brand-50 px-5 py-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-brand-600" />
            <p className="text-sm font-semibold text-brand-700">
              Desbloquea AR, analíticas avanzadas y más
            </p>
          </div>
          <p className="text-sm text-brand-600">
            Contacta a tu administrador de cuenta para activar el plan Pro y brindar
            a tus clientes la experiencia completa de menú aumentado.
          </p>
          <a
            href="mailto:hola@sodarustica.com?subject=Upgrade%20a%20Pro"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
          >
            <Zap size={14} />
            Solicitar upgrade
          </a>
        </div>
      )}
    </div>
  )
}
