import type { EditorAction } from '../types/editor-actions.types'
import type { EditorState, EditorDocument } from '../types/editor.types'
import type { DataLayer } from '../types/blocks.types'
import { INITIAL_EDITOR_STATE } from '../types/editor.types'
import { LIMITS } from '@shared/constants/limits'

// ─── Pure reducer ─────────────────────────────────────────────────────────────
//
// Every case returns a new state — never mutates.
// All document changes go through commitDocument() which manages history.

export function editorReducer(state: EditorState = INITIAL_EDITOR_STATE, action: EditorAction): EditorState {
  switch (action.type) {

    // ── Document lifecycle ──────────────────────────────────────────────────

    case 'LOAD_DOCUMENT':
      return { ...INITIAL_EDITOR_STATE, status: 'ready', document: normalizeDocument(action.document) }

    case 'RESET_DOCUMENT':
      return INITIAL_EDITOR_STATE

    // ── Canva template ──────────────────────────────────────────────────────

    case 'SET_CANVA_TEMPLATE': {
      if (!state.document) return state
      return commitDocument(state, { ...state.document, canvaTemplate: action.canvaTemplate })
    }

    // ── DataLayer CRUD ──────────────────────────────────────────────────────

    case 'ADD_LAYER': {
      if (!state.document) return state
      const layers = [...state.document.dataLayers, action.layer]
      return commitDocument(state, { ...state.document, dataLayers: layers })
    }

    case 'REMOVE_LAYER': {
      if (!state.document) return state
      const layers = state.document.dataLayers.filter(l => l.id !== action.layerId)
      return commitDocument(state, { ...state.document, dataLayers: layers })
    }

    case 'UPDATE_LAYER': {
      if (!state.document) return state
      const layers = state.document.dataLayers.map(l =>
        l.id === action.layerId
          // safe: shallow patch of same DataLayer instance
          ? ({ ...l, ...action.patch } as DataLayer)
          : l
      )
      return commitDocument(state, { ...state.document, dataLayers: layers })
    }

    case 'UPDATE_LAYER_POSITION': {
      if (!state.document) return state
      const layers = state.document.dataLayers.map(l =>
        l.id === action.layerId
          // safe: spread preserves all DataLayer fields; patch only touches position sub-object
          ? ({ ...l, position: { ...l.position, ...action.patch } } as DataLayer)
          : l
      )
      return commitDocument(state, { ...state.document, dataLayers: layers })
    }

    case 'UPDATE_LAYER_TEXT_STYLE': {
      if (!state.document) return state
      const layers = state.document.dataLayers.map(l => {
        if (l.id !== action.layerId) return l
        const textStyle = l.textStyle
          ? { ...l.textStyle, ...action.patch }
          : null
        // safe: only textStyle sub-object is patched; all discriminant fields preserved from l
        return { ...l, textStyle } as DataLayer
      })
      return commitDocument(state, { ...state.document, dataLayers: layers })
    }

    case 'REORDER_LAYERS': {
      if (!state.document) return state
      const idToLayer = new Map(state.document.dataLayers.map(l => [l.id, l]))
      const reordered = action.orderedIds
        .map((id, i) => {
          const layer = idToLayer.get(id)
          return layer
            // safe: only zIndex inside position is patched; discriminant and other fields intact
            ? ({ ...layer, position: { ...layer.position, zIndex: i } } as DataLayer)
            : null
        })
        .filter((l): l is DataLayer => l !== null)
      if (reordered.length !== state.document.dataLayers.length) return state
      return commitDocument(state, { ...state.document, dataLayers: reordered })
    }

    case 'TOGGLE_LAYER': {
      if (!state.document) return state
      const layers = state.document.dataLayers.map(l =>
        l.id === action.layerId ? { ...l, visible: !l.visible } : l
      )
      return commitDocument(state, { ...state.document, dataLayers: layers })
    }

    // ── Selection ───────────────────────────────────────────────────────────

    case 'SELECT_LAYER':
      return { ...state, selectedLayerId: action.layerId }

    // ── Theme ───────────────────────────────────────────────────────────────

    case 'SET_THEME': {
      if (!state.document) return state
      return commitDocument(state, { ...state.document, theme: { ...state.document.theme, ...action.patch } })
    }

    case 'SET_TEMPLATE': {
      if (!state.document) return state
      return commitDocument(state, { ...state.document, templateId: action.templateId })
    }

    case 'APPLY_TEMPLATE': {
      if (!state.document) return state
      return commitDocument(state, {
        ...state.document,
        templateId:    action.templateId,
        canvaTemplate: action.canvaTemplate,
        dataLayers:    [...action.defaultLayers],
        theme:         action.theme,
      })
    }

    // ── History ─────────────────────────────────────────────────────────────

    case 'UNDO': {
      if (!state.document || state.history.length === 0) return state
      const [prev, ...remainingHistory] = state.history
      return { ...state, document: prev, history: remainingHistory, future: [state.document, ...state.future], isDirty: true }
    }

    case 'REDO': {
      if (!state.document || state.future.length === 0) return state
      const [next, ...remainingFuture] = state.future
      return { ...state, document: next, history: [state.document, ...state.history], future: remainingFuture, isDirty: true }
    }

    // ── Async status ────────────────────────────────────────────────────────

    case 'SAVE_START':    return { ...state, status: 'saving',     error: null }
    case 'SAVE_SUCCESS':  return { ...state, status: 'ready',      isDirty: false }
    case 'SAVE_ERROR':    return { ...state, status: 'error',      error: action.message }
    case 'PUBLISH_START': return { ...state, status: 'publishing', error: null }
    case 'PUBLISH_ERROR': return { ...state, status: 'error',      error: action.message }

    case 'PUBLISH_SUCCESS': {
      if (!state.document) return state
      return { ...state, status: 'ready', isDirty: false, document: { ...state.document, publishedAt: action.publishedAt } }
    }

    case 'EXPORT_PDF_START':
      return { ...state, exportStatus: 'exporting', error: null }

    case 'EXPORT_PDF_SUCCESS':
      return { ...state, exportStatus: 'success', error: null }

    case 'EXPORT_PDF_ERROR':
      return { ...state, exportStatus: 'error', error: action.message }
  }
}

// ─── Normalization ────────────────────────────────────────────────────────────
//
// Documentos persistidos antes de v2 (o publicados con un esquema previo) pueden
// no traer `dataLayers` / `canvaTemplate`. Garantizamos los campos requeridos de
// v2 al cargar para que el editor nunca falle leyendo `dataLayers.length`.

function normalizeDocument(document: EditorDocument): EditorDocument {
  const raw = document as Partial<EditorDocument>
  return {
    ...document,
    canvaTemplate: raw.canvaTemplate ?? null,
    dataLayers: Array.isArray(raw.dataLayers) ? raw.dataLayers : [],
  }
}

// ─── History helper ───────────────────────────────────────────────────────────

function commitDocument(state: EditorState, next: EditorDocument): EditorState {
  const history = [state.document, ...state.history]
    .filter((d): d is EditorDocument => d !== null)
    .slice(0, LIMITS.editor.maxSnapshots)

  return {
    ...state,
    status: 'ready',
    document: { ...next, updatedAt: new Date().toISOString() },
    history,
    future: [],
    isDirty: true,
    error: null,
  }
}
