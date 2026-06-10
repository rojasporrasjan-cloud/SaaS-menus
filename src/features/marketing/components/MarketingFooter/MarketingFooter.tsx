import { Link } from 'react-router-dom'
import { UtensilsCrossed, Mail } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { PLATFORM } from '@shared/constants/brand'

export function MarketingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[#efede9] bg-[#faf9f7]">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <Link to={ROUTES.marketing.landing} className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#e99a0e_0%,#cc7809_100%)]">
                <UtensilsCrossed size={18} className="text-white" />
              </span>
              <span className="text-[17px] font-bold tracking-tight text-[#17150f]">
                {PLATFORM.name}
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-[#57544f]">
              {PLATFORM.tagline}
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#9a968e]">
                Producto
              </span>
              <Link to={ROUTES.marketing.templates} className="text-sm text-[#57544f] hover:text-[#17150f]">
                Plantillas
              </Link>
              <Link to={ROUTES.marketing.quote} className="text-sm text-[#57544f] hover:text-[#17150f]">
                Cotizar
              </Link>
              <Link to={ROUTES.auth.register} className="text-sm text-[#57544f] hover:text-[#17150f]">
                Crear menú gratis
              </Link>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#9a968e]">
                Cuenta
              </span>
              <Link to={ROUTES.auth.login} className="text-sm text-[#57544f] hover:text-[#17150f]">
                Iniciar sesión
              </Link>
              <a
                href={`mailto:${PLATFORM.salesEmail}`}
                className="flex items-center gap-1.5 text-sm text-[#57544f] hover:text-[#17150f]"
              >
                <Mail size={14} />
                {PLATFORM.salesEmail}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#efede9] pt-6 text-center text-xs text-[#9a968e]">
          © {year} {PLATFORM.legalName} · Todos los derechos reservados
        </div>
      </div>
    </footer>
  )
}
