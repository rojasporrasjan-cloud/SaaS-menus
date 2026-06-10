import { useState } from 'react'
import { SettingsService } from '../services/SettingsService'

interface UseUpdateEmployeePinReturn {
  updatePin: (pinHash: string) => Promise<void>
  isLoading: boolean
  error: string | null
  success: boolean
}

export function useUpdateEmployeePin(tenantId: string): UseUpdateEmployeePinReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const updatePin = async (pinHash: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    try {
      await SettingsService.updateEmployeePin(tenantId, pinHash)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('No se pudo guardar el PIN. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return { updatePin, isLoading, error, success }
}
