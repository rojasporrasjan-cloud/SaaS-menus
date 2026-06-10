import type { EditorDocument, EditorSnapshot } from '../types/editor.types'

// ─── Contract ─────────────────────────────────────────────────────────────────
//
// All persistence operations are tenant-scoped by design.
// No operation can read or write without an explicit tenantId.
// Implementations may target Firebase, local storage, or a mock for testing.

export interface IEditorPersistenceService {

  // ── Published document (live, visible to end users) ──────────────────────

  /** Load the currently published document for a tenant. Returns null if never published. */
  loadPublished(tenantId: string): Promise<EditorDocument | null>

  /** Replace the published document atomically. Called only on explicit "Publish" action. */
  publish(tenantId: string, document: EditorDocument): Promise<void>

  // ── Draft snapshots (private, only visible to the tenant owner) ──────────

  /** Persist a draft snapshot. Enforces max snapshot limit (LIMITS.editor.maxSnapshots). */
  saveDraft(tenantId: string, snapshot: EditorSnapshot): Promise<void>

  /** Load all draft snapshots for a tenant, ordered newest first. */
  loadDrafts(tenantId: string): Promise<readonly EditorSnapshot[]>

  /** Load the most recent draft. Returns null if no drafts exist. */
  loadLatestDraft(tenantId: string): Promise<EditorDocument | null>

  /** Delete a specific snapshot by id. */
  deleteDraft(tenantId: string, snapshotId: string): Promise<void>

  /** Delete all drafts older than the newest N snapshots. */
  pruneOldDrafts(tenantId: string, keepCount: number): Promise<void>
}

// ─── Result type for persistence operations ───────────────────────────────────

export type PersistenceResult<T = void> =
  | { ok: true;  value: T }
  | { ok: false; error: PersistenceError }

export type PersistenceErrorCode =
  | 'not-found'
  | 'permission-denied'
  | 'quota-exceeded'
  | 'network-error'
  | 'invalid-document'

export class PersistenceError extends Error {
  readonly code: PersistenceErrorCode
  override readonly cause: unknown

  constructor(code: PersistenceErrorCode, message: string, cause?: unknown) {
    super(message)
    this.name = 'PersistenceError'
    this.code = code
    this.cause = cause
  }
}
