import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { OnboardingService } from '../services/OnboardingService'

interface UseCompleteOnboardingReturn {
  completeOnboarding: () => Promise<void>
  isLoading: boolean
  error: string | null
}

export function useCompleteOnboarding(tenantId: string): UseCompleteOnboardingReturn {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const completeOnboarding = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await OnboardingService.completeOnboarding(tenantId)
      // Refresh the cached tenant — Wizard will auto-close once tenant.onboardingCompletedAt is set
      await queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] })
    } catch {
      setError('No se pudo completar la configuración. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return { completeOnboarding, isLoading, error }
}
