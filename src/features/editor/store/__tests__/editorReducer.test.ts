import { describe, it, expect } from 'vitest'
import { editorReducer } from '../editorReducer'
import { INITIAL_EDITOR_STATE } from '../../types/editor.types'
import type { EditorState } from '../../types/editor.types'

describe('editorReducer - Export PDF Lifecycle', () => {
  it('debe establecer exportStatus en exporting y limpiar errores en EXPORT_PDF_START', () => {
    const initialState: EditorState = {
      ...INITIAL_EDITOR_STATE,
      exportStatus: 'idle',
      error: 'Error anterior simulado',
    }

    const nextState = editorReducer(initialState, { type: 'EXPORT_PDF_START' })

    expect(nextState.exportStatus).toBe('exporting')
    expect(nextState.error).toBeNull()
  })

  it('debe establecer exportStatus en success en EXPORT_PDF_SUCCESS', () => {
    const initialState: EditorState = {
      ...INITIAL_EDITOR_STATE,
      exportStatus: 'exporting',
    }

    const nextState = editorReducer(initialState, { type: 'EXPORT_PDF_SUCCESS' })

    expect(nextState.exportStatus).toBe('success')
    expect(nextState.error).toBeNull()
  })

  it('debe establecer exportStatus en error y registrar el mensaje en EXPORT_PDF_ERROR', () => {
    const initialState: EditorState = {
      ...INITIAL_EDITOR_STATE,
      exportStatus: 'exporting',
      error: null,
    }

    const nextState = editorReducer(initialState, {
      type: 'EXPORT_PDF_ERROR',
      message: 'Fallo al renderizar el mapa de bits del canvas',
    })

    expect(nextState.exportStatus).toBe('error')
    expect(nextState.error).toBe('Fallo al renderizar el mapa de bits del canvas')
  })
})
