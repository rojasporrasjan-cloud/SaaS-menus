import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { UtensilsCrossed, Menu as MenuIcon, X } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { PLATFORM } from '@shared/constants/brand'
import { cn } from '@shared/utils/cn'
import { Button } from '@shared/ui/components/Button'

interface NavLinkItem {
  readonly label: string
  readonly to: string
}

const NAV_LINKS: readonly NavLinkItem[] = [
  { label: 'Plantillas', to: ROUTES.marketing.templates },
  { label: 'Cotizar', to: ROUTES.marketing.quote },
] as const

export function MarketingHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-[#efede9] bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        {/* Logo */}
        <Link to={ROUTES.marketing.landing} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#e99a0e_0%,#cc7809_100%)] shadow-sm">
            <UtensilsCrossed size={18} className="text-white" />
          </span>
          <span className="text-[17px] font-bold tracking-tight text-[#17150f]">
            {PLATFORM.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-[#17150f]'
                    : 'text-[#57544f] hover:bg-[#efede9] hover:text-[#17150f]',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="md">
            <Link to={ROUTES.auth.login}>Iniciar sesión</Link>
          </Button>
          <Button asChild size="md">
            <Link to={ROUTES.auth.register}>Crear menú gratis</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#57544f] hover:bg-[#efede9] md:hidden"
        >
          {isOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-[#efede9] bg-white px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#3d3b38] hover:bg-[#efede9]"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Button asChild variant="secondary" size="lg" className="w-full">
                <Link to={ROUTES.auth.login} onClick={() => setIsOpen(false)}>
                  Iniciar sesión
                </Link>
              </Button>
              <Button asChild size="lg" className="w-full">
                <Link to={ROUTES.auth.register} onClick={() => setIsOpen(false)}>
                  Crear menú gratis
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
