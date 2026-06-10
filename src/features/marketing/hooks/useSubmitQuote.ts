import { useState } from 'react'
import { QuoteService } from '../services/QuoteService'
import type { QuoteFormValues, QuoteSource } from '../types/quote.types'

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string }

export function useSubmitQuote(source: QuoteSource) {
  const [state, setState] = useState<SubmitState>({ status: 'idle' })

  async function submit(values: QuoteFormValues): Promise<void> {
    setState({ status: 'submitting' })
    try {
      await QuoteService.submit(values, source)
      setState({ status: 'success' })
    } catch {
      setState({
        status: 'error',
        message: 'No se pudo enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.',
      })
    }
  }

  return { state, submit }
}
