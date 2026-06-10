import * as functions from 'firebase-functions'
import { FieldValue } from 'firebase-admin/firestore'
import { db, admin } from '../config/firebase'
import { firestorePaths } from '../config/paths'

/**
 * Firestore trigger: every new analytics event increments the daily summary counters.
 * Path: tenants/{tenantId}/analyticsEvents/{eventId}
 */
export const onAnalyticsEventCreated = functions.firestore
  .document('tenants/{tenantId}/analyticsEvents/{eventId}')
  .onCreate(async (snap, context) => {
    const { tenantId } = context.params
    const event = snap.data() as {
      type: string
      dishId?: string
      deviceType?: string
      timestamp: admin.firestore.Timestamp
    }

    const date = event.timestamp.toDate().toISOString().split('T')[0] // YYYY-MM-DD
    const summaryRef = db.doc(firestorePaths.analyticsDailySummary(tenantId, date))

    const increment = FieldValue.increment(1)
    const updates: Record<string, unknown> = {
      date,
      tenantId,
      totalEvents: increment,
      updatedAt: FieldValue.serverTimestamp(),
    }

    // Granular counters by event type
    updates[`counts.${event.type}`] = increment

    // Per-dish AR/scan counters
    if (event.dishId) {
      updates[`dishes.${event.dishId}.${event.type}`] = increment
    }

    // Device type breakdown
    if (event.deviceType) {
      updates[`devices.${event.deviceType}`] = increment
    }

    await summaryRef.set(updates, { merge: true })
  })
