import * as functions from 'firebase-functions'
import { FieldValue } from 'firebase-admin/firestore'
import { db } from '../config/firebase'
import { firestorePaths } from '../config/paths'

type Plan = 'free' | 'starter' | 'pro' | 'enterprise'

interface InitializeTenantRequest {
  tenantId: string
  name: string
  slug: string
  plan?: Plan
  timezone?: string
  locale?: string
}

interface InitializeTenantResponse {
  success: boolean
  tenantId: string
}

const DEFAULTS = {
  timezone: 'America/Costa_Rica',
  locale: 'es-CR',
  primaryColor: '#16a34a',
} as const

/**
 * HTTPS Callable: bootstraps a new tenant's Firestore structure.
 *
 * Writes the canonical Tenant schema (mirrors src/core/domain/entities/Tenant.ts).
 * Creates a default menu + category so the dashboard isn't empty on first login.
 * Idempotent — safe to call multiple times; will not overwrite existing data.
 */
export const initializeTenant = functions.https.onCall(
  async (data: InitializeTenantRequest, context): Promise<InitializeTenantResponse> => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentication required.')
    }

    const {
      tenantId,
      name,
      slug,
      plan = 'free',
      timezone = DEFAULTS.timezone,
      locale = DEFAULTS.locale,
    } = data

    if (!tenantId || !name || !slug) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'tenantId, name, and slug are required.',
      )
    }

    const now = FieldValue.serverTimestamp()
    const isPaid = plan === 'pro' || plan === 'enterprise'

    // ── Tenant document ──────────────────────────────────────────────────────
    const tenantRef = db.doc(firestorePaths.tenant(tenantId))
    const tenantSnap = await tenantRef.get()

    if (!tenantSnap.exists) {
      await tenantRef.set({
        id: tenantId,
        name,
        slug,
        status: 'active',
        plan,
        ownerId: context.auth.uid,
        timezone,
        locale,
        branding: {
          primaryColor: DEFAULTS.primaryColor,
          logoUrl: null,
          coverImageUrl: null,
          fontFamily: null,
        },
        features: {
          arEnabled: isPaid,
          analyticsEnabled: true,
          multiLanguageEnabled: isPaid,
          loyaltyEnabled: plan === 'enterprise',
          qrGeneratorEnabled: true,
        },
        onboardingCompletedAt: null,
        createdAt: now,
        updatedAt: now,
      })
    }

    // ── Owner membership (REQUIRED — Firestore rules gate writes on this doc) ──
    // Without this the owner cannot save/publish; this is what previously had to
    // be added manually in the Firebase console (see PENDIENTES.md).
    const memberRef = db.doc(firestorePaths.member(tenantId, context.auth.uid))
    const memberSnap = await memberRef.get()
    if (!memberSnap.exists) {
      await memberRef.set({
        role: 'owner',
        addedAt: now,
      })
    }

    // ── User → tenant mapping (top-level, read by the client TenantProvider) ──
    // Lets an authenticated owner resolve "their" tenant without a subdomain.
    const userRef = db.doc(firestorePaths.userAccount(context.auth.uid))
    const userSnap = await userRef.get()
    if (!userSnap.exists) {
      await userRef.set({
        tenantId,
        role: 'owner',
        createdAt: now,
        updatedAt: now,
      })
    }

    // ── Default menu + category (only if none exist) ─────────────────────────
    const menusRef = db.collection(firestorePaths.menus(tenantId))
    const existingMenus = await menusRef.limit(1).get()

    if (existingMenus.empty) {
      const menuRef = menusRef.doc()
      await menuRef.set({
        id: menuRef.id,
        tenantId,
        name: 'Menú principal',
        description: '',
        status: 'active',
        sortOrder: 0,
        categoryOrder: [],
        createdAt: now,
        updatedAt: now,
      })

      const categoriesRef = db.collection(firestorePaths.categories(tenantId, menuRef.id))
      const categoryRef = categoriesRef.doc()
      await categoryRef.set({
        id: categoryRef.id,
        tenantId,
        menuId: menuRef.id,
        name: 'Platos principales',
        description: '',
        sortOrder: 0,
        createdAt: now,
        updatedAt: now,
      })

      // Wire the category into the menu's order array
      await menuRef.update({
        categoryOrder: [categoryRef.id],
        updatedAt: now,
      })
    }

    return { success: true, tenantId }
  },
)
