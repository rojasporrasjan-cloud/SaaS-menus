import { Outlet } from 'react-router-dom'
import { MarketingHeader } from '@features/marketing/components/MarketingHeader'
import { MarketingFooter } from '@features/marketing/components/MarketingFooter'

/**
 * Layout del sitio de marketing (la puerta de entrada del SaaS).
 * Header con navegación + CTAs, contenido y footer.
 */
export function MarketingLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-white text-[#17150f]">
      <MarketingHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <MarketingFooter />
    </div>
  )
}
