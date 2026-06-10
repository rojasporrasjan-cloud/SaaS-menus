import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { MenuService } from '../services/MenuService'
import { menuQueryKeys } from '../types/menu.types'
import type { MenuFormValues } from '../types/menu.types'

interface UseCreateMenuReturn {
  createMenu: (values: MenuFormValues) => Promise<string>
  isLoading: boolean
  error: string | null
}

export function useCreateMenu(tenantId: string): UseCreateMenuReturn {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createMenu = async (values: MenuFormValues): Promise<string> => {
    setIsLoading(true)
    setError(null)
    try {
      const menuId = await MenuService.createMenu(tenantId, values)
      await queryClient.invalidateQueries({ queryKey: menuQueryKeys.all(tenantId) })
      return menuId
    } catch {
      setError('No se pudo crear el menú. Intenta de nuevo.')
      throw new Error('create failed')
    } finally {
      setIsLoading(false)
    }
  }

  return { createMenu, isLoading, error }
}
