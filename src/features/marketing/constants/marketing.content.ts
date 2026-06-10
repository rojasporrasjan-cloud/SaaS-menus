import type { TenantPlan } from '@core/domain/entities/Tenant'

/**
 * Contenido del sitio de marketing (la cara pública del SaaS).
 *
 * Fuente única de verdad para los textos y datos del embudo de adquisición:
 * los 3 caminos (desde cero / plantillas / cotizar), las features destacadas
 * y los planes. Cambiar aquí actualiza landing, planes y secciones.
 */

export const ENTRY_PATH = {
  scratch: 'scratch',
  templates: 'templates',
  quote: 'quote',
} as const

export type EntryPath = (typeof ENTRY_PATH)[keyof typeof ENTRY_PATH]

export interface EntryPathContent {
  readonly id: EntryPath
  readonly icon: 'Sparkles' | 'LayoutTemplate' | 'MessageCircle'
  readonly title: string
  readonly description: string
  readonly ctaLabel: string
}

/** Los 3 caminos para crear un menú digital — el corazón de la propuesta. */
export const ENTRY_PATHS: readonly EntryPathContent[] = [
  {
    id: ENTRY_PATH.scratch,
    icon: 'Sparkles',
    title: 'Desde cero',
    description:
      'Crea tu menú con el editor visual tipo Canva. Arrastra, escribe y publica. Sin diseñador, sin código.',
    ctaLabel: 'Empezar gratis',
  },
  {
    id: ENTRY_PATH.templates,
    icon: 'LayoutTemplate',
    title: 'Con una plantilla',
    description:
      'Elige entre 26 plantillas profesionales por tipo de restaurante. Personaliza colores, logo y listo.',
    ctaLabel: 'Ver plantillas',
  },
  {
    id: ENTRY_PATH.quote,
    icon: 'MessageCircle',
    title: 'Lo hacemos por ti',
    description:
      'Cuéntanos qué necesitas y nuestro equipo arma tu menú digital completo. Tú solo lo apruebas.',
    ctaLabel: 'Cotizar con nosotros',
  },
] as const

export interface FeatureContent {
  readonly icon: 'QrCode' | 'Boxes' | 'Wand2' | 'BarChart3' | 'Smartphone' | 'Palette'
  readonly title: string
  readonly description: string
}

/** Capacidades del producto que ya existen en el panel admin. */
export const PLATFORM_FEATURES: readonly FeatureContent[] = [
  {
    icon: 'QrCode',
    title: 'Códigos QR por mesa',
    description:
      'Genera un QR por mesa. Tus clientes escanean y ven el menú al instante en su celular.',
  },
  {
    icon: 'Wand2',
    title: 'Digitaliza con IA',
    description:
      'Sube una foto de tu menú físico y la IA extrae los platos, precios y categorías por ti.',
  },
  {
    icon: 'Palette',
    title: 'Editor visual',
    description:
      'Mueve, redimensiona y edita cada elemento como en Canva. Cambios en vivo, sin saber diseño.',
  },
  {
    icon: 'Boxes',
    title: 'Realidad aumentada',
    description:
      'Tus clientes ven los platos en 3D sobre su mesa antes de pedir. Una experiencia que vende.',
  },
  {
    icon: 'BarChart3',
    title: 'Analíticas en vivo',
    description:
      'Mira qué platos se ven más, desde qué mesas y a qué horas. Decide con datos reales.',
  },
  {
    icon: 'Smartphone',
    title: 'Pensado para móvil',
    description:
      'El menú se ve perfecto en cualquier celular. Rápido, sin apps que instalar.',
  },
] as const

export interface PlanContent {
  readonly id: TenantPlan
  readonly name: string
  readonly priceMonthly: number | null // CRC; null = "a convenir"
  readonly tagline: string
  readonly highlighted: boolean
  readonly features: readonly string[]
  readonly ctaLabel: string
}

/**
 * Planes del producto. Precios en colones (CRC), editables en un solo lugar.
 * Ajusta `priceMonthly` cuando definas el pricing final.
 */
export const PLANS: readonly PlanContent[] = [
  {
    id: 'free',
    name: 'Gratis',
    priceMonthly: 0,
    tagline: 'Para empezar hoy mismo',
    highlighted: false,
    features: [
      '1 menú digital',
      'Hasta 30 platos',
      'Código QR para compartir',
      'Editor visual',
      'Plantillas básicas',
    ],
    ctaLabel: 'Crear menú gratis',
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 9900,
    tagline: 'El favorito de los restaurantes',
    highlighted: true,
    features: [
      'Menús ilimitados',
      'Platos ilimitados',
      'QR por mesa',
      'Realidad aumentada',
      'Digitalización con IA',
      'Analíticas en vivo',
      'Las 26 plantillas',
    ],
    ctaLabel: 'Empezar con Pro',
  },
  {
    id: 'enterprise',
    name: 'A la medida',
    priceMonthly: null,
    tagline: 'Varias sucursales o necesidades especiales',
    highlighted: false,
    features: [
      'Todo lo de Pro',
      'Múltiples sucursales',
      'Soporte prioritario',
      'Lo armamos por ti',
      'Capacitación al equipo',
    ],
    ctaLabel: 'Cotizar con nosotros',
  },
] as const
