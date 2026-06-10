import { useState, memo } from 'react'
import { QrCode, BarChart3, UtensilsCrossed, Copy, Check, ExternalLink, MailWarning } from 'lucide-react'
import { useTenantContext } from '@app/providers/TenantProvider'
import { useAuth }          from '@features/auth'
import {
  MetricCard,
  QuickActions,
  ActivityFeed,
  useDashboardMetrics,
  useActivityFeed,
} from '@features/dashboard'
import { greeting } from '@shared/utils/datetime'
import type { MetricCardData } from '@features/dashboard'

// ─── Menu link banner ─────────────────────────────────────────────────────────

const MenuLinkBanner = memo(function MenuLinkBanner({ tenantId }: { tenantId: string }) {
  const [copied, setCopied] = useState(false)

  const menuUrl = `${window.location.origin}/${tenantId}/menu`

  const handleCopy = () => {
    void navigator.clipboard.writeText(menuUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:gap-4"
      style={{
        background: 'linear-gradient(135deg, #fef9ee 0%, #fef3c7 100%)',
        border: '1px solid rgba(217,119,6,0.25)',
      }}
    >
      {/* Icon */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ background: 'rgba(217,119,6,0.12)' }}
      >
        <QrCode size={18} style={{ color: '#b45309' }} />
      </div>

      {/* Text */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#92400e' }}>
          Tu link del menú
        </p>
        <p
          className="truncate font-mono text-[13px] font-semibold"
          style={{ color: '#1c1409' }}
        >
          {menuUrl}
        </p>
        <p className="text-[11px]" style={{ color: '#a16207' }}>
          Compártelo con tus clientes o imprimilo en un QR
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold transition-all active:scale-95"
          style={{
            background: copied ? '#d1fae5' : '#fff',
            border: `1px solid ${copied ? '#6ee7b7' : 'rgba(217,119,6,0.3)'}`,
            color: copied ? '#065f46' : '#92400e',
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
        <a
          href={`/${tenantId}/menu`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold transition-all active:scale-95"
          style={{
            background: '#b45309',
            color: '#fff',
          }}
        >
          <ExternalLink size={13} />
          Ver menú
        </a>
      </div>
    </div>
  )
})

// ─── Component ────────────────────────────────────────────────────────────────

// ─── Email verification banner ────────────────────────────────────────────────

const EmailVerificationBanner = memo(function EmailVerificationBanner() {
  const { resendVerificationEmail, resendLoading, resendSent } = useAuth()
  return (
    <div
      className="flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:gap-4"
      style={{
        background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
        border: '1px solid rgba(245,158,11,0.3)',
      }}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ background: 'rgba(245,158,11,0.12)' }}
      >
        <MailWarning size={18} style={{ color: '#b45309' }} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-[12px] font-semibold" style={{ color: '#92400e' }}>
          Confirma tu email
        </p>
        <p className="text-[12px]" style={{ color: '#a16207' }}>
          {resendSent
            ? 'Email enviado. Revisa tu bandeja de entrada.'
            : 'Te enviamos un link de verificación. Si no lo encontrás, podés reenviarlo.'}
        </p>
      </div>
      {!resendSent && (
        <button
          type="button"
          onClick={() => void resendVerificationEmail()}
          disabled={resendLoading}
          className="rounded-xl border border-amber-300 bg-white px-3 py-1.5 text-[12px] font-semibold text-amber-800 transition-all hover:bg-amber-50 disabled:opacity-50"
        >
          Reenviar email
        </button>
      )}
    </div>
  )
})

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { tenantId, tenant } = useTenantContext()
  const { user } = useAuth()

  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics(tenantId)
  const { events: activityItems, isLoading: activityLoading } = useActivityFeed(tenantId)

  const metricCards: MetricCardData[] = [
    {
      label: 'Platos activos',
      value: metrics?.activeDishes ?? 0,
      icon: UtensilsCrossed,
      color: 'brand',
    },
    {
      label: 'Escaneos QR (30d)',
      value: metrics?.qrScansLast30d ?? 0,
      icon: QrCode,
      color: 'blue',
    },
    {
      label: 'Lanzamientos AR (30d)',
      value: metrics?.arLaunchesLast30d ?? 0,
      icon: BarChart3,
      color: 'purple',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {user && !user.emailVerified && <EmailVerificationBanner />}
      {tenantId && <MenuLinkBanner tenantId={tenantId} />}

      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
          {greeting()}
        </p>
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-zinc-900">
          {tenant?.name ?? 'Dashboard'}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {metricCards.map((card) => (
          <MetricCard key={card.label} data={card} isLoading={metricsLoading} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <QuickActions />
        <ActivityFeed events={activityItems} isLoading={activityLoading} error={null} />
      </div>
    </div>
  )
}
