import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  collectionGroup,
} from 'firebase/firestore'
import { db } from '@infrastructure/firebase/firestore'
import { firestorePaths } from '@infrastructure/firebase/paths'
import { DailySummaryMapper } from '@infrastructure/mappers/DailySummaryMapper'
import type { DailySummary, TopDishEntry } from '../types/analytics.types'
import type { AnalyticsEventType } from '@core/domain/entities/AnalyticsEvent'

export const AnalyticsPageService = {
  // ── Daily summaries ────────────────────────────────────────────────────────

  async getDailySummaries(tenantId: string, days: number): Promise<DailySummary[]> {
    const since = new Date()
    since.setUTCDate(since.getUTCDate() - days)
    const sinceStr = since.toISOString().split('T')[0]!

    const snap = await getDocs(
      query(
        collection(db, firestorePaths.analyticsDailySummaries(tenantId)),
        where('date', '>=', sinceStr),
        orderBy('date', 'asc'),
      ),
    )

    return snap.docs.map((doc) => DailySummaryMapper.toDomain(doc))
  },

  // ── Dish name lookup (collectionGroup across all menus) ───────────────────

  async getDishNameMap(tenantId: string): Promise<Map<string, string>> {
    const snap = await getDocs(
      query(collectionGroup(db, 'dishes'), where('tenantId', '==', tenantId)),
    )
    const map = new Map<string, string>()
    for (const doc of snap.docs) {
      map.set(doc.id, (doc.data()['name'] as string) ?? doc.id)
    }
    return map
  },

  // ── Aggregation helpers ────────────────────────────────────────────────────

  sumByType(
    summaries: DailySummary[],
    type: AnalyticsEventType,
  ): number {
    return summaries.reduce((acc, s) => acc + (s.counts[type] ?? 0), 0)
  },

  getTopDishes(
    summaries: DailySummary[],
    type: AnalyticsEventType,
    nameMap: Map<string, string>,
    limit = 10,
  ): TopDishEntry[] {
    const totals = new Map<string, number>()

    for (const summary of summaries) {
      for (const [dishId, counts] of Object.entries(summary.dishes)) {
        const count = counts[type] ?? 0
        if (count > 0) {
          totals.set(dishId, (totals.get(dishId) ?? 0) + count)
        }
      }
    }

    return [...totals.entries()]
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([dishId, count]) => ({
        dishId,
        dishName: nameMap.get(dishId) ?? dishId.slice(0, 8),
        count,
      }))
  },

  // ── Fill gaps: ensure every day in range has an entry ────────────────────

  fillDateGaps(summaries: DailySummary[], days: number): DailySummary[] {
    const filled: DailySummary[] = []
    const byDate = new Map(summaries.map((s) => [s.date, s]))

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setUTCDate(d.getUTCDate() - i)
      const dateStr = d.toISOString().split('T')[0]!
      filled.push(
        byDate.get(dateStr) ?? { date: dateStr, totalEvents: 0, counts: {}, dishes: {} },
      )
    }

    return filled
  },
}
