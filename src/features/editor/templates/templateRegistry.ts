import type { TemplateId } from '@core/domain/entities/Tenant'
import type { CanvaTemplateRef, DataLayer, DataLayerBinding, DataLayerTextStyle } from '../types/blocks.types'
import type { EditorTheme } from '../types/editor.types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type TemplateCategory = 'luxury' | 'rustico' | 'minimal' | 'moderno' | 'latam'

export interface TemplateDefinition {
  readonly id:             TemplateId
  readonly name:           string
  readonly description:    string
  readonly category:       TemplateCategory
  readonly thumbnailUrl:   string        // Cloudinary w_300,h_450,c_fill,f_auto,q_auto transform
  readonly canvaTemplate:  CanvaTemplateRef
  readonly defaultLayers:  readonly DataLayer[]
  readonly suggestedTheme: EditorTheme
}

// ─── CDN ──────────────────────────────────────────────────────────────────────
// Replace CLOUD_NAME with the real Cloudinary account slug when assets are ready.

const CLOUD_NAME  = 'menu-saas-latam'
const CDN_ROOT    = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`
const ASSET_PATH  = 'menu-saas/templates'

function bgUrl(slug: string):    string { return `${CDN_ROOT}/${ASSET_PATH}/${slug}-bg.jpg` }
function thumbUrl(slug: string): string { return `${CDN_ROOT}/w_300,h_450,c_fill,f_auto,q_auto/${ASSET_PATH}/${slug}-bg.jpg` }

// ─── Layer factory ────────────────────────────────────────────────────────────

type XYWH = readonly [number, number, number, number]

function L(
  id:      string,
  label:   string,
  [x, y, w, h]: XYWH,
  z:       number,
  binding: DataLayerBinding,
  style:   Partial<DataLayerTextStyle> = {},
): DataLayer {
  return {
    id,
    label,
    visible:  true,
    position: { x, y, width: w, height: h, zIndex: z, rotation: 0 },
    binding,
    textStyle: {
      fontFamily:      style.fontFamily      ?? null,
      fontSize:        style.fontSize        ?? null,
      fontWeight:      style.fontWeight      ?? 700,
      color:           style.color           ?? '#ffffff',
      align:           style.align           ?? 'center',
      lineHeight:      style.lineHeight      ?? 1.3,
      backgroundColor: style.backgroundColor ?? null,
      paddingX:        style.paddingX        ?? 0,
      paddingY:        style.paddingY        ?? 0,
    },
    opacity:      1,
    borderRadius: 0,
  }
}

function LImg(
  id:      string,
  label:   string,
  [x, y, w, h]: XYWH,
  z:       number,
  binding: DataLayerBinding,
): DataLayer {
  return {
    id,
    label,
    visible:      true,
    position:     { x, y, width: w, height: h, zIndex: z, rotation: 0 },
    binding,
    textStyle:    null,
    opacity:      1,
    borderRadius: 12,
  }
}

// ─── CanvaTemplateRef factory ─────────────────────────────────────────────────
// A4 portrait at 150 dpi (1240 × 1754 px) — update widthPx/heightPx per design
// once real Canva exports are uploaded.

function canvaRef(slug: string): CanvaTemplateRef {
  return {
    canvaDesignId: `PLACEHOLDER_${slug.toUpperCase().replace(/-/g, '_')}`,
    exportUrl:     bgUrl(slug),
    exportedAt:    '2025-01-01T00:00:00.000Z',
    widthPx:       1240,
    heightPx:      1754,
  }
}

// ─── Placeholder category IDs ─────────────────────────────────────────────────
// These are replaced with real Firestore category IDs once the tenant's catalog
// is populated. DataLayerRenderer renders nothing silently if a category is not
// found — safe by design.

const CAT1 = '__cat_main__'
const CAT2 = '__cat_secondary__'

// ─── Registry ─────────────────────────────────────────────────────────────────

export const TEMPLATE_REGISTRY = {

  // ── 1. Soda Tica ─────────────────────────────────────────────────────────────
  'soda-tica': {
    id:          'soda-tica',
    name:        'Soda Tica',
    description: 'Colores tropicales, tipografía casual. Ideal para sodas y fondas costarricenses.',
    category:    'latam',
    thumbnailUrl: thumbUrl('soda-tica'),
    canvaTemplate: canvaRef('soda-tica'),
    suggestedTheme: {
      primaryColor:     '#f97316',
      backgroundColor:  '#fef9c3',
      fontFamily:       'Nunito',
      textScale:        '1',
      imgRadius:        '12',
    },
    defaultLayers: [
      LImg('st-logo',   'Logo',            [5,  2,  20, 12], 5, { type: 'tenant-field', field: 'logoUrl' }),
      L(   'st-name',   'Nombre del local', [30, 3,  65, 8 ], 4, { type: 'tenant-field', field: 'name'    }, { fontWeight: 800, align: 'left' }),
      L(   'st-tag',    'Tagline',          [30, 12, 65, 5 ], 3, { type: 'tenant-field', field: 'tagline' }, { fontWeight: 400, align: 'left' }),
      L(   'st-cat1',   'Categoría 1',      [5,  22, 85, 5 ], 4, { type: 'category-name', categoryId: CAT1 }, { fontWeight: 800 }),
      L(   'st-list1',  'Platillos 1',      [5,  28, 85, 28], 3, { type: 'dish-list', categoryId: CAT1, layout: 'list', maxItems: 6 }, { fontWeight: 400, align: 'left' }),
      L(   'st-cat2',   'Categoría 2',      [5,  58, 85, 5 ], 4, { type: 'category-name', categoryId: CAT2 }, { fontWeight: 800 }),
      L(   'st-list2',  'Platillos 2',      [5,  64, 85, 18], 3, { type: 'dish-list', categoryId: CAT2, layout: 'list', maxItems: 4 }, { fontWeight: 400, align: 'left' }),
      L(   'st-phone',  'Teléfono',         [5,  87, 45, 4 ], 2, { type: 'tenant-field', field: 'phone'   }, { fontWeight: 400, align: 'left' }),
      L(   'st-addr',   'Dirección',        [5,  92, 85, 4 ], 2, { type: 'tenant-field', field: 'address' }, { fontWeight: 400, align: 'left' }),
    ],
  } satisfies TemplateDefinition,

  // ── 2. Carta Negra ───────────────────────────────────────────────────────────
  'carta-negra': {
    id:          'carta-negra',
    name:        'Carta Negra',
    description: 'Fondo negro, acentos dorados, tipografía serif. Para restaurantes de alta gama.',
    category:    'luxury',
    thumbnailUrl: thumbUrl('carta-negra'),
    canvaTemplate: canvaRef('carta-negra'),
    suggestedTheme: {
      primaryColor:     '#d4a017',
      backgroundColor:  '#0a0a0a',
      fontFamily:       'Playfair Display',
      textScale:        '1',
      imgRadius:        '4',
    },
    defaultLayers: [
      L(   'cn-name',  'Nombre del local',  [15, 5,  70, 8 ], 5, { type: 'tenant-field', field: 'name'    }, { fontWeight: 800, color: '#d4a017' }),
      L(   'cn-tag',   'Tagline',           [15, 14, 70, 4 ], 4, { type: 'tenant-field', field: 'tagline' }, { fontWeight: 400, color: '#c0a060' }),
      L(   'cn-cat1',  'Categoría 1',       [8,  22, 40, 5 ], 4, { type: 'category-name', categoryId: CAT1 }, { fontWeight: 700, color: '#d4a017', align: 'left' }),
      L(   'cn-list1', 'Platillos 1',       [8,  28, 40, 30], 3, { type: 'dish-list', categoryId: CAT1, layout: 'list', maxItems: 7 }, { fontWeight: 400, color: '#e0e0e0', align: 'left' }),
      L(   'cn-cat2',  'Categoría 2',       [52, 22, 40, 5 ], 4, { type: 'category-name', categoryId: CAT2 }, { fontWeight: 700, color: '#d4a017', align: 'left' }),
      L(   'cn-list2', 'Platillos 2',       [52, 28, 40, 30], 3, { type: 'dish-list', categoryId: CAT2, layout: 'list', maxItems: 7 }, { fontWeight: 400, color: '#e0e0e0', align: 'left' }),
      L(   'cn-phone', 'Teléfono',          [15, 88, 70, 4 ], 2, { type: 'tenant-field', field: 'phone'   }, { fontWeight: 400, color: '#c0a060' }),
      L(   'cn-addr',  'Dirección',         [15, 93, 70, 4 ], 2, { type: 'tenant-field', field: 'address' }, { fontWeight: 400, color: '#c0a060' }),
    ],
  } satisfies TemplateDefinition,

  // ── 3. Marisquería del Pacífico ──────────────────────────────────────────────
  'marisqueria': {
    id:          'marisqueria',
    name:        'Marisquería del Pacífico',
    description: 'Azul cobalto, blanco náutico. Para cevicherías y restaurantes de mariscos.',
    category:    'rustico',
    thumbnailUrl: thumbUrl('marisqueria'),
    canvaTemplate: canvaRef('marisqueria'),
    suggestedTheme: {
      primaryColor:     '#0ea5e9',
      backgroundColor:  '#0f172a',
      fontFamily:       'DM Sans',
      textScale:        '1',
      imgRadius:        '8',
    },
    defaultLayers: [
      LImg('mq-logo',  'Logo',             [38, 3,  24, 10], 5, { type: 'tenant-field', field: 'logoUrl' }),
      L(   'mq-name',  'Nombre del local', [15, 14, 70, 7 ], 4, { type: 'tenant-field', field: 'name'    }, { fontWeight: 800, color: '#7dd3fc' }),
      L(   'mq-tag',   'Tagline',          [15, 22, 70, 4 ], 3, { type: 'tenant-field', field: 'tagline' }, { fontWeight: 400, color: '#bae6fd' }),
      L(   'mq-cat1',  'Categoría 1',      [8,  30, 85, 5 ], 4, { type: 'category-name', categoryId: CAT1 }, { fontWeight: 700, color: '#7dd3fc' }),
      L(   'mq-list1', 'Platillos 1',      [8,  36, 85, 24], 3, { type: 'dish-list', categoryId: CAT1, layout: 'grid', maxItems: 6 }, { fontWeight: 400, color: '#f1f5f9', align: 'left' }),
      L(   'mq-cat2',  'Categoría 2',      [8,  62, 85, 5 ], 4, { type: 'category-name', categoryId: CAT2 }, { fontWeight: 700, color: '#7dd3fc' }),
      L(   'mq-list2', 'Platillos 2',      [8,  68, 85, 16], 3, { type: 'dish-list', categoryId: CAT2, layout: 'list', maxItems: 4 }, { fontWeight: 400, color: '#f1f5f9', align: 'left' }),
      L(   'mq-phone', 'Teléfono',         [15, 88, 70, 4 ], 2, { type: 'tenant-field', field: 'phone'   }, { fontWeight: 400, color: '#7dd3fc' }),
      L(   'mq-addr',  'Dirección',        [15, 93, 70, 4 ], 2, { type: 'tenant-field', field: 'address' }, { fontWeight: 400, color: '#94a3b8' }),
    ],
  } satisfies TemplateDefinition,

  // ── 4. La Parrilla (Steakhouse) ──────────────────────────────────────────────
  'steakhouse': {
    id:          'steakhouse',
    name:        'La Parrilla',
    description: 'Madera oscura, rojo carne, serif contundente. Para asadores y steakhouses.',
    category:    'rustico',
    thumbnailUrl: thumbUrl('steakhouse'),
    canvaTemplate: canvaRef('steakhouse'),
    suggestedTheme: {
      primaryColor:     '#dc2626',
      backgroundColor:  '#1c0a00',
      fontFamily:       'Playfair Display',
      textScale:        '1',
      imgRadius:        '4',
    },
    defaultLayers: [
      L(   'sk-name',  'Nombre del local', [10, 4,  80, 9 ], 5, { type: 'tenant-field', field: 'name'    }, { fontWeight: 800, color: '#fbbf24' }),
      L(   'sk-tag',   'Tagline',          [10, 14, 80, 4 ], 4, { type: 'tenant-field', field: 'tagline' }, { fontWeight: 400, color: '#fcd34d' }),
      L(   'sk-cat1',  'Categoría 1',      [5,  21, 42, 5 ], 4, { type: 'category-name', categoryId: CAT1 }, { fontWeight: 700, color: '#dc2626', align: 'left' }),
      L(   'sk-list1', 'Platillos 1',      [5,  27, 42, 35], 3, { type: 'dish-list', categoryId: CAT1, layout: 'list', maxItems: 8 }, { fontWeight: 400, color: '#fef2f2', align: 'left' }),
      L(   'sk-cat2',  'Categoría 2',      [53, 21, 42, 5 ], 4, { type: 'category-name', categoryId: CAT2 }, { fontWeight: 700, color: '#dc2626', align: 'left' }),
      L(   'sk-list2', 'Platillos 2',      [53, 27, 42, 35], 3, { type: 'dish-list', categoryId: CAT2, layout: 'list', maxItems: 8 }, { fontWeight: 400, color: '#fef2f2', align: 'left' }),
      L(   'sk-phone', 'Teléfono',         [10, 88, 80, 4 ], 2, { type: 'tenant-field', field: 'phone'   }, { fontWeight: 400, color: '#fcd34d' }),
      L(   'sk-addr',  'Dirección',        [10, 93, 80, 4 ], 2, { type: 'tenant-field', field: 'address' }, { fontWeight: 400, color: '#fca5a5' }),
    ],
  } satisfies TemplateDefinition,

  // ── 5. Taquería Viva ─────────────────────────────────────────────────────────
  'taqueria-viva': {
    id:          'taqueria-viva',
    name:        'Taquería Viva',
    description: 'Rojo, verde y blanco con energía de street food. Para taquerías y comida mexicana.',
    category:    'latam',
    thumbnailUrl: thumbUrl('taqueria-viva'),
    canvaTemplate: canvaRef('taqueria-viva'),
    suggestedTheme: {
      primaryColor:     '#16a34a',
      backgroundColor:  '#7f1d1d',
      fontFamily:       'Outfit',
      textScale:        '1',
      imgRadius:        '8',
    },
    defaultLayers: [
      LImg('tv-logo',  'Logo',             [5,  2,  18, 14], 5, { type: 'tenant-field', field: 'logoUrl' }),
      L(   'tv-name',  'Nombre del local', [28, 3,  67, 8 ], 4, { type: 'tenant-field', field: 'name'    }, { fontWeight: 800, color: '#ffffff', align: 'left' }),
      L(   'tv-tag',   'Tagline',          [28, 12, 67, 4 ], 3, { type: 'tenant-field', field: 'tagline' }, { fontWeight: 400, color: '#bbf7d0', align: 'left' }),
      L(   'tv-cat1',  'Categoría 1',      [5,  20, 85, 5 ], 4, { type: 'category-name', categoryId: CAT1 }, { fontWeight: 800, color: '#4ade80' }),
      L(   'tv-list1', 'Platillos 1',      [5,  26, 85, 26], 3, { type: 'dish-list', categoryId: CAT1, layout: 'grid', maxItems: 6 }, { fontWeight: 400, color: '#fef9c3', align: 'left' }),
      L(   'tv-cat2',  'Categoría 2',      [5,  54, 85, 5 ], 4, { type: 'category-name', categoryId: CAT2 }, { fontWeight: 800, color: '#4ade80' }),
      L(   'tv-list2', 'Platillos 2',      [5,  60, 85, 22], 3, { type: 'dish-list', categoryId: CAT2, layout: 'grid', maxItems: 4 }, { fontWeight: 400, color: '#fef9c3', align: 'left' }),
      L(   'tv-phone', 'Teléfono',         [5,  87, 45, 4 ], 2, { type: 'tenant-field', field: 'phone'   }, { fontWeight: 400, color: '#bbf7d0', align: 'left' }),
      L(   'tv-addr',  'Dirección',        [5,  92, 85, 4 ], 2, { type: 'tenant-field', field: 'address' }, { fontWeight: 400, color: '#fef9c3', align: 'left' }),
    ],
  } satisfies TemplateDefinition,

  // ── 6. Café Artesanal ────────────────────────────────────────────────────────
  'artisan-coffee': {
    id:          'artisan-coffee',
    name:        'Café Artesanal',
    description: 'Beige kraft, tipografía serif suave. Para cafeterías de especialidad.',
    category:    'minimal',
    thumbnailUrl: thumbUrl('artisan-coffee'),
    canvaTemplate: canvaRef('artisan-coffee'),
    suggestedTheme: {
      primaryColor:     '#92400e',
      backgroundColor:  '#fef3c7',
      fontFamily:       'Playfair Display',
      textScale:        '1',
      imgRadius:        '8',
    },
    defaultLayers: [
      LImg('ac-logo',  'Logo',             [38, 4,  24, 10], 5, { type: 'tenant-field', field: 'logoUrl' }),
      L(   'ac-name',  'Nombre del local', [20, 15, 60, 7 ], 4, { type: 'tenant-field', field: 'name'    }, { fontWeight: 800, color: '#451a03' }),
      L(   'ac-tag',   'Tagline',          [20, 23, 60, 4 ], 3, { type: 'tenant-field', field: 'tagline' }, { fontWeight: 400, color: '#78350f' }),
      L(   'ac-cat1',  'Categoría 1',      [15, 31, 70, 5 ], 4, { type: 'category-name', categoryId: CAT1 }, { fontWeight: 700, color: '#92400e' }),
      L(   'ac-list1', 'Platillos 1',      [15, 37, 70, 22], 3, { type: 'dish-list', categoryId: CAT1, layout: 'list', maxItems: 5 }, { fontWeight: 400, color: '#1c1917', align: 'left' }),
      L(   'ac-cat2',  'Categoría 2',      [15, 61, 70, 5 ], 4, { type: 'category-name', categoryId: CAT2 }, { fontWeight: 700, color: '#92400e' }),
      L(   'ac-list2', 'Platillos 2',      [15, 67, 70, 16], 3, { type: 'dish-list', categoryId: CAT2, layout: 'list', maxItems: 4 }, { fontWeight: 400, color: '#1c1917', align: 'left' }),
      L(   'ac-phone', 'Teléfono',         [20, 87, 60, 4 ], 2, { type: 'tenant-field', field: 'phone'   }, { fontWeight: 400, color: '#78350f' }),
      L(   'ac-addr',  'Dirección',        [20, 92, 60, 4 ], 2, { type: 'tenant-field', field: 'address' }, { fontWeight: 400, color: '#a16207' }),
    ],
  } satisfies TemplateDefinition,

  // ── 7. Menú Ejecutivo (Comida Corrida) ────────────────────────────────────────
  'comida-corrida': {
    id:          'comida-corrida',
    name:        'Menú Ejecutivo',
    description: 'Blanco limpio, azul institucional, grid ordenado. Para almuerzos corporativos.',
    category:    'moderno',
    thumbnailUrl: thumbUrl('comida-corrida'),
    canvaTemplate: canvaRef('comida-corrida'),
    suggestedTheme: {
      primaryColor:     '#1d4ed8',
      backgroundColor:  '#f8fafc',
      fontFamily:       'Inter',
      textScale:        '1',
      imgRadius:        '6',
    },
    defaultLayers: [
      LImg('me-logo',  'Logo',             [4,  3,  16, 10], 5, { type: 'tenant-field', field: 'logoUrl' }),
      L(   'me-name',  'Nombre del local', [24, 4,  72, 7 ], 4, { type: 'tenant-field', field: 'name'    }, { fontWeight: 700, color: '#1e3a8a', align: 'left' }),
      L(   'me-tag',   'Tagline',          [24, 12, 72, 4 ], 3, { type: 'tenant-field', field: 'tagline' }, { fontWeight: 400, color: '#3b82f6', align: 'left' }),
      L(   'me-cat1',  'Categoría 1',      [5,  20, 40, 5 ], 4, { type: 'category-name', categoryId: CAT1 }, { fontWeight: 700, color: '#1d4ed8', align: 'left' }),
      L(   'me-list1', 'Platillos 1',      [5,  26, 40, 32], 3, { type: 'dish-list', categoryId: CAT1, layout: 'list', maxItems: 7 }, { fontWeight: 400, color: '#1e293b', align: 'left' }),
      L(   'me-cat2',  'Categoría 2',      [55, 20, 40, 5 ], 4, { type: 'category-name', categoryId: CAT2 }, { fontWeight: 700, color: '#1d4ed8', align: 'left' }),
      L(   'me-list2', 'Platillos 2',      [55, 26, 40, 32], 3, { type: 'dish-list', categoryId: CAT2, layout: 'list', maxItems: 7 }, { fontWeight: 400, color: '#1e293b', align: 'left' }),
      L(   'me-phone', 'Teléfono',         [5,  88, 45, 4 ], 2, { type: 'tenant-field', field: 'phone'   }, { fontWeight: 400, color: '#3b82f6', align: 'left' }),
      L(   'me-addr',  'Dirección',        [5,  93, 85, 4 ], 2, { type: 'tenant-field', field: 'address' }, { fontWeight: 400, color: '#64748b', align: 'left' }),
    ],
  } satisfies TemplateDefinition,

  // ── 8. Pizzería Rústica ──────────────────────────────────────────────────────
  'pizza-rustica': {
    id:          'pizza-rustica',
    name:        'Pizzería Rústica',
    description: 'Verde oliva, terracota y pizarrón oscuro. Para pizzerías y cocina italiana.',
    category:    'rustico',
    thumbnailUrl: thumbUrl('pizza-rustica'),
    canvaTemplate: canvaRef('pizza-rustica'),
    suggestedTheme: {
      primaryColor:     '#c2410c',
      backgroundColor:  '#1c1917',
      fontFamily:       'Outfit',
      textScale:        '1',
      imgRadius:        '8',
    },
    defaultLayers: [
      LImg('pr-logo',  'Logo',             [5,  2,  18, 13], 5, { type: 'tenant-field', field: 'logoUrl' }),
      L(   'pr-name',  'Nombre del local', [28, 3,  67, 8 ], 4, { type: 'tenant-field', field: 'name'    }, { fontWeight: 800, color: '#fef2f2', align: 'left' }),
      L(   'pr-tag',   'Tagline',          [28, 12, 67, 4 ], 3, { type: 'tenant-field', field: 'tagline' }, { fontWeight: 400, color: '#fca5a5', align: 'left' }),
      L(   'pr-cat1',  'Categoría 1',      [5,  20, 85, 5 ], 4, { type: 'category-name', categoryId: CAT1 }, { fontWeight: 700, color: '#fb923c' }),
      L(   'pr-list1', 'Platillos 1',      [5,  26, 85, 25], 3, { type: 'dish-list', categoryId: CAT1, layout: 'grid', maxItems: 6 }, { fontWeight: 400, color: '#e7e5e4', align: 'left' }),
      L(   'pr-cat2',  'Categoría 2',      [5,  53, 85, 5 ], 4, { type: 'category-name', categoryId: CAT2 }, { fontWeight: 700, color: '#fb923c' }),
      L(   'pr-list2', 'Platillos 2',      [5,  59, 85, 22], 3, { type: 'dish-list', categoryId: CAT2, layout: 'grid', maxItems: 4 }, { fontWeight: 400, color: '#e7e5e4', align: 'left' }),
      L(   'pr-phone', 'Teléfono',         [5,  87, 45, 4 ], 2, { type: 'tenant-field', field: 'phone'   }, { fontWeight: 400, color: '#fca5a5', align: 'left' }),
      L(   'pr-addr',  'Dirección',        [5,  92, 85, 4 ], 2, { type: 'tenant-field', field: 'address' }, { fontWeight: 400, color: '#d6d3d1', align: 'left' }),
    ],
  } satisfies TemplateDefinition,

  // ── 9. Jardín Verde (Vegan Garden) ───────────────────────────────────────────
  'vegan-garden': {
    id:          'vegan-garden',
    name:        'Jardín Verde',
    description: 'Verde fresco sobre blanco limpio. Para restaurantes veganos, orgánicos y saludables.',
    category:    'minimal',
    thumbnailUrl: thumbUrl('vegan-garden'),
    canvaTemplate: canvaRef('vegan-garden'),
    suggestedTheme: {
      primaryColor:     '#16a34a',
      backgroundColor:  '#f0fdf4',
      fontFamily:       'DM Sans',
      textScale:        '1',
      imgRadius:        '12',
    },
    defaultLayers: [
      LImg('vg-logo',  'Logo',             [38, 3,  24, 10], 5, { type: 'tenant-field', field: 'logoUrl' }),
      L(   'vg-name',  'Nombre del local', [20, 14, 60, 7 ], 4, { type: 'tenant-field', field: 'name'    }, { fontWeight: 700, color: '#14532d' }),
      L(   'vg-tag',   'Tagline',          [20, 22, 60, 4 ], 3, { type: 'tenant-field', field: 'tagline' }, { fontWeight: 400, color: '#166534' }),
      L(   'vg-cat1',  'Categoría 1',      [15, 30, 70, 5 ], 4, { type: 'category-name', categoryId: CAT1 }, { fontWeight: 700, color: '#15803d' }),
      L(   'vg-list1', 'Platillos 1',      [15, 36, 70, 22], 3, { type: 'dish-list', categoryId: CAT1, layout: 'list', maxItems: 5 }, { fontWeight: 400, color: '#1a2e05', align: 'left' }),
      L(   'vg-cat2',  'Categoría 2',      [15, 60, 70, 5 ], 4, { type: 'category-name', categoryId: CAT2 }, { fontWeight: 700, color: '#15803d' }),
      L(   'vg-list2', 'Platillos 2',      [15, 66, 70, 16], 3, { type: 'dish-list', categoryId: CAT2, layout: 'list', maxItems: 4 }, { fontWeight: 400, color: '#1a2e05', align: 'left' }),
      L(   'vg-phone', 'Teléfono',         [20, 87, 60, 4 ], 2, { type: 'tenant-field', field: 'phone'   }, { fontWeight: 400, color: '#15803d' }),
      L(   'vg-addr',  'Dirección',        [20, 92, 60, 4 ], 2, { type: 'tenant-field', field: 'address' }, { fontWeight: 400, color: '#4ade80' }),
    ],
  } satisfies TemplateDefinition,

  // ── 10. Cantina Oscura (Dark Modern) ─────────────────────────────────────────
  'dark-modern': {
    id:          'dark-modern',
    name:        'Cantina Oscura',
    description: 'Negro profundo con acentos ámbar. Para bares, cantinas y coctelería de autor.',
    category:    'luxury',
    thumbnailUrl: thumbUrl('dark-modern'),
    canvaTemplate: canvaRef('dark-modern'),
    suggestedTheme: {
      primaryColor:     '#d97706',
      backgroundColor:  '#0c0a09',
      fontFamily:       'Inter',
      textScale:        '1',
      imgRadius:        '6',
    },
    defaultLayers: [
      LImg('dm-logo',  'Logo',             [38, 3,  24, 10], 5, { type: 'tenant-field', field: 'logoUrl' }),
      L(   'dm-name',  'Nombre del local', [15, 14, 70, 8 ], 4, { type: 'tenant-field', field: 'name'    }, { fontWeight: 800, color: '#fbbf24' }),
      L(   'dm-tag',   'Tagline',          [15, 23, 70, 4 ], 3, { type: 'tenant-field', field: 'tagline' }, { fontWeight: 400, color: '#d97706' }),
      L(   'dm-cat1',  'Categoría 1',      [8,  31, 85, 5 ], 4, { type: 'category-name', categoryId: CAT1 }, { fontWeight: 700, color: '#fbbf24' }),
      L(   'dm-list1', 'Platillos 1',      [8,  37, 85, 24], 3, { type: 'dish-list', categoryId: CAT1, layout: 'list', maxItems: 6 }, { fontWeight: 400, color: '#e7e5e4', align: 'left' }),
      L(   'dm-cat2',  'Categoría 2',      [8,  63, 85, 5 ], 4, { type: 'category-name', categoryId: CAT2 }, { fontWeight: 700, color: '#fbbf24' }),
      L(   'dm-list2', 'Platillos 2',      [8,  69, 85, 14], 3, { type: 'dish-list', categoryId: CAT2, layout: 'list', maxItems: 3 }, { fontWeight: 400, color: '#e7e5e4', align: 'left' }),
      L(   'dm-phone', 'Teléfono',         [15, 87, 70, 4 ], 2, { type: 'tenant-field', field: 'phone'   }, { fontWeight: 400, color: '#d97706' }),
      L(   'dm-addr',  'Dirección',        [15, 92, 70, 4 ], 2, { type: 'tenant-field', field: 'address' }, { fontWeight: 400, color: '#78716c' }),
    ],
  } satisfies TemplateDefinition,

} satisfies Partial<Record<TemplateId, TemplateDefinition>>

// ─── Derived exports ──────────────────────────────────────────────────────────

export const TEMPLATE_LIST: readonly TemplateDefinition[] = Object.values(TEMPLATE_REGISTRY)
