import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@infrastructure/firebase/firestore'
import { firestorePaths } from '@infrastructure/firebase/paths'

export const OnboardingService = {
  /**
   * Mark onboarding as completed for the given tenant.
   * Idempotent — safe to call multiple times.
   */
  async completeOnboarding(tenantId: string): Promise<void> {
    await updateDoc(doc(db, firestorePaths.tenant(tenantId)), {
      onboardingCompletedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  },
}
