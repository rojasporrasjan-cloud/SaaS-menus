import { create } from 'zustand'
import { editorReducer } from './editorReducer'
import type { EditorState, EditorDocument } from '@features/editor/types/editor.types'
import type { EditorAction, AIEditorAction } from '@features/editor/types/editor-actions.types'
import { INITIAL_EDITOR_STATE } from '@features/editor/types/editor.types'
import { isAIPermittedAction } from '@features/editor/types/editor-actions.types'

interface EditorStore {
  readonly state: Readonly<EditorState>
  readonly dispatch: (action: EditorAction) => void
  readonly dispatchAI: (action: AIEditorAction) => void
  readonly loadDocument: (document: EditorDocument) => void
}

export const useEditorStore = create<EditorStore>((set) => ({
  state: INITIAL_EDITOR_STATE,

  dispatch: (action) =>
    set((store) => ({
      state: editorReducer(store.state, action),
    })),

  dispatchAI: (action) => {
    if (!isAIPermittedAction(action)) {
      console.error('[AI Security Violation] blocked action')
      return
    }
    set((store) => ({
      state: editorReducer(store.state, action),
    }))
  },

  loadDocument: (document) =>
    set((store) => ({
      state: editorReducer(store.state, { type: 'LOAD_DOCUMENT', document }),
    })),
}))

// ─── Selectors ────────────────────────────────────────────────────────────────
//
// Always use these instead of s.state.X directly.
// Zustand re-renders only when the selected slice changes.

export const selectDocument      = (s: EditorStore) => s.state.document
export const selectDataLayers    = (s: EditorStore) => s.state.document?.dataLayers ?? []
export const selectCanvaTemplate = (s: EditorStore) => s.state.document?.canvaTemplate ?? null
export const selectTheme         = (s: EditorStore) => s.state.document?.theme ?? null
export const selectTenantId      = (s: EditorStore) => s.state.document?.tenantId ?? null
export const selectIsDirty       = (s: EditorStore) => s.state.isDirty
export const selectStatus        = (s: EditorStore) => s.state.status
export const selectExportStatus  = (s: EditorStore) => s.state.exportStatus
export const selectSelectedId    = (s: EditorStore) => s.state.selectedLayerId
export const selectError         = (s: EditorStore) => s.state.error
export const selectCanUndo       = (s: EditorStore) => s.state.history.length > 0
export const selectCanRedo       = (s: EditorStore) => s.state.future.length > 0

export const selectLayerById = (id: string) =>
  (s: EditorStore) => s.state.document?.dataLayers?.find(l => l.id === id) ?? null
