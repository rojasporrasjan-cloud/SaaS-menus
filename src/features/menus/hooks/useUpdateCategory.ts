import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { MenuService } from '../services/MenuService'
import { menuQueryKeys } from '../types/menu.types'
import type { CategoryFormValues } from '../types/menu.types'

interface UseUpdateCategoryReturn {
  updateCategory: (menuId: string, categoryId: string, values: CategoryFormValues) => Promise<void>
  isLoading: boolean
  error: string | null
}

export function useUpdateCategory(tenantId: string): UseUpdateCategoryReturn {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateCategory = async (
    menuId: string,
    categoryId: string,
    values: CategoryFormValues,
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      await MenuService.updateCategory(tenantId, menuId, categoryId, values)
      await queryClient.invalidateQueries({
        queryKey: menuQueryKeys.categories(tenantId, menuId),
      })
    } catch {
      setError('No se pudo actualizar la categoría.')
      throw new Error('update failed')
    } finally {
      setIsLoading(false)
    }
  }

  return { updateCategory, isLoading, error }
}
