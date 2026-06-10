import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { MenuService } from '../services/MenuService'
import { menuQueryKeys } from '../types/menu.types'
import type { MenuFormValues } from '../types/menu.types'

interface UseUpdateMenuReturn {
  updateMenu: (menuId: string, values: MenuFormValues) => Promise<void>
  isLoading: boolean
  error: string | null
}

export function useUpdateMenu(tenantId: string): UseUpdateMenuReturn {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateMenu = async (menuId: string, values: MenuFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      await MenuService.updateMenu(tenantId, menuId, values)
      await queryClient.invalidateQueries({ queryKey: menuQueryKeys.all(tenantId) })
    } catch {
      setError('No se pudo actualizar el menú.')
      throw new Error('update failed')
    } finally {
      setIsLoading(false)
    }
  }

  return { updateMenu, isLoading, error }
}
