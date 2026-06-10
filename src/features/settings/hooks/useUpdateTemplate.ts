import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { SettingsService } from '../services/SettingsService'

export function useUpdateTemplate(tenantId: string) {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const updateTemplate = async (templateId: string) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    try {
      await SettingsService.updateTemplate(tenantId, templateId)
      await queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] })
      setSuccess(true)
    } catch {
      setError('No se pudo cambiar la plantilla. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return { updateTemplate, isLoading, error, success }
}
