import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@infrastructure/firebase/firestore'
import { firestorePaths } from '@infrastructure/firebase/paths'
import { isFirebaseConfigured } from '@infrastructure/firebase/config'
import type { QuoteFormValues, QuoteSource } from '../types/quote.types'

/**
 * Persiste un lead del flujo "Cotizar con nosotros" en la colección `quotes`.
 *
 * Las reglas de Firestore permiten `create` a cualquier visitante (sin auth) y
 * niegan lectura/edición desde el cliente — los leads se revisan vía consola o
 * un panel interno futuro (Admin SDK).
 */
export const QuoteService = {
  async submit(values: QuoteFormValues, source: QuoteSource): Promise<void> {
    if (!isFirebaseConfigured) {
      // Dev sin Firebase: no-op silencioso para no romper el flujo de demo.
      return
    }

    await addDoc(collection(db, firestorePaths.quotes()), {
      ...values,
      message: values.message ?? '',
      source,
      status: 'new',
      createdAt: serverTimestamp(),
    })
  },
}
