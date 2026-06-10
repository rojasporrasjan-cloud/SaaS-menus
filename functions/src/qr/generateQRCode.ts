import * as functions from 'firebase-functions'
import * as QRCode from 'qrcode'
import { getDownloadURL } from 'firebase-admin/storage'
import { FieldValue } from 'firebase-admin/firestore'
import { db, storage } from '../config/firebase'
import { firestorePaths } from '../config/paths'

interface GenerateQRRequest {
  tenantId: string
  tableId: string
  menuUrl: string
}

interface GenerateQRResponse {
  qrCodeUrl: string
}

/**
 * HTTPS Callable: generates a QR code PNG, uploads it to Storage,
 * and updates the table document with the public URL.
 */
export const generateQRCode = functions.https.onCall(
  async (data: GenerateQRRequest, context): Promise<GenerateQRResponse> => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentication required.')
    }

    const { tenantId, tableId, menuUrl } = data

    if (!tenantId || !tableId || !menuUrl) {
      throw new functions.https.HttpsError('invalid-argument', 'tenantId, tableId, and menuUrl are required.')
    }

    // Verify the caller belongs to this tenant
    const tenantDoc = await db.doc(firestorePaths.tenant(tenantId)).get()
    if (!tenantDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Tenant not found.')
    }

    const tenantData = tenantDoc.data() as { ownerId?: string }
    if (tenantData.ownerId !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'Only the tenant owner can generate QR codes.')
    }

    // Generate QR code as PNG buffer
    const pngBuffer = await QRCode.toBuffer(menuUrl, {
      type: 'png',
      width: 512,
      margin: 2,
      color: {
        dark: '#1a1a1a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })

    // Upload to Firebase Storage
    const storagePath = `tenants/${tenantId}/qr/${tableId}.png`
    const bucket = storage.bucket()
    const file = bucket.file(storagePath)

    await file.save(pngBuffer, {
      metadata: {
        contentType: 'image/png',
        cacheControl: 'public, max-age=3600',
        metadata: {
          tenantId,
          tableId,
          generatedAt: new Date().toISOString(),
        },
      },
    })

    await file.makePublic()
    const qrCodeUrl = await getDownloadURL(file)

    // Update the table document
    const tableRef = db.doc(firestorePaths.table(tenantId, tableId))
    await tableRef.update({
      qrCodeUrl,
      qrMenuUrl: menuUrl,
      qrGeneratedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    return { qrCodeUrl }
  },
)
