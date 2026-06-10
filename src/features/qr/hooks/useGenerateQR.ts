import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { QRService } from '../services/QRService'
import { qrQueryKeys } from '../types/qr.types'

interface UseGenerateQRReturn {
  generateQR: (tableId: string, menuUrl: string) => Promise<void>
  isLoading: boolean
  error: string | null
  generatingTableId: string | null
}

export function useGenerateQR(tenantId: string): UseGenerateQRReturn {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatingTableId, setGeneratingTableId] = useState<string | null>(null)

  const generateQR = async (tableId: string, menuUrl: string) => {
    setIsLoading(true)
    setError(null)
    setGeneratingTableId(tableId)

    try {
      await QRService.generateQR({ tenantId, tableId, menuUrl })
      await queryClient.invalidateQueries({ queryKey: qrQueryKeys.tables(tenantId) })
    } catch {
      setError('No se pudo generar el código QR. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
      setGeneratingTableId(null)
    }
  }

  return { generateQR, isLoading, error, generatingTableId }
}
