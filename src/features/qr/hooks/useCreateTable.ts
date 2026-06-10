import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { QRService } from '../services/QRService'
import { qrQueryKeys } from '../types/qr.types'
import type { TableFormValues } from '../types/qr.types'

interface UseCreateTableReturn {
  createTable: (values: TableFormValues) => Promise<void>
  isLoading: boolean
  error: string | null
}

export function useCreateTable(tenantId: string): UseCreateTableReturn {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTable = async (values: TableFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      await QRService.createTable(tenantId, values)
      await queryClient.invalidateQueries({ queryKey: qrQueryKeys.tables(tenantId) })
    } catch {
      setError('No se pudo crear la mesa. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return { createTable, isLoading, error }
}
