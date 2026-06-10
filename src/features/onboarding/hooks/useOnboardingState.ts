import type { Tenant } from '@core/domain/entities/Tenant'

interface UseOnboardingStateReturn {
  shouldShow: boolean
  isComplete: boolean
}

/**
 * Derives whether the onboarding wizard should be displayed for the given tenant.
 *
 * Tenants returned as `null` (still loading) → never show, to avoid flash-of-wizard.
 * Tenants with `onboardingCompletedAt === null` → show.
 */
export function useOnboardingState(tenant: Tenant | null): UseOnboardingStateReturn {
  if (!tenant) {
    return { shouldShow: false, isComplete: false }
  }
  const isComplete = tenant.onboardingCompletedAt !== null
  return {
    shouldShow: !isComplete,
    isComplete,
  }
}
