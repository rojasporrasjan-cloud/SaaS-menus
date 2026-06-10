import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { SettingsService } from '../services/SettingsService'
import type { BrandingFormValues } from '../types/settings.types'

interface UseUpdateBrandingReturn {
  updateBranding: (
    values: BrandingFormValues,
    logoUrl: string | null,
    coverImageUrl: string | null,
  ) => Promise<void>
  isLoading: boolean
  error: string | null
  success: boolean
}

export function useUpdateBranding(tenantId: string): UseUpdateBrandingReturn {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const updateBranding = async (
    values: BrandingFormValues,
    logoUrl: string | null,
    coverImageUrl: string | null,
  ) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    try {
      await SettingsService.updateBranding(tenantId, values, logoUrl, coverImageUrl)
      await queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('No se pudo guardar la apariencia. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return { updateBranding, isLoading, error, success }
}
