import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { MenuService } from '../services/MenuService'
import { menuQueryKeys } from '../types/menu.types'

interface UseArchiveMenuReturn {
  archiveMenu: (menuId: string) => Promise<void>
  isLoading: boolean
  archivingId: string | null
}

export function useArchiveMenu(tenantId: string): UseArchiveMenuReturn {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [archivingId, setArchivingId] = useState<string | null>(null)

  const archiveMenu = async (menuId: string) => {
    setIsLoading(true)
    setArchivingId(menuId)
    try {
      await MenuService.archiveMenu(tenantId, menuId)
      await queryClient.invalidateQueries({ queryKey: menuQueryKeys.all(tenantId) })
    } finally {
      setIsLoading(false)
      setArchivingId(null)
    }
  }

  return { archiveMenu, isLoading, archivingId }
}
