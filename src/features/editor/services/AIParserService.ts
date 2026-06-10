import type { DataLayer, DataLayerBinding, DataLayerTextStyle, CanvaTemplateRef } from '@features/editor/types/blocks.types'
import type { EditorDocument, EditorTheme } from '@features/editor/types/editor.types'
import type { TemplateId } from '@core/domain/entities/Tenant'
import { defaultTextStyle } from '@features/editor/types/blocks.types'

// ─── Gemini raw payload ───────────────────────────────────────────────────────
//
// This is the structure Gemini returns after analyzing a menu image or PDF.
// Coordinates are in pixels relative to the original image dimensions.
// The Cloud Function (analyzeMenuImage.ts) is responsible for producing this shape.

export interface GeminiPixelBounds {
  readonly xPx: number
  readonly yPx: number
  readonly widthPx: number
  readonly heightPx: number
}

export interface GeminiExtractedDish {
  readonly id: string
  readonly name: string
  readonly price: string | null        // raw string, e.g. "₡2.500"
  readonly numericPrice: number | null  // parsed integer/float for analytics (ticket promedio, etc.)
  readonly description: string | null
  readonly categoryId: string
  readonly bounds: GeminiPixelBounds | null
  readonly tags: readonly string[]     // allergen/marketing tags: 'vegan','spicy','gluten-free','dairy','nuts','seafood'
}

export interface GeminiExtractedCategory {
  readonly id: string
  readonly name: string
  readonly bounds: GeminiPixelBounds | null
}

export interface GeminiExtractedTenantField {
  readonly field: 'name' | 'logoUrl' | 'tagline' | 'phone' | 'address'
  readonly bounds: GeminiPixelBounds | null
}

export interface GeminiMenuPayload {
  readonly sourceImageWidthPx: number
  readonly sourceImageHeightPx: number
  readonly suggestedTemplateId: TemplateId | null
  readonly detectedLocale: string | null  // e.g. "es-CR", "en-US" — for currency/format hints
  readonly categories: readonly GeminiExtractedCategory[]
  readonly dishes: readonly GeminiExtractedDish[]
  readonly tenantFields: readonly GeminiExtractedTenantField[]
}

// ─── Parser errors ────────────────────────────────────────────────────────────

export type AIParseErrorCode =
  | 'EMPTY_PAYLOAD'
  | 'INVALID_IMAGE_DIMENSIONS'
  | 'NO_CONTENT_EXTRACTED'

export class AIParseError extends Error {
  readonly code: AIParseErrorCode

  constructor(code: AIParseErrorCode, message: string) {
    super(message)
    this.code = code
    this.name = 'AIParseError'
  }
}

// ─── Parse result ─────────────────────────────────────────────────────────────

export type AIParseResult =
  | { readonly ok: true;  readonly document: EditorDocument }
  | { readonly ok: false; readonly error: AIParseError }

// ─── XSS sanitization ────────────────────────────────────────────────────────
//
// Defense in depth: even though React escapes text nodes by default, we sanitize
// all AI-extracted strings at the parse boundary before they enter the store or
// Firestore. This prevents malicious menu content (e.g. <script>…</script>) from
// surviving into stored data where it could reach a less-safe rendering context.

const HTML_ESCAPE_MAP: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
}

function sanitize(raw: string): string {
  return raw.replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch] ?? ch)
}

function sanitizeDish(dish: GeminiExtractedDish): GeminiExtractedDish {
  return {
    ...dish,
    name:        sanitize(dish.name),
    price:       dish.price        != null ? sanitize(dish.price)       : null,
    description: dish.description  != null ? sanitize(dish.description) : null,
    tags:        dish.tags.map(sanitize),
  }
}

function sanitizeCategory(cat: GeminiExtractedCategory): GeminiExtractedCategory {
  return { ...cat, name: sanitize(cat.name) }
}

// ─── Bounds coherence check ───────────────────────────────────────────────────
//
// Logs a warning when a dish's extracted pixel bounds fall outside its parent
// category's bounds. Does NOT block parsing — the geometry is used as-is.
// This helps surface AI mis-localization during development.

function warnIfBoundsIncoherent(
  dish: GeminiExtractedDish,
  categoryBoundsMap: ReadonlyMap<string, GeminiPixelBounds>,
): void {
  if (!dish.bounds) return
  const catBounds = categoryBoundsMap.get(dish.categoryId)
  if (!catBounds) return

  const d = dish.bounds
  const c = catBounds
  const outsideX = d.xPx < c.xPx || (d.xPx + d.widthPx)  > (c.xPx + c.widthPx)
  const outsideY = d.yPx < c.yPx || (d.yPx + d.heightPx) > (c.yPx + c.heightPx)

  if (outsideX || outsideY) {
    console.warn(
      `[AIParserService] Bounds incoherence: dish "${dish.name}" (id=${dish.id}) ` +
      `overflows its category bounds. Dish: ${JSON.stringify(d)}, Category: ${JSON.stringify(c)}`
    )
  }
}

// ─── Coordinate mapping ───────────────────────────────────────────────────────

function pixelsToPercent(
  bounds: GeminiPixelBounds,
  sourceWidthPx: number,
  sourceHeightPx: number,
): { x: number; y: number; width: number; height: number } {
  return {
    x:      clampPercent((bounds.xPx      / sourceWidthPx)  * 100),
    y:      clampPercent((bounds.yPx      / sourceHeightPx) * 100),
    width:  clampPercent((bounds.widthPx  / sourceWidthPx)  * 100),
    height: clampPercent((bounds.heightPx / sourceHeightPx) * 100),
  }
}

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value * 100) / 100))
}

// ─── Default position when Gemini provides no bounds ─────────────────────────

function defaultPosition(zIndex: number) {
  return { x: 5, y: 5 + zIndex * 12, width: 40, height: 10, zIndex, rotation: 0 }
}

// ─── Layer builders ───────────────────────────────────────────────────────────

function buildLayerFromBounds(
  id: string,
  label: string | null,
  binding: DataLayerBinding,
  bounds: GeminiPixelBounds | null,
  zIndex: number,
  sourceWidthPx: number,
  sourceHeightPx: number,
  textStyle: DataLayerTextStyle | null,
): DataLayer {
  const percentPos = bounds
    ? pixelsToPercent(bounds, sourceWidthPx, sourceHeightPx)
    : { x: defaultPosition(zIndex).x, y: defaultPosition(zIndex).y, width: defaultPosition(zIndex).width, height: defaultPosition(zIndex).height }

  return {
    id,
    label,
    visible: true,
    position: { ...percentPos, zIndex, rotation: 0 },
    binding,
    textStyle,
    opacity: 1,
    borderRadius: 0,
  }
}

// ─── Main parser ──────────────────────────────────────────────────────────────

export function parseGeminiPayload(
  payload: GeminiMenuPayload,
  tenantId: string,
  templateId: TemplateId,
  canvaTemplate: CanvaTemplateRef | null,
  theme: EditorTheme,
): AIParseResult {
  if (!payload) {
    return { ok: false, error: new AIParseError('EMPTY_PAYLOAD', 'Payload is null or undefined') }
  }

  if (payload.sourceImageWidthPx <= 0 || payload.sourceImageHeightPx <= 0) {
    return { ok: false, error: new AIParseError('INVALID_IMAGE_DIMENSIONS', 'Source image dimensions must be positive') }
  }

  const totalContent = payload.categories.length + payload.dishes.length + payload.tenantFields.length
  if (totalContent === 0) {
    return { ok: false, error: new AIParseError('NO_CONTENT_EXTRACTED', 'Gemini extracted no recognizable content from the image') }
  }

  const { sourceImageWidthPx: sw, sourceImageHeightPx: sh } = payload

  // Sanitize all AI-extracted strings before they enter the store
  const cleanCategories = payload.categories.map(sanitizeCategory)
  const cleanDishes     = payload.dishes.map(sanitizeDish)

  // Build category bounds map for coherence validation
  const categoryBoundsMap = new Map<string, GeminiPixelBounds>(
    cleanCategories
      .filter((c): c is GeminiExtractedCategory & { bounds: GeminiPixelBounds } => c.bounds !== null)
      .map((c) => [c.id, c.bounds])
  )
  for (const dish of cleanDishes) {
    warnIfBoundsIncoherent(dish, categoryBoundsMap)
  }

  const layers: DataLayer[] = []
  let zIndex = 0

  // Tenant fields (restaurant name, logo, phone, etc.)
  for (const field of payload.tenantFields) {
    const binding: DataLayerBinding = { type: 'tenant-field', field: field.field }
    const isImageField = field.field === 'logoUrl'
    layers.push(buildLayerFromBounds(
      `tenant-${field.field}`,
      `Tenant: ${field.field}`,
      binding,
      field.bounds,
      zIndex++,
      sw, sh,
      isImageField ? null : defaultTextStyle(),
    ))
  }

  // Category headers
  for (const category of cleanCategories) {
    const binding: DataLayerBinding = { type: 'category-name', categoryId: category.id }
    layers.push(buildLayerFromBounds(
      `cat-${category.id}`,
      `Categoría: ${category.name}`,
      binding,
      category.bounds,
      zIndex++,
      sw, sh,
      { ...defaultTextStyle(), fontWeight: 800, fontSize: null },
    ))
  }

  // Dish name + price layers (one pair per dish)
  for (const dish of cleanDishes) {
    const nameBinding: DataLayerBinding = { type: 'dish-field', dishId: dish.id, field: 'name' }
    layers.push(buildLayerFromBounds(
      `dish-name-${dish.id}`,
      `Platillo: ${dish.name}`,
      nameBinding,
      dish.bounds,
      zIndex++,
      sw, sh,
      defaultTextStyle(),
    ))

    if (dish.price !== null) {
      const priceBinding: DataLayerBinding = { type: 'dish-field', dishId: dish.id, field: 'price' }
      // Offset price layer slightly below name if they share the same bounds
      const priceBounds: GeminiPixelBounds | null = dish.bounds
        ? { ...dish.bounds, yPx: dish.bounds.yPx + dish.bounds.heightPx }
        : null

      layers.push(buildLayerFromBounds(
        `dish-price-${dish.id}`,
        `Precio: ${dish.name}`,
        priceBinding,
        priceBounds,
        zIndex++,
        sw, sh,
        { ...defaultTextStyle(), fontWeight: 700, align: 'right' },
      ))
    }
  }

  const document: EditorDocument = {
    version: 2,
    tenantId,
    templateId: payload.suggestedTemplateId ?? templateId,
    canvaTemplate,
    theme,
    dataLayers: layers,
    updatedAt: new Date().toISOString(),
    publishedAt: null,
  }

  return { ok: true, document }
}
