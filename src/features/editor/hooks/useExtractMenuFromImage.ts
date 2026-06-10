import { useState } from 'react'
import { httpsCallable } from 'firebase/functions'
import { functions } from '@infrastructure/firebase/functions'
import type { TemplateId } from '@core/domain/entities/Tenant'
import type { EditorTheme } from '@features/editor/types/editor.types'
import type { CanvaTemplateRef } from '@features/editor/types/blocks.types'
import type { GeminiMenuPayload } from '@features/editor/services/AIParserService'
import { parseGeminiPayload } from '@features/editor/services/AIParserService'
import {
  useEditorStore,
  selectTheme,
  selectCanvaTemplate,
} from '@features/editor/store/useEditorStore'

// ─── Request shape sent to the Cloud Function ─────────────────────────────────

interface AnalyzeMenuImageRequest {
  readonly imageBase64: string
  readonly mimeType: string
  readonly tenantId: string
}

// ─── Extraction status — discriminated union ──────────────────────────────────

export type ExtractPhase =
  | { readonly phase: 'idle' }
  | { readonly phase: 'extracting' }
  | { readonly phase: 'parsing' }
  | { readonly phase: 'done' }
  | { readonly phase: 'error'; readonly message: string; readonly code: string }

// ─── Default theme used when no document is loaded yet ───────────────────────
//
// Callers that already have a document in the store will use the store's theme.
// This covers the edge case where extraction is triggered before any template is loaded.

const FALLBACK_THEME: EditorTheme = {
  primaryColor: '#c0392b',
  backgroundColor: '#1a0a00',
  fontFamily: 'Inter, sans-serif',
  textScale: '1',
  imgRadius: '12px',
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useExtractMenuFromImage(tenantId: string, templateId: TemplateId) {
  const [status, setStatus] = useState<ExtractPhase>({ phase: 'idle' })

  const theme        = useEditorStore(selectTheme)
  const canvaTemplate: CanvaTemplateRef | null = useEditorStore(selectCanvaTemplate)
  const loadDocument = useEditorStore((s) => s.loadDocument)

  async function extract(imageBase64: string, mimeType: string): Promise<void> {
    if (!functions) {
      setStatus({ phase: 'error', message: 'Firebase Functions not configured', code: 'FUNCTIONS_UNAVAILABLE' })
      return
    }

    setStatus({ phase: 'extracting' })

    try {
      const callable = httpsCallable<AnalyzeMenuImageRequest, GeminiMenuPayload>(
        functions,
        'analyzeMenuImage',
      )

      const result = await callable({ imageBase64, mimeType, tenantId })

      setStatus({ phase: 'parsing' })

      const effectiveTheme: EditorTheme = theme ?? FALLBACK_THEME
      const parseResult = parseGeminiPayload(
        result.data,
        tenantId,
        templateId,
        canvaTemplate,
        effectiveTheme,
      )

      if (!parseResult.ok) {
        setStatus({ phase: 'error', message: parseResult.error.message, code: parseResult.error.code })
        return
      }

      loadDocument(parseResult.document)
      setStatus({ phase: 'done' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido al analizar la imagen'
      setStatus({ phase: 'error', message, code: 'CALL_FAILED' })
    }
  }

  function reset(): void {
    setStatus({ phase: 'idle' })
  }

  return { status, extract, reset }
}
