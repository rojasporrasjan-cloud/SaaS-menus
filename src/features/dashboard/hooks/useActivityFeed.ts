import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '@infrastructure/firebase/firestore'
import { firestorePaths } from '@infrastructure/firebase/paths'
import { AnalyticsEventMapper } from '@infrastructure/mappers/AnalyticsEventMapper'
import type { AnalyticsEvent } from '@core/domain/entities/AnalyticsEvent'

import { isFirebaseConfigured } from '@infrastructure/firebase/config'

interface UseActivityFeedReturn {
  events: AnalyticsEvent[]
  isLoading: boolean
  error: string | null
}

/**
 * Real-time activity feed via onSnapshot.
 * TanStack Query is intentionally not used here — live listeners
 * need imperative subscription management, not a fetch abstraction.
 */
export function useActivityFeed(
  tenantId: string | null,
  eventLimit = 20,
 ): UseActivityFeedReturn {
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tenantId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    if (!isFirebaseConfigured) {
      const mockEvents: AnalyticsEvent[] = [
        {
          id: '1',
          tenantId: tenantId,
          type: 'qr_scan',
          menuId: 'menu-principal',
          dishId: null,
          tableId: 'mesa-1',
          sessionId: 'sess-1',
          deviceType: 'mobile',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
        },
        {
          id: '2',
          tenantId: tenantId,
          type: 'menu_view',
          menuId: 'menu-principal',
          dishId: null,
          tableId: 'mesa-1',
          sessionId: 'sess-1',
          deviceType: 'mobile',
          timestamp: new Date(Date.now() - 1000 * 60 * 6),
        },
        {
          id: '3',
          tenantId: tenantId,
          type: 'dish_view',
          menuId: 'menu-principal',
          dishId: 'pizza-la-rustica',
          tableId: 'mesa-1',
          sessionId: 'sess-1',
          deviceType: 'mobile',
          timestamp: new Date(Date.now() - 1000 * 60 * 10),
        },
        {
          id: '4',
          tenantId: tenantId,
          type: 'ar_launch',
          menuId: 'menu-principal',
          dishId: 'pizza-margherita',
          tableId: 'mesa-1',
          sessionId: 'sess-2',
          deviceType: 'mobile',
          timestamp: new Date(Date.now() - 1000 * 60 * 25),
        },
      ]
      setEvents(mockEvents)
      setIsLoading(false)
      return
    }

    const q = query(
      collection(db, firestorePaths.analyticsEvents(tenantId)),
      orderBy('timestamp', 'desc'),
      limit(eventLimit),
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const mapped = snapshot.docs.map((doc) => AnalyticsEventMapper.toDomain(doc))
        setEvents(mapped)
        setIsLoading(false)
      },
      (err) => {
        console.error('[useActivityFeed] onSnapshot error:', err)
        setError('No se pudo cargar la actividad reciente.')
        setIsLoading(false)
      },
    )

    return unsubscribe
  }, [tenantId, eventLimit])

  return { events, isLoading, error }
}
