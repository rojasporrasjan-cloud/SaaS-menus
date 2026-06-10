import type { ReactNode } from 'react'
import { useTenantContext } from '@app/providers/TenantProvider'
import { useTenantTheme } from '../../hooks/useTenantTheme'

interface TenantThemeBoundaryProps {
  children: ReactNode
}

/**
 * Side-effect-only wrapper that subscribes to the current tenant's
 * `branding.primaryColor` and re-themes the entire app at runtime.
 *
 * Must be rendered **inside** `<TenantProvider>` and **once** per app —
 * nesting multiple instances would race for the `--color-brand-*` CSS vars.
 *
 * The wrapper renders children directly; the theme is applied to
 * `document.documentElement` so it affects every existing className that
 * resolves to `var(--color-brand-*)`.
 */
export function TenantThemeBoundary({ children }: TenantThemeBoundaryProps) {
  const { tenant } = useTenantContext()
  useTenantTheme(tenant?.branding.primaryColor ?? null)
  return <>{children}</>
}
