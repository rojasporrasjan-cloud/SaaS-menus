import type { Block, BlockType, DataLayer, CanvaTemplateRef } from './blocks.types'
import type { TemplateId } from '@core/domain/entities/Tenant'

// ─── Theme ───────────────────────────────────────────────────────────────────

export interface EditorTheme {
  readonly primaryColor: string
  readonly backgroundColor: string
  readonly fontFamily: string
  readonly textScale: string
  readonly imgRadius: string
}

// ─── EditorDocument — versioned, discriminated by schema version ──────────────
//
// v1: block-based system (legacy, migration path only)
// v2: Canva template + DataLayer overlay system (current)
//
// The discriminated union on `version` means the compiler enforces
// that v1 code never accidentally reads v2 fields and vice versa.

export interface EditorDocumentV1 {
  readonly version: 1
  readonly tenantId: string
  readonly templateId: TemplateId
  readonly theme: EditorTheme
  readonly blocks: readonly Block[]
  readonly updatedAt: string
  readonly publishedAt: string | null
}

export interface EditorDocumentV2 {
  readonly version: 2
  readonly tenantId: string             // multi-tenant: required, never optional
  readonly templateId: TemplateId       // React render template (skin / color system)
  readonly canvaTemplate: CanvaTemplateRef | null  // null = no Canva background yet
  readonly theme: EditorTheme
  readonly dataLayers: readonly DataLayer[]
  readonly updatedAt: string            // ISO 8601
  readonly publishedAt: string | null   // null = draft, never published
}

// The canonical document type — always use this in new code
export type EditorDocument = EditorDocumentV2

// Migration helper — narrows a persisted document to its version
export type AnyEditorDocument = EditorDocumentV1 | EditorDocumentV2

export function isV2Document(doc: AnyEditorDocument): doc is EditorDocumentV2 {
  return doc.version === 2
}

// ─── Snapshot (versioning) ───────────────────────────────────────────────────

export type SnapshotTrigger = 'user' | 'ai' | 'import' | 'system'

export interface EditorSnapshot {
  readonly id: string
  readonly document: EditorDocument
  readonly createdAt: string
  readonly triggeredBy: SnapshotTrigger
  readonly userId: string
  readonly label: string | null
}

// ─── Editor state ─────────────────────────────────────────────────────────────

export type ExportStatus = 'idle' | 'exporting' | 'success' | 'error'

export type EditorStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'saving'
  | 'publishing'
  | 'error'

export interface EditorState {
  readonly status: EditorStatus
  readonly exportStatus: ExportStatus
  readonly document: EditorDocument | null
  readonly history: readonly EditorDocument[]
  readonly future: readonly EditorDocument[]
  readonly isDirty: boolean
  readonly selectedLayerId: string | null   // renamed: was selectedBlockId
  readonly error: string | null
}

export const INITIAL_EDITOR_STATE: EditorState = {
  status: 'idle',
  exportStatus: 'idle',
  document: null,
  history: [],
  future: [],
  isDirty: false,
  selectedLayerId: null,
  error: null,
}

// ─── Result types ─────────────────────────────────────────────────────────────

export type LayerOperationResult =
  | { ok: true;  document: EditorDocument }
  | { ok: false; reason: 'layer-not-found' | 'invalid-order' | 'layer-required' }

// ─── Utility re-exports ───────────────────────────────────────────────────────

export type { Block, BlockType, DataLayer, CanvaTemplateRef }
