// ── Step definitions ──────────────────────────────────────────────────────────

export type OnboardingStep = 'welcome' | 'profile' | 'branding' | 'complete'

export const ONBOARDING_STEPS: OnboardingStep[] = [
  'welcome',
  'profile',
  'branding',
  'complete',
]

export const STEP_LABELS: Record<OnboardingStep, string> = {
  welcome:  'Bienvenido',
  profile:  'Perfil',
  branding: 'Apariencia',
  complete: 'Listo',
}

// ── Query keys ────────────────────────────────────────────────────────────────
//
// Onboarding mutates the tenant doc, so we invalidate ['tenant', tenantId]
// (owned by TenantProvider) — no dedicated query key needed here.
