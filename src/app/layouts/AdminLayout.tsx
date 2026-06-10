import { useState } from 'react'
import { Outlet, useLocation, useMatch } from 'react-router-dom'
import { Sidebar, Topbar } from '@features/dashboard'
import { OnboardingWizard, useOnboardingState } from '@features/onboarding'
import { useTenantContext } from '@app/providers/TenantProvider'
import { ROUTES } from '@shared/constants/routes'

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.admin.dashboard]:    'Dashboard',
  [ROUTES.admin.menu.list]:    'Menú',
  [ROUTES.admin.dishes.list]:  'Platos',
  [ROUTES.admin.dishes.new]:   'Nuevo plato',
  [ROUTES.admin.qr]:           'Mesas & QR',
  [ROUTES.admin.analytics]:    'Analíticas',
  [ROUTES.admin.settings]:     'Configuración',
  [ROUTES.admin.appearance]:   'Apariencia',
}

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location    = useLocation()
  const isDishEditor = useMatch(ROUTES.admin.dishes.editor)

  const { tenant } = useTenantContext()
  const { shouldShow: shouldShowOnboarding } = useOnboardingState(tenant)

  const pageTitle =
    isDishEditor
      ? 'Editar plato'
      : PAGE_TITLES[location.pathname] ?? 'Admin'

  return (
    <div className="flex min-h-svh" style={{ background: '#faf9f7' }}>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar
          title={pageTitle}
          onMenuToggle={() => setIsSidebarOpen((o) => !o)}
        />

        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>

      {shouldShowOnboarding && <OnboardingWizard />}
    </div>
  )
}
