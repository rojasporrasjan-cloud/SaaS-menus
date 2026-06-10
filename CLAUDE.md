# CLAUDE.md — Soda La Rustica SaaS

Estas reglas son absolutas. Se aplican a cada línea de código en este repositorio.
Si una instrucción del usuario entra en conflicto con estas reglas, señalarlo primero antes de proceder.

---

## 1. Identidad del proyecto

Multi-tenant SaaS de menús digitales para restaurantes LATAM. Stack:
- **React 19 + Vite + TypeScript** — frontend
- **Firebase** (Auth, Firestore, Storage, Functions) — backend
- **Tailwind CSS v4** — utility styles
- **Clean Architecture** — domain / use-cases / infrastructure / features / shared

---

## 2. TypeScript — Reglas absolutas

### PROHIBIDO sin excepción
```ts
// ❌ any — nunca
const x: any = foo()

// ❌ as casting — nunca para silenciar errores
const user = data as User

// ❌ ! non-null assertion — nunca
const name = user!.name

// ❌ @ts-ignore / @ts-expect-error — nunca
// @ts-ignore

// ❌ Object sin tipar
const config = {}

// ❌ Function sin tipos de retorno en dominio/servicios
function getUser() { ... }
```

### OBLIGATORIO
```ts
// ✅ Tipos explícitos en funciones de dominio y servicios
function getUser(id: string): Promise<User> { ... }

// ✅ Discriminated unions para estados
type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: DomainError }

// ✅ Readonly en entidades del dominio
interface Dish {
  readonly id: string
  readonly name: string
  readonly price: Price
}

// ✅ satisfies para constantes con tipos conocidos
const ROUTES = {
  dashboard: '/dashboard',
} satisfies Record<string, string>

// ✅ unknown en lugar de any para datos externos
function parseApiResponse(raw: unknown): User { ... }

// ✅ type imports siempre separados
import type { User } from '@core/domain/entities/User'

// ✅ Enums como const objects (no TS enums)
const DishStatus = {
  available: 'available',
  unavailable: 'unavailable',
  archived: 'archived',
} as const
type DishStatus = typeof DishStatus[keyof typeof DishStatus]
```

### Casting permitido únicamente cuando
1. Estás en un adaptador de infraestructura (Firestore → dominio) con validación previa
2. El tipo es literalmente imposible de inferir por limitaciones de la librería
3. Se documenta con un comentario `// safe: [razón específica]`

---

## 3. Arquitectura de capas — Reglas de dependencia

```
domain ← use-cases ← infrastructure
                  ↑
              features ← pages ← app
                  ↑
               shared
```

### PROHIBIDO cruzar capas hacia arriba
```ts
// ❌ Dominio importando de features
// src/core/domain/entities/Tenant.ts
import { useTenant } from '@features/tenant/hooks/useTenant'

// ❌ Use-case importando de infrastructure directamente
// src/core/use-cases/GetMenuUseCase.ts
import { firestoreDb } from '@infrastructure/firebase/client'

// ❌ shared importando de features
// src/shared/utils/cn.ts
import { TenantContext } from '@features/tenant/context'
```

### OBLIGATORIO
- Dominio: **cero** dependencias externas. Solo TypeScript primitivos e interfaces.
- Use-cases: solo dependen de interfaces de repositorios (`I*Repository`), nunca implementaciones.
- Infrastructure: implementa interfaces del dominio. Puede usar Firebase, fetch, etc.
- Features: usan use-cases vía hooks. **No** llaman a Firebase directamente.
- Shared: utilidades puras sin dependencias de negocio.

---

## 4. Estructura de archivos — Convención obligatoria

### Feature module
```
src/features/{feature-name}/
  index.ts                    ← barrel export (solo lo público)
  components/
    {ComponentName}/
      index.tsx               ← componente
      index.test.tsx          ← tests (si aplica)
  hooks/
    use{HookName}.ts
  services/
    {Name}Service.ts
  types/
    {feature}.types.ts
```

### Reglas de naming
| Artefacto | Convención | Ejemplo |
|---|---|---|
| Componente React | PascalCase | `DishCard` |
| Hook | camelCase prefijo `use` | `useDishList` |
| Service | PascalCase sufijo `Service` | `DishService` |
| Repository interface | PascalCase prefijo `I` | `IDishRepository` |
| Type/Interface | PascalCase | `DishCardProps` |
| Constante module-level | SCREAMING_SNAKE | `MAX_DISHES_PER_MENU` |
| Archivo de componente | `index.tsx` dentro de carpeta con nombre |
| Archivo de tipo | `{nombre}.types.ts` |

### PROHIBIDO
```
❌ src/features/dishes/DishCard.tsx          — componente suelto sin carpeta
❌ src/features/dishes/components/dishCard.tsx  — lowercase
❌ src/utils/helpers.ts                      — "helpers" genérico
❌ src/types.ts                              — tipos globales sueltos
```

---

## 5. Imports — Reglas absolutas

### SIEMPRE path aliases, nunca relativos largos
```ts
// ❌
import { Dish } from '../../../core/domain/entities/Dish'
import { cn } from '../../shared/utils/cn'

// ✅
import type { Dish } from '@core/domain/entities/Dish'
import { cn } from '@shared/utils/cn'
```

### Orden de imports (siempre en este orden, con línea en blanco entre grupos)
```ts
// 1. React y librerías externas
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// 2. Path aliases internos — dominio/core primero
import type { Dish } from '@core/domain/entities/Dish'
import { cn } from '@shared/utils/cn'

// 3. Imports relativos del mismo feature (máximo 1 nivel)
import { DishCard } from './DishCard'
```

### type imports
- Siempre `import type` para tipos que no tienen valor en runtime
- Nunca mezclar value imports y type imports en la misma línea

---

## 6. Componentes React — Reglas

### Estructura obligatoria de un componente
```tsx
// 1. Tipos/interfaces primero
interface DishCardProps {
  readonly dish: Dish
  readonly tenantId: string
  readonly onSelect?: (id: string) => void
}

// 2. Componente como function declaration (no arrow en exports)
export function DishCard({ dish, tenantId, onSelect }: DishCardProps) {
  // 3. Hooks al inicio, sin condicionales antes de ellos
  const [isExpanded, setIsExpanded] = useState(false)

  // 4. Derived state / computations
  const isUnavailable = dish.status === 'unavailable'

  // 5. Handlers — prefijo handle
  function handleClick() {
    onSelect?.(dish.id)
  }

  // 6. JSX
  return (...)
}
```

### PROHIBIDO en componentes
```tsx
// ❌ Lógica de negocio dentro del componente
function DishCard({ dish }: DishCardProps) {
  // ❌ no — esto es lógica de dominio
  const discountedPrice = dish.price.amount * (1 - dish.promotion?.discount ?? 0)
  const taxedPrice = discountedPrice * 1.13
}

// ❌ Fetch directo en componentes
function DishCard() {
  useEffect(() => {
    fetch('/api/dishes') // ❌
  }, [])
}

// ❌ Firebase directo en componentes
import { doc, getDoc } from 'firebase/firestore' // ❌ en features/

// ❌ Props spread sin tipar
function DishCard({ ...props }: any) // ❌

// ❌ Default exports en componentes compartidos (shared/)
export default function Button() // ❌ en shared/
```

### OBLIGATORIO
```tsx
// ✅ Named exports siempre (excepto pages y templates lazy-loaded)
export function DishCard(...) {}

// ✅ Props interface siempre Readonly cuando son objetos
interface Props {
  readonly dish: Dish
  readonly onChange: (value: string) => void  // callbacks no necesitan Readonly
}

// ✅ Componentes de página y templates: default export (para React.lazy)
export default function DishDetailPage() {}
```

---

## 7. Hooks — Reglas

```ts
// ✅ Estructura obligatoria de un hook
export function useDishList(menuId: string) {
  // estado con tipo explícito
  const [state, setState] = useState<LoadState>({ status: 'idle' })

  // efectos con cleanup cuando aplica
  useEffect(() => {
    // ...
    return () => { /* cleanup */ }
  }, [menuId])

  // retorna objeto nombrado, nunca array (salvo useState-like)
  return { state, refetch }
}
```

### PROHIBIDO en hooks
```ts
// ❌ Lógica de UI (estilos, clases) en hooks
function useDish() {
  const className = isActive ? 'text-red-500' : 'text-gray-500' // ❌
}

// ❌ Hooks dentro de condicionales
if (condition) {
  const [x] = useState() // ❌
}

// ❌ useEffect sin dependency array o con dependencias incorrectas
useEffect(() => { fetchData() }) // ❌ sin deps
```

---

## 8. Sistema de bloques del editor — Reglas del schema

Todo bloque del editor vive en `src/features/editor/blocks/`.
Un bloque es la unidad mínima composable del editor visual.

### Schema obligatorio de un bloque
```ts
// src/features/editor/blocks/{BlockType}/schema.ts

interface BlockBase<T extends string, D> {
  readonly type: T
  readonly id: string          // uuid v4
  readonly visible: boolean
  readonly order: number
  readonly data: D
}

// Ejemplo concreto
interface HeroBlock extends BlockBase<'hero', HeroBlockData> {}

interface HeroBlockData {
  readonly title: string
  readonly subtitle: string
  readonly imageUrl: string | null
  readonly ctaLabel: string | null
  readonly ctaUrl: string | null
}

// Discriminated union de todos los bloques
type Block =
  | HeroBlock
  | MenuSectionBlock
  | PromoBlock
  | ReservationBlock
  | TestimonialBlock
  | FeaturedBlock
```

### PROHIBIDO en bloques
```ts
// ❌ HTML/CSS en el schema del bloque
interface BadBlock {
  style: CSSProperties    // ❌ estilos en el dato
  className: string       // ❌ clases en el dato
  html: string            // ❌ HTML generado por IA
}

// ❌ Lógica de render en el schema
interface BadBlock {
  render: () => JSX.Element  // ❌
}

// ❌ Tipos opcionales sin razón clara
interface BadBlock {
  title?: string    // ❌ si siempre existe, hacerlo requerido
}
```

### OBLIGATORIO
- Cada bloque tiene su propio directorio: `schema.ts`, `renderer.tsx`, `editor-panel.tsx`
- `schema.ts`: solo tipos, sin imports de React
- `renderer.tsx`: solo visualización, sin estado local de editor
- `editor-panel.tsx`: controles de edición del bloque

---

## 9. Estado del editor — Reglas

```ts
// El estado del editor es inmutable — siempre producir nuevo estado
// NUNCA mutar el estado directamente

// ❌
state.blocks[0].data.title = 'nuevo'

// ✅
const nextBlocks = state.blocks.map(b =>
  b.id === targetId
    ? { ...b, data: { ...b.data, title: 'nuevo' } }
    : b
)
```

### Persistencia
- El editor guarda JSON puro, **nunca HTML**
- Cada cambio produce un snapshot del tipo `EditorSnapshot`
- Los snapshots se persisten en Firestore bajo `tenants/{id}/editor/drafts/{snapshotId}`
- Máximo 50 snapshots por tenant (FIFO)

---

## 10. Integración con IA — Reglas

### Lo que la IA puede hacer
```ts
type AIPermission =
  | 'select-template'          // escoger un templateId
  | 'set-block-data'           // rellenar datos de un bloque existente
  | 'reorder-blocks'           // cambiar el orden
  | 'toggle-block-visibility'  // mostrar/ocultar bloques
  | 'set-theme-colors'         // cambiar primaryColor, backgroundColor
  | 'set-text-content'         // modificar strings en block.data
```

### Lo que la IA NO puede hacer (hard-coded)
```ts
type AIForbidden =
  | 'inject-html'              // nunca HTML directo
  | 'inject-css'               // nunca estilos inline arbitrarios
  | 'add-new-block-types'      // solo usa tipos definidos en el sistema
  | 'delete-tenant-data'       // operaciones destructivas
  | 'modify-auth'              // nunca toca auth
  | 'access-other-tenants'     // aislamiento multi-tenant es sagrado
```

### Contrato de output de IA
```ts
// Todo output de IA se valida contra este schema antes de aplicarse
interface AIEditorAction {
  readonly type: AIPermission
  readonly payload: unknown    // validado por zod antes de usar
}

// NUNCA aplicar output de IA sin validar
function applyAIAction(raw: unknown): EditorState {
  const action = AIEditorActionSchema.parse(raw)  // zod — lanza si inválido
  return reducer(currentState, action)
}
```

---

## 11. Manejo de errores — Reglas

### En dominio y use-cases
```ts
// ✅ Errores tipados del dominio, nunca strings
class DomainError extends Error {
  constructor(
    readonly code: string,
    message: string
  ) { super(message) }
}

class NotFoundError extends DomainError {
  constructor(entity: string, id: string) {
    super('NOT_FOUND', `${entity} with id ${id} not found`)
  }
}

// ✅ Result type para operaciones que pueden fallar predeciblemente
type Result<T, E extends DomainError = DomainError> =
  | { ok: true;  value: T }
  | { ok: false; error: E }
```

### En componentes
```ts
// ✅ Error boundaries para features críticas
// ✅ Estados de error explícitos en LoadState
// ❌ console.error como único manejo de errores
// ❌ catch vacíos
try {
  ...
} catch {
  // ❌ esto nunca
}
```

---

## 12. Performance — Reglas

```tsx
// ✅ React.lazy para templates y páginas pesadas
const DishDetailPage = lazy(() => import('./DishDetailPage'))

// ✅ Imágenes con loading="lazy" siempre
<img loading="lazy" src={dish.imageUrl} alt={dish.name} />

// ❌ useCallback/useMemo prematuros
// Solo usar cuando hay evidencia de problema de performance real
// No en cada función "por si acaso"

// ✅ Keys únicas y estables en listas
dishes.map(d => <DishCard key={d.id} dish={d} />)
// ❌
dishes.map((d, i) => <DishCard key={i} dish={d} />)
```

---

## 13. Estilos — Reglas

```tsx
// ✅ Tailwind para layout y utilidades en componentes de UI
<div className="flex items-center gap-3 px-4 py-2">

// ✅ inline styles para valores dinámicos del theme (colores, tamaños calculados)
<div style={{ color: accent, borderRadius: tc.imgRadius }}>

// ❌ inline styles para layout estático que Tailwind puede manejar
<div style={{ display: 'flex', padding: '16px' }}>  // ❌ usar className

// ❌ styled-components, emotion, CSS modules — no en este proyecto
// ❌ !important
// ❌ IDs en CSS
```

---

## 14. Multi-tenancy — Reglas sagradas

Estas reglas no tienen excepciones bajo ninguna circunstancia.

```ts
// ✅ SIEMPRE filtrar por tenantId en queries de Firestore
const q = query(
  collection(db, 'dishes'),
  where('tenantId', '==', tenantId)   // obligatorio
)

// ❌ NUNCA query sin filtro de tenant
const q = query(collection(db, 'dishes'))  // ❌ expone datos de otros tenants

// ✅ SIEMPRE validar en Cloud Functions que el usuario pertenece al tenant
// ❌ NUNCA confiar solo en el cliente para el aislamiento

// ✅ IDs de storage siempre bajo path del tenant
`tenants/${tenantId}/dishes/${dishId}/image.jpg`

// ❌ NUNCA path sin tenant
`dishes/${dishId}/image.jpg`  // ❌
```

---

## 15. Lo que NUNCA hago sin confirmar con el usuario

1. Eliminar archivos existentes
2. Renombrar features o entidades del dominio
3. Modificar el schema de Firestore (estructura de colecciones)
4. Cambiar rutas públicas del router
5. Tocar auth flows
6. Push / deploy a cualquier entorno
7. Modificar reglas de seguridad de Firebase

---

## 16. Checklist antes de entregar código

Antes de declarar una tarea terminada, verifico mentalmente:

- [ ] `npm run build` pasa sin errores ni warnings de TypeScript
- [ ] No hay `any`, `as`, `!` ni `@ts-ignore` nuevos
- [ ] Todos los imports usan path aliases
- [ ] Ningún componente hace fetch o llama a Firebase directamente
- [ ] Ninguna entidad del dominio tiene imports de React o librerías externas
- [ ] Los named exports son consistentes (solo pages/templates usan default)
- [ ] No hay `console.log` olvidados
- [ ] Las props de componentes nuevos tienen interfaces explícitas
- [ ] No hay magic numbers ni magic strings nuevos
- [ ] Ningún valor que pueda cambiar está hardcodeado dentro de un componente
- [ ] Todo valor reutilizado tiene un nombre semántico en su archivo de constantes

---

## 17. Sin hardcoding — Regla de fuente única de verdad

**Principio:** Si un valor aparece más de una vez en el código, o si puede cambiar en el futuro, debe vivir en exactamente un lugar con un nombre semántico.

### PROHIBIDO — Magic numbers y magic strings

```ts
// ❌ Números mágicos
if (snapshots.length > 50) { ... }
setTimeout(save, 1500)
const MAX = 20

// ❌ Strings mágicos dispersos
where('status', '==', 'available')
storage.ref(`tenants/${id}/dishes`)
navigate('/dashboard')

// ❌ Colores hardcodeados fuera del sistema de tema
style={{ color: '#c0392b' }}
style={{ background: '#1a0a00' }}

// ❌ Breakpoints hardcodeados en múltiples archivos
if (window.innerWidth < 768) { ... }

// ❌ Copias (textos UI) hardcodeadas dentro del JSX
<p>No se encontraron resultados</p>
<button>Guardar cambios</button>
```

### OBLIGATORIO — Constantes nombradas con semántica

```ts
// ✅ src/shared/constants/limits.ts
export const LIMITS = {
  editor: {
    maxSnapshots: 50,
    autosaveDebounceMs: 1500,
    maxBlocksPerDocument: 30,
    maxImageSizeMb: 5,
  },
  menu: {
    maxDishesPerCategory: 100,
    maxCategoriesPerMenu: 20,
    maxMenusPerTenant: 10,
  },
  search: {
    minQueryLength: 2,
    debounceMs: 300,
  },
} as const

// ✅ src/shared/constants/firestore-paths.ts
export const PATHS = {
  tenant: (id: string) => `tenants/${id}`,
  editorPublished: (tenantId: string) => `tenants/${tenantId}/editor/published`,
  editorDraft: (tenantId: string, snapshotId: string) =>
    `tenants/${tenantId}/editor/drafts/${snapshotId}`,
  storage: {
    dishImage: (tenantId: string, dishId: string) =>
      `tenants/${tenantId}/dishes/${dishId}/image`,
    tenantLogo: (tenantId: string) =>
      `tenants/${tenantId}/branding/logo`,
    tenantCover: (tenantId: string) =>
      `tenants/${tenantId}/branding/cover`,
  },
} as const

// ✅ src/app/router/routes.ts  (ya existe — úsalo siempre)
// NUNCA escribir rutas como strings en componentes
navigate(ROUTES.dashboard)    // ✅
navigate('/dashboard')        // ❌
```

---

## 18. Design tokens — Un solo lugar para valores visuales

Todos los valores visuales que se repiten viven en `src/shared/design-tokens/`.
Los templates y componentes los consumen, nunca los re-definen.

### Estructura

```
src/shared/design-tokens/
  spacing.ts        ← espaciado base, padding, gap
  typography.ts     ← tamaños de fuente, line-heights, letter-spacing
  radii.ts          ← border-radius para tarjetas, botones, avatares
  shadows.ts        ← box-shadow por nivel de elevación
  transitions.ts    ← duración y easing de animaciones
  breakpoints.ts    ← puntos de quiebre responsive
  z-index.ts        ← capas del stack (nav, modal, toast, overlay)
```

### Tokens obligatorios

```ts
// src/shared/design-tokens/z-index.ts
export const Z = {
  base: 0,
  raised: 10,
  nav: 30,
  overlay: 40,
  modal: 50,
  toast: 60,
} as const

// src/shared/design-tokens/transitions.ts
export const TRANSITION = {
  fast: '100ms ease',
  base: '150ms ease',
  slow: '300ms ease',
  spring: '150ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const

// src/shared/design-tokens/radii.ts
export const RADIUS = {
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '16px',
  '2xl': '20px',
  full: '9999px',
} as const

// src/shared/design-tokens/shadows.ts
export const SHADOW = {
  sm:  '0 1px 4px rgba(0,0,0,0.08)',
  md:  '0 4px 14px rgba(0,0,0,0.10)',
  lg:  '0 8px 24px rgba(0,0,0,0.14)',
  xl:  '0 16px 40px rgba(0,0,0,0.18)',
} as const

// ✅ Uso en templates/componentes
style={{ borderRadius: RADIUS.xl, boxShadow: SHADOW.md }}

// ❌ NUNCA
style={{ borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.10)' }}
```

---

## 19. Modularidad — Regla del cambio en un lugar

**Principio:** Cualquier cambio que afecte múltiples partes del sistema debe requerir editar exactamente un archivo.

### Cambio de límites → editar `limits.ts`
Si cambia el máximo de snapshots: editar `LIMITS.editor.maxSnapshots` una vez.
Todos los lugares que usen esa constante se actualizan solos.

### Cambio de rutas → editar `routes.ts`
Si `/dashboard` pasa a `/app/dashboard`: editar `ROUTES.dashboard` una vez.
Todos los `navigate()` y `<Link to={}>` se actualizan solos.

### Cambio de paths de Firestore → editar `firestore-paths.ts`
Si cambia la estructura de colecciones: editar `PATHS` una vez.
Todos los repositorios se actualizan solos.

### Cambio de tema visual → editar `design-tokens/`
Si el radio de tarjetas cambia de 16px a 12px: editar `RADIUS.xl` una vez.
Todos los templates y componentes se actualizan solos.

### Regla de los tres
Si escribes el mismo valor literal **tres o más veces**, es obligatorio extraerlo a una constante antes de hacer el commit.
Si lo escribes **dos veces**, evalúa si tiene sentido extraerlo por semántica (no solo por deduplicación).

---

## 20. Copy UI — Textos de la interfaz

Los textos visibles al usuario (labels, mensajes, placeholders) no van hardcodeados en el JSX.

```ts
// ✅ src/shared/copy/ui.copy.ts
export const COPY = {
  search: {
    placeholder: 'Buscar platillo…',
    results: (n: number) => `${n} resultado${n !== 1 ? 's' : ''}`,
    noResults: 'Sin resultados',
  },
  dish: {
    unavailable: 'Agotado',
    arBadge: 'AR',
  },
  editor: {
    saveSuccess: 'Cambios guardados',
    saveError: 'Error al guardar. Intenta de nuevo.',
    publishSuccess: 'Menú publicado',
    unsavedChanges: 'Tienes cambios sin guardar',
  },
  table: {
    label: (n: string | number) => `Mesa ${n}`,
  },
} as const
```

**Excepción permitida:** strings de un solo uso que son parte del dominio visual específico de un template (como `"🌮 ¡Buen provecho!"` en TaqueriaViva) pueden ir inline porque son parte de la identidad del template, no copy genérico reutilizable.

---

## 21. Configuración del entorno

```ts
// ✅ src/shared/config/env.ts — único punto de lectura de variables de entorno
function requireEnv(key: string): string {
  const value = import.meta.env[key]
  if (!value) throw new Error(`Missing required env var: ${key}`)
  return value
}

export const ENV = {
  firebase: {
    apiKey:            requireEnv('VITE_FIREBASE_API_KEY'),
    authDomain:        requireEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId:         requireEnv('VITE_FIREBASE_PROJECT_ID'),
    storageBucket:     requireEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: requireEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId:             requireEnv('VITE_FIREBASE_APP_ID'),
  },
  gemini: {
    apiKey: requireEnv('VITE_GEMINI_API_KEY'),
  },
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const

// ❌ NUNCA leer import.meta.env directamente en componentes o servicios
// ❌ NUNCA hardcodear API keys, project IDs, bucket names
```
