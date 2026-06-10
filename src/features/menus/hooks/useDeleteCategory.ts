import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { MenuService } from '../services/MenuService'
import { menuQueryKeys } from '../types/menu.types'

interface UseDeleteCategoryReturn {
  deleteCategory: (menuId: string, categoryId: string) => Promise<void>
  deletingId: string | null
}

export function useDeleteCategory(tenantId: string): UseDeleteCategoryReturn {
  const queryClient = useQueryClient()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const deleteCategory = async (menuId: string, categoryId: string) => {
    setDeletingId(categoryId)
    try {
      await MenuService.deleteCategory(tenantId, menuId, categoryId)
      await queryClient.invalidateQueries({
        queryKey: menuQueryKeys.categories(tenantId, menuId),
      })
    } finally {
      setDeletingId(null)
    }
  }

  return { deleteCategory, deletingId }
}
