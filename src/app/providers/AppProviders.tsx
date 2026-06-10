import type { ReactNode } from 'react'
import { QueryProvider } from './QueryProvider'
import { AuthProvider } from './AuthProvider'
import { TenantProvider } from './TenantProvider'
import { TenantThemeBoundary } from '@features/theme'

/**
 * Single composition root for all application providers.
 *
 * Order matters:
 *   QueryProvider → AuthProvider → TenantProvider → TenantThemeBoundary
 *
 * - `TenantProvider` uses `useQuery`, so it must sit inside `QueryProvider`.
 * - `TenantThemeBoundary` reads `useTenantContext()` and applies the brand
 *   color scale globally, so it must sit inside `TenantProvider`.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <TenantProvider>
          <TenantThemeBoundary>
            {children}
          </TenantThemeBoundary>
        </TenantProvider>
      </AuthProvider>
    </QueryProvider>
  )
}
