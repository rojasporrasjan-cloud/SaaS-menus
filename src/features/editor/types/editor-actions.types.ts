import type { DataLayer, CanvaTemplateRef, DataLayerPosition, DataLayerTextStyle } from './blocks.types'
import type { EditorDocument, EditorTheme } from './editor.types'
import type { TemplateId } from '@core/domain/entities/Tenant'

// ─── Editor actions — v2 (DataLayer system) ───────────────────────────────────
//
// Every state transition goes through one of these actions.
// The reducer is the only producer of new EditorDocument — never mutate directly.
// AI output is validated against AIEditorAction before dispatch.

export type EditorAction =
  // ── Document lifecycle ──────────────────────────────────────────────────────
  | { readonly type: 'LOAD_DOCUMENT';           readonly document: EditorDocument }
  | { readonly type: 'RESET_DOCUMENT' }

  // ── Canva template ──────────────────────────────────────────────────────────
  | { readonly type: 'SET_CANVA_TEMPLATE';      readonly canvaTemplate: CanvaTemplateRef | null }

  // ── DataLayer CRUD ──────────────────────────────────────────────────────────
  | { readonly type: 'ADD_LAYER';               readonly layer: DataLayer }
  | { readonly type: 'REMOVE_LAYER';            readonly layerId: string }
  | { readonly type: 'UPDATE_LAYER';            readonly layerId: string; readonly patch: Partial<Omit<DataLayer, 'id'>> }
  | { readonly type: 'UPDATE_LAYER_POSITION';   readonly layerId: string; readonly patch: Partial<DataLayerPosition> }
  | { readonly type: 'UPDATE_LAYER_TEXT_STYLE'; readonly layerId: string; readonly patch: Partial<DataLayerTextStyle> }
  | { readonly type: 'REORDER_LAYERS';          readonly orderedIds: readonly string[] }
  | { readonly type: 'TOGGLE_LAYER';            readonly layerId: string }

  // ── Selection ───────────────────────────────────────────────────────────────
  | { readonly type: 'SELECT_LAYER';            readonly layerId: string | null }

  // ── Theme ───────────────────────────────────────────────────────────────────
  | { readonly type: 'SET_THEME';               readonly patch: Partial<EditorTheme> }
  | { readonly type: 'SET_TEMPLATE';            readonly templateId: TemplateId }

  // ── Template apply (Camino A — Canva-First) ──────────────────────────────────
  // Atomically replaces canvaTemplate + dataLayers + theme in one undo step.
  | {
      readonly type:           'APPLY_TEMPLATE'
      readonly templateId:     TemplateId
      readonly canvaTemplate:  CanvaTemplateRef
      readonly defaultLayers:  readonly DataLayer[]
      readonly theme:          EditorTheme
    }

  // ── History ─────────────────────────────────────────────────────────────────
  | { readonly type: 'UNDO' }
  | { readonly type: 'REDO' }

  // ── Async status ────────────────────────────────────────────────────────────
  | { readonly type: 'SAVE_START' }
  | { readonly type: 'SAVE_SUCCESS' }
  | { readonly type: 'SAVE_ERROR';              readonly message: string }
  | { readonly type: 'PUBLISH_START' }
  | { readonly type: 'PUBLISH_SUCCESS';         readonly publishedAt: string }
  | { readonly type: 'PUBLISH_ERROR';           readonly message: string }
  | { readonly type: 'EXPORT_PDF_START' }
  | { readonly type: 'EXPORT_PDF_SUCCESS' }
  | { readonly type: 'EXPORT_PDF_ERROR';         readonly message: string }

// ─── AI action contract ───────────────────────────────────────────────────────
//
// Hard boundary: AI can only produce this subset.
// Structural mutations (ADD_LAYER, REMOVE_LAYER, LOAD_DOCUMENT) are user-only.

export type AIEditorAction = Extract<EditorAction,
  | { type: 'SET_TEMPLATE' }
  | { type: 'SET_THEME' }
  | { type: 'SET_CANVA_TEMPLATE' }
  | { type: 'UPDATE_LAYER' }
  | { type: 'UPDATE_LAYER_TEXT_STYLE' }
  | { type: 'REORDER_LAYERS' }
  | { type: 'TOGGLE_LAYER' }
>

export function isAIPermittedAction(action: EditorAction): action is AIEditorAction {
  const permitted: ReadonlySet<EditorAction['type']> = new Set<EditorAction['type']>([
    'SET_TEMPLATE',
    'SET_THEME',
    'SET_CANVA_TEMPLATE',
    'UPDATE_LAYER',
    'UPDATE_LAYER_TEXT_STYLE',
    'REORDER_LAYERS',
    'TOGGLE_LAYER',
  ])
  return permitted.has(action.type)
}
