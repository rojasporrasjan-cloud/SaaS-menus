import { memo }                                         from 'react'
import { Link }                                        from 'react-router-dom'
import { PlusCircle, QrCode, BarChart3, ArrowRight }  from 'lucide-react'
import { ROUTES }                                      from '@shared/constants/routes'

const ACTIONS = [
  {
    label:       'Nuevo plato',
    description: 'Agrega un platillo al menú',
    icon:        PlusCircle,
    to:          ROUTES.admin.dishes.new,
    iconBg:      'rgba(233,154,14,0.1)',
    iconColor:   '#cc7809',
    hoverBg:     'rgba(233,154,14,0.15)',
  },
  {
    label:       'Generar QR',
    description: 'Crea un código QR de mesa',
    icon:        QrCode,
    to:          ROUTES.admin.qr,
    iconBg:      'rgba(59,130,246,0.1)',
    iconColor:   '#2563eb',
    hoverBg:     'rgba(59,130,246,0.15)',
  },
  {
    label:       'Ver analíticas',
    description: 'Escaneos y vistas del menú',
    icon:        BarChart3,
    to:          ROUTES.admin.analytics,
    iconBg:      'rgba(139,92,246,0.1)',
    iconColor:   '#7c3aed',
    hoverBg:     'rgba(139,92,246,0.15)',
  },
] as const

export const QuickActions = memo(function QuickActions() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: '#ffffff',
        border:     '1px solid #efede9',
        boxShadow:  '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
      }}
    >
      <h3
        className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em]"
        style={{ color: '#bfbbb4' }}
      >
        Acciones rápidas
      </h3>

      <div className="flex flex-col gap-0.5">
        {ACTIONS.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.to}
              to={action.to}
              className="group flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-all"
              style={{ color: 'inherit' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#faf9f7' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all"
                style={{ background: action.iconBg }}
              >
                <Icon size={15} strokeWidth={1.8} style={{ color: action.iconColor }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold" style={{ color: '#27251f' }}>
                  {action.label}
                </p>
                <p className="text-[11px]" style={{ color: '#a8a49d' }}>
                  {action.description}
                </p>
              </div>
              <ArrowRight
                size={13}
                className="shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                style={{ color: '#bfbbb4' }}
              />
            </Link>
          )
        })}
      </div>
    </div>
  )
})
