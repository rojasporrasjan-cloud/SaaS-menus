import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { DishService } from '../services/DishService'
import { dishQueryKeys } from '../types/dish.types'
import type { DishFormValues } from '../types/dish.types'

interface UseCreateDishReturn {
  createDish: (menuId: string, values: DishFormValues, imageUrl: string | null) => Promise<void>
  isLoading: boolean
  error: string | null
  setError: (error: string | null) => void
}

export function useCreateDish(tenantId: string): UseCreateDishReturn {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createDish = async (
    menuId: string,
    values: DishFormValues,
    imageUrl: string | null,
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      await DishService.createDish(tenantId, menuId, values, imageUrl)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: dishQueryKeys.byMenu(tenantId, menuId) }),
        queryClient.invalidateQueries({ queryKey: dishQueryKeys.all(tenantId) }),
      ])
    } catch {
      setError('No se pudo guardar el plato. Intenta de nuevo.')
      throw new Error('create failed')
    }
  }

  return { createDish, isLoading, error, setError }
}
