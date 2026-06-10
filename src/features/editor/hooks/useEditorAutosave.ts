import { useEffect } from 'react'
import { useEditorStore } from '../store/useEditorStore'
import { useAuth } from '@features/auth/hooks/useAuth'
import { FirebaseEditorPersistenceService } from '@infrastructure/editor/FirebaseEditorPersistenceService'
import { LIMITS } from '@shared/constants/limits'
import type { EditorSnapshot } from '../types/editor.types'

const persistenceService = new FirebaseEditorPersistenceService()

/**
 * Custom React hook to automatically persist editor drafts.
 * Monitors the `isDirty` state from the Zustand store, applies an
 * architectural debounce (autosaveDebounceMs) to prevent database flooding,
 * and handles saving, success, and error states cleanly in background.
 */
export function useEditorAutosave(): void {
  const { state, dispatch } = useEditorStore()
  const { user } = useAuth()
  const { isDirty, document } = state

  useEffect(() => {
    // If the document is not dirty or not loaded, do nothing
    if (!isDirty || !document) return

    const tenantId = document.tenantId
    const userId = user?.uid ?? 'unknown'

    // Debounce timer: wait until user stops making changes before hitting Firestore
    const timer = setTimeout(async () => {
      dispatch({ type: 'SAVE_START' })

      const snapshot: EditorSnapshot = {
        id: crypto.randomUUID(),
        document,
        createdAt: new Date().toISOString(),
        triggeredBy: 'user',
        userId,
        label: null,
      }

      try {
        await persistenceService.saveDraft(tenantId, snapshot)
        dispatch({ type: 'SAVE_SUCCESS' })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error during autosave'
        dispatch({ type: 'SAVE_ERROR', message: errorMessage })
      }
    }, LIMITS.editor.autosaveDebounceMs)

    // Cleanup: cancel the pending timer if changes continue or component unmounts
    return () => {
      clearTimeout(timer)
    }
  }, [isDirty, document, user?.uid, dispatch])
}
