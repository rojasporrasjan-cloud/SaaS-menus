import { useQuery } from '@tanstack/react-query'
import { FirebaseEditorPersistenceService } from '@infrastructure/editor/FirebaseEditorPersistenceService'
import type { EditorDocument } from '@features/editor/types/editor.types'

// ─── Query key factory ────────────────────────────────────────────────────────

export const editorQueryKeys = {
  published: (tenantId: string) => ['editor', 'published', tenantId] as const,
} as const

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePublishedEditorDocument(tenantId: string | undefined): {
  document: EditorDocument | null
  isLoading: boolean
  isError: boolean
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: editorQueryKeys.published(tenantId ?? ''),
    queryFn: async () => {
      if (!tenantId) return null
      const service = new FirebaseEditorPersistenceService()
      return service.loadPublished(tenantId)
    },
    enabled: Boolean(tenantId),
    staleTime: 1000 * 60 * 2, // 2 min — menu data is semi-static
    gcTime:    1000 * 60 * 5,
  })

  return {
    document: data ?? null,
    isLoading,
    isError,
  }
}
