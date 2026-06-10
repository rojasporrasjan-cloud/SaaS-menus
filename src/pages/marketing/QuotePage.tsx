import { Link } from 'react-router-dom'
import { CheckCircle2, MessageCircle, Clock, Sparkles, ArrowLeft } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { PLATFORM } from '@shared/constants/brand'
import { buildWhatsAppUrl } from '@shared/utils/whatsapp'
import { Button } from '@shared/ui/components/Button'
import { QuoteForm, useSubmitQuote, QUOTE_SOURCE } from '@features/marketing'

const WHATSAPP_PRESET =
  'Hola, me interesa que me ayuden a crear el menú digital de mi restaurante.'

const SELLING_POINTS = [
  { icon: Sparkles, text: 'Nuestro equipo arma tu menú completo' },
  { icon: Clock, text: 'Respuesta en menos de 24 horas hábiles' },
  { icon: MessageCircle, text: 'Te acompañamos por WhatsApp en todo el proceso' },
] as const

export default function QuotePage() {
  const { state, submit } = useSubmitQuote(QUOTE_SOURCE.quotePage)
  const whatsappUrl = buildWhatsAppUrl(PLATFORM.salesWhatsApp, WHATSAPP_PRESET)

  if (state.status === 'success') {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
          <CheckCircle2 size={32} />
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-[#17150f]">
          ¡Solicitud enviada!
        </h1>
        <p className="mt-3 text-[#57544f]">
          Gracias por contarnos sobre tu restaurante. Nuestro equipo te contactará muy pronto para
          armar tu menú digital.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} />
              Escríbenos por WhatsApp
            </a>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to={ROUTES.marketing.landing}>Volver al inicio</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <Link
        to={ROUTES.marketing.landing}
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-[#57544f] hover:text-[#17150f]"
      >
        <ArrowLeft size={15} />
        Volver al inicio
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        {/* Columna izquierda — propuesta */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-[#cc7809]">
              Lo hacemos por ti
            </span>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#17150f]">
              Cotiza tu menú digital
            </h1>
            <p className="mt-3 leading-relaxed text-[#57544f]">
              ¿No tienes tiempo de armarlo? Cuéntanos sobre tu restaurante y nuestro equipo diseña,
              digitaliza y publica tu menú completo. Tú solo lo apruebas.
            </p>
          </div>

          <ul className="flex flex-col gap-3">
            {SELLING_POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-[#3d3b38]">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fbf3e2] text-[#cc7809]">
                  <Icon size={16} />
                </span>
                <span className="pt-1.5">{text}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border border-[#efede9] bg-[#faf9f7] p-5">
            <p className="text-sm text-[#57544f]">
              ¿Prefieres hablar directo? Escríbenos por WhatsApp:
            </p>
            <Button asChild variant="secondary" size="md" className="mt-3">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={15} />
                Abrir WhatsApp
              </a>
            </Button>
          </div>
        </div>

        {/* Columna derecha — formulario */}
        <div className="rounded-3xl border border-[#efede9] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)] sm:p-8">
          <QuoteForm
            onSubmit={submit}
            isLoading={state.status === 'submitting'}
            error={state.status === 'error' ? state.message : null}
          />
        </div>
      </div>
    </div>
  )
}
