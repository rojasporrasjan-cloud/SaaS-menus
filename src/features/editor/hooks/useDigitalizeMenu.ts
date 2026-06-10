import { useState }                    from 'react'
import type { TemplateId }             from '@core/domain/entities/Tenant'
import type { EditorTheme }            from '@features/editor/types/editor.types'
import type { CanvaTemplateRef }       from '@features/editor/types/blocks.types'
import type { GeminiMenuPayload }      from '@features/editor/services/AIParserService'
import { parseGeminiPayload }          from '@features/editor/services/AIParserService'
import { useEditorStore, selectTheme } from '@features/editor/store/useEditorStore'
import { GeminiApiService }            from '@infrastructure/services/GeminiApiService'

// ─── Phase discriminated union ────────────────────────────────────────────────

export type DigitalizePhase =
  | { readonly phase: 'idle' }
  | { readonly phase: 'extracting' }
  | { readonly phase: 'preview';  readonly payload: GeminiMenuPayload }
  | { readonly phase: 'applying' }
  | { readonly phase: 'done' }
  | { readonly phase: 'error';    readonly message: string; readonly code: string }

// ─── Fallback theme ───────────────────────────────────────────────────────────

const FALLBACK_THEME: EditorTheme = {
  primaryColor:    '#c0392b',
  backgroundColor: '#1a0a00',
  fontFamily:      'Inter, sans-serif',
  textScale:       '1',
  imgRadius:       '12px',
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
//
// Two-phase workflow:
//   1. extract()  — calls Gemini REST API directly (no Cloud Function required),
//                   stores raw payload, advances to 'preview' so the caller can
//                   show extracted content and let the user pick a template.
//   2. apply()    — receives the chosen templateId + canvaTemplate, calls
//                   parseGeminiPayload, loads the document into the editor store.

export function useDigitalizeMenu(tenantId: string) {
  const [status, setStatus] = useState<DigitalizePhase>({ phase: 'idle' })

  const theme        = useEditorStore(selectTheme)
  const loadDocument = useEditorStore((s) => s.loadDocument)

  async function extract(imageBase64: string, mimeType: string): Promise<void> {
    if (!GeminiApiService.isConfigured()) {
      setStatus({
        phase:   'error',
        message: 'Falta la API key de Gemini. Añade VITE_GEMINI_API_KEY en tu archivo .env y reinicia el servidor.',
        code:    'GEMINI_KEY_MISSING',
      })
      return
    }

    setStatus({ phase: 'extracting' })

    try {
      const payload = await GeminiApiService.analyzeMenuImage(imageBase64, mimeType)
      setStatus({ phase: 'preview', payload })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido al analizar la imagen.'
      setStatus({ phase: 'error', message, code: 'CALL_FAILED' })
    }
  }

  function apply(
    templateId:    TemplateId,
    canvaTemplate: CanvaTemplateRef | null,
  ): void {
    if (status.phase !== 'preview') return

    setStatus({ phase: 'applying' })

    const effectiveTheme = theme ?? FALLBACK_THEME
    const parseResult    = parseGeminiPayload(
      status.payload,
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
  }

  function reset(): void {
    setStatus({ phase: 'idle' })
  }

  return { status, extract, apply, reset }
}
