import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { MenuService } from '../services/MenuService'
import { menuQueryKeys } from '../types/menu.types'
import type { CategoryFormValues } from '../types/menu.types'
import type { Category } from '@core/domain/entities/Category'

interface UseCreateCategoryReturn {
  createCategory: (menuId: string, values: CategoryFormValues, existing: Category[]) => Promise<void>
  isLoading: boolean
  error: string | null
}

export function useCreateCategory(tenantId: string): UseCreateCategoryReturn {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCategory = async (
    menuId: string,
    values: CategoryFormValues,
    existing: Category[],
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      await MenuService.createCategory(tenantId, menuId, values, existing.length)
      await queryClient.invalidateQueries({
        queryKey: menuQueryKeys.categories(tenantId, menuId),
      })
    } catch {
      setError('No se pudo crear la categoría.')
      throw new Error('create failed')
    } finally {
      setIsLoading(false)
    }
  }

  return { createCategory, isLoading, error }
}
