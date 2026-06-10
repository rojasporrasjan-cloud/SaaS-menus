import * as functions from 'firebase-functions'
import { db } from '../config/firebase'
import { firestorePaths } from '../config/paths'

/**
 * Daily cron at 02:00 UTC: recomputes yesterday's summary from raw events.
 * Acts as a reconciliation pass in case any increments were missed.
 */
export const dailyAnalyticsAggregation = functions.pubsub
  .schedule('0 2 * * *')
  .timeZone('UTC')
  .onRun(async () => {
    const yesterday = new Date()
    yesterday.setUTCDate(yesterday.getUTCDate() - 1)
    const dateStr = yesterday.toISOString().split('T')[0]

    const startOfDay = new Date(`${dateStr}T00:00:00.000Z`)
    const endOfDay = new Date(`${dateStr}T23:59:59.999Z`)

    // Process all tenants
    const tenantsSnap = await db.collection('tenants').get()

    await Promise.all(
      tenantsSnap.docs.map(async (tenantDoc) => {
        const tenantId = tenantDoc.id

        const eventsSnap = await db
          .collection(firestorePaths.analyticsEvents(tenantId))
          .where('timestamp', '>=', startOfDay)
          .where('timestamp', '<=', endOfDay)
          .get()

        if (eventsSnap.empty) return

        const counts: Record<string, number> = {}
        const dishes: Record<string, Record<string, number>> = {}
        const devices: Record<string, number> = {}

        for (const doc of eventsSnap.docs) {
          const event = doc.data() as {
            type: string
            dishId?: string
            deviceType?: string
          }

          counts[event.type] = (counts[event.type] ?? 0) + 1

          if (event.dishId) {
            if (!dishes[event.dishId]) dishes[event.dishId] = {}
            dishes[event.dishId][event.type] = (dishes[event.dishId][event.type] ?? 0) + 1
          }

          if (event.deviceType) {
            devices[event.deviceType] = (devices[event.deviceType] ?? 0) + 1
          }
        }

        const summaryRef = db.doc(firestorePaths.analyticsDailySummary(tenantId, dateStr))
        await summaryRef.set(
          {
            date: dateStr,
            tenantId,
            totalEvents: eventsSnap.size,
            counts,
            dishes,
            devices,
            reconciledAt: new Date().toISOString(),
          },
          { merge: true },
        )
      }),
    )
  })
