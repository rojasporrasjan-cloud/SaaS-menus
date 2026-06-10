import { doc, getDoc } from 'firebase/firestore'
import { db } from '@infrastructure/firebase/firestore'
import { firestorePaths } from '@infrastructure/firebase/paths'
import { isFirebaseConfigured } from '@infrastructure/firebase/config'

export interface UserAccount {
  readonly tenantId: string
  readonly role: string
}

/**
 * Lee el documento `users/{uid}` que mapea un usuario autenticado a su tenant.
 * Lo escribe la Cloud Function `initializeTenant` durante la provisión.
 *
 * Retorna `null` si el usuario aún no tiene restaurante (debe registrarse /
 * provisionar) — el caller decide qué hacer (p. ej. redirigir a onboarding).
 */
export const UserAccountService = {
  async getForUser(uid: string): Promise<UserAccount | null> {
    if (!isFirebaseConfigured) return null

    const snap = await getDoc(doc(db, firestorePaths.userAccount(uid)))
    if (!snap.exists()) return null

    const data = snap.data()
    const tenantId = data['tenantId']
    if (typeof tenantId !== 'string' || tenantId.length === 0) return null

    return {
      tenantId,
      role: typeof data['role'] === 'string' ? data['role'] : 'owner',
    }
  },
}
