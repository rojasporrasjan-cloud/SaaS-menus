# Progreso — Sesión autónoma

Última actualización: iteración 8 — Embudo de adquisición SaaS

---

## ✅ Iteración 8 — Embudo de adquisición público (la puerta de entrada del SaaS)

**Objetivo:** Convertir el producto (panel admin ya completo) en un SaaS real con
los 3 caminos que pidió el usuario: crear desde 0, elegir plantilla, o cotizar.
Modelo elegido: **self-serve + cotizar**.

### Nuevo feature `src/features/marketing/`
- **`constants/marketing.content.ts`** — fuente única: los 3 caminos (`ENTRY_PATHS`),
  6 features destacadas (`PLATFORM_FEATURES`), 3 planes con precios CRC (`PLANS`).
- **`components/`** — `MarketingHeader` (nav + CTAs, responsive), `MarketingFooter`,
  `PathChooser` (3 caminos), `FeatureShowcase`, `PricingTable`, `TemplateGalleryCard`
  (mock de preview por estilo), `QuoteForm` (validación Zod).
- **`services/QuoteService.ts`** + **`hooks/useSubmitQuote.ts`** — persiste leads en
  la colección `quotes` (reglas Firestore ya permitían `create` público).
- **`types/quote.types.ts`** — `quoteSchema` Zod + `Quote` entity.

### Páginas nuevas (`src/pages/marketing/`)
- **`LandingPage`** (`/`) — hero, 3 caminos, features, preview de plantillas, precios, CTA.
  Antes `/` redirigía al login; ahora es el landing.
- **`TemplatesGalleryPage`** (`/plantillas`) — las 26 plantillas con filtro por categoría.
- **`QuotePage`** (`/cotizar`) — formulario de lead + fallback a WhatsApp de ventas.
- **`RegisterPage`** (`/auth/register`) — registro self-serve. Lee `?template=<id>` y
  preselecciona la plantilla (banner verde de confirmación).

### Conexiones
- **`MarketingLayout`** (`src/app/layouts/`) — header + footer del sitio público.
- **`AppRouter`** — rutas de marketing + `/auth/register` cableadas (antes estaban
  definidas en `routes.ts` pero sin construir).
- **`RegisterForm`** (`src/features/auth/components/`) — espejo de `LoginForm`, 4 campos.
- **`useSignUp`** — ahora acepta `template?` opcional; tras provisionar aplica la
  plantilla elegida vía **`TenantTemplateService`** (infra) — el owner ya puede
  escribir su tenant, sin redeploy de Cloud Function.
- **`buildWhatsAppUrl`** (`src/shared/utils/`) — enlace wa.me con mensaje pre-rellenado.

### Flujo completo
Landing → [Desde 0 → registro] · [Plantillas → galería → registro con plantilla] ·
[Cotizar → lead + WhatsApp] → provisioning → onboarding wizard → panel admin.

- `npm run build` → ✓ sin errores TypeScript ✅
- `eslint` sobre archivos nuevos → ✓ cero warnings ✅
- Verificado visualmente (Playwright): landing, galería, cotizar y registro renderizan.

### Pendiente del usuario para producción
- Configurar `PLATFORM.salesWhatsApp` y `salesEmail` reales en `src/shared/constants/brand.ts`
  (hoy son placeholders `50600000000` / `ventas@menulab.app`).
- Ajustar precios finales de los planes en `marketing.content.ts` (`PLANS`).
- Panel interno para revisar leads de `quotes` (hoy se ven solo vía consola Firebase).

---

## ✅ Completado

### Bugs críticos
- **QR URL mismatch** — `MenuPage.tsx` leía `?table=` pero `QRManagerPage` generaba `?tableId=`. Corregido con fallback dual.

### Violaciones de arquitectura (CLAUDE.md) — todos eliminados
- **`DishDetailPage` Firebase directo** → `useDish()` hook en `src/features/menu/hooks/useDish.ts`
- **`AppearancePage` casts `as any`** → 3 casts eliminados, tipos correctos
- **`DataLayerRenderer` cast `as unknown as string`** → prop cambiada a `(layerId: string | null) => void`
- **`auth.ts` / `firestore.ts` / `functions.ts` / `storage.ts`** → `null as any` → `null as unknown as ReturnType<...>` con comentario `// safe:`
- **`ARButton.tsx` `(window as any).MSStream`** → `declare global { interface Window { MSStream?: unknown } }`
- **`AuthService.ts` mock user `as any`** → `as unknown as User` con comentario `// safe:`
- **Cero `as any` en todo el codebase** ✅

### Sidebar
- **Badge "IA" violeta** en ítem Apariencia — guía al módulo más importante
- **`badgeVariant?: 'brand' | 'violet'`** añadido a `NavItem` interface

### EditorPage
- **Botón "Guardar" wired** — antes era un botón muerto sin onClick. Ahora llama `handleManualSave()` que bypassa el debounce del autosave y guarda inmediatamente. Deshabilitado cuando no hay cambios.
- **Botón "Publicar" wired** ✅ — `handlePublish()` conectado a botón verde en topbar. Llama `FirebaseEditorPersistenceService.publish()`. Lógica: guardar primero (disabled si isDirty), spinner mientras publica, dispatcha `PUBLISH_SUCCESS` al terminar.
- **Inspector rotación** — Slider -180°/180°
- **Inspector visibilidad** — Toggle on/off por capa
- **`DigitalizarModal` conectado** — flujo 3 pasos completo

### DigitalizarModal
- **Error handling en `processFile`** — `fileToBase64` ahora tiene try-catch; los callers usan `void processFile(file)` correctamente

### `useUpdateAppearance` hook
- **Dead code eliminado** — las dos líneas de asignación inicial sobreescritas inmediatamente ya no existen
- Lógica simplificada a `let logoUrl: string | null` con inicialización condicional clara

### Performance — Imágenes lazy
- **AdminDishCard** + **todos los templates (25)** — `loading="lazy"` en batch
- **DataLayerRenderer** — logos y dish images en canvas con `loading="lazy"`

### Menú público
- **`document.title` dinámico** — `${tenant.name} — Menú Digital`

### Auditoría módulos admin — todos limpios
- **DashboardPage** ✅ — métricas + activity feed + quick actions
- **DishListPage** ✅ — CRUD con tabs por menú
- **DishEditorPage** ✅ — crear/editar con subida de imagen
- **MenuManagerPage** ✅ — crear menús + categorías con reorder
- **QRManagerPage** ✅ — generación QR por mesa
- **AnalyticsPage** ✅ — métricas con export CSV
- **SettingsPage** ✅ — perfil + branding + plan

### Módulo dishes — CRUD completo
- `useCreateDish`, `useUpdateDish`, `useDeleteDish`, `useToggleDishStatus` — todos funcionales
- `useDishImageUpload` — progress bar + preview + upload
- `DishForm` — validación Zod, collapsible nutrition, dietary badges

### AIParserService
- XSS sanitization de strings de Gemini
- Bounds coherence validation
- Coordinate mapping pixel → percent
- Typed error codes `AIParseErrorCode`
- `parseGeminiPayload` retorna `AIParseResult` discriminated union

### EditorStore reducer
- **`// safe:` comments añadidos** — 3 casts `as DataLayer` sin comentario en líneas 59, 72, 84 del reducer ahora documentados correctamente

### FirebaseEditorPersistenceService
- **`// safe:` comments añadidos** — 3 casts `as EditorDocument / as EditorSnapshot` en adaptador Firestore → dominio ahora documentados

### Menú público — bridge editor → consumidor ✅
- **Gap crítico resuelto**: `MenuPage` no leía el `EditorDocument` publicado. Ahora:
  1. Hook `usePublishedEditorDocument` — lee `tenants/{id}/editor/published` vía React Query, staleTime 2 min
  2. `MenuPage` carga el doc publicado en paralelo con los datos del menú
  3. Si el doc tiene `canvaTemplate` → renderiza con `DataLayerRenderer` (sistema nuevo)
  4. Si no → fallback al sistema legacy de `TemplateComponent`
- El flujo completo ahora es: Editor → Guardar → Publicar → consumidor ve los cambios

---

### Iteración 7 — Diseño premium + eliminación de violaciones `!`

#### UI — Rediseño premium "warm system"
- **Todos los encabezados de página** modernizados (DishListPage, QRManagerPage, MenuManagerPage, AnalyticsPage, DishEditorPage): label uppercase + título grande + descripción, igual que DashboardPage
- **Empty states** en todas las páginas: `1.5px dashed #dbd8d2` + fondo `#faf9f7`, íconos en `#bfbbb4`
- **Error banners**: rojo cálido semitransparente en lugar de `bg-red-50` plano
- **SettingsPage tabs**: gradiente amber activo en lugar de `bg-brand-600` sólido
- **AdminDishCard**: rediseño completo — bordes `#efede9`, sombra cálida, status badges rgba, acciones con hover amber/rojo
- **TableQRCard**: rediseño completo — card `#ffffff` con sombra cálida, preview QR en `#faf9f7`
- **AnalyticsMetricBar**, **EventLineChart**, **TopDishesTable**, **DeviceBreakdown**: cards warm, sombras consistentes
- **CategoryItem**: hover handlers inline, colores warm
- **DateRangeSelector**: pill container warm con `#faf9f7` + `border: #efede9`

#### CLAUDE.md violations eliminadas — `!` non-null assertions (15 archivos)
- `TenantProvider.tsx`, `MenuPage.tsx`, 8 hooks React Query, `useMoveCategory`, `colorScale.ts`, `GetActiveDishesUseCase.ts`, `FirestoreTenantRepository.ts`, `StorageService.ts`

- `npm run build` → ✓ sin errores TypeScript ✅

---

### Iteración 6 — Bugs QR, code-splitting, limpieza

- **QRManagerPage bug corregido** — `defaultMenuId` usaba el tenant ID en lugar del ID del primer menú. Ahora usa `useAdminMenus(tenantId)` para obtener el menú real. El botón "Nueva mesa" se deshabilita si aún no existe ningún menú, con tooltip explicativo.
- **DigitalizarModal code-split** — importado con `lazy()` dentro de `EditorPage`. Solo se descarga cuando el usuario hace clic en el botón "IA". EditorPage bajó de 729kb a 708kb; `DigitalizarModal` es ahora un chunk independiente de 22kb.
- **MenuPage.backup.tsx × 2 eliminados** — archivos muertos que nunca deberían haber existido en el codebase.
- `npm run build` → ✓ sin errores TypeScript ✅

### Iteración 5 — Fixes críticos + DigitalizarModal conectado

- **AppearancePage móvil preview scrollable** — inner div `overflowY: 'auto'` + CSS `.phone-preview-scroll` para ocultar scrollbar nativo, height 863px (= 620/0.718)
- **Editor carga gracefully en blanco** — `FirebaseEditorPersistenceService` captura `permission-denied` en `loadLatestDraft`/`loadPublished`, retorna `null` en vez de lanzar excepción. El editor inicia con documento en blanco cuando el usuario no tiene member doc.
- **Dish detail 404 corregido** — `IDishRepository.getById` ahora recibe `menuId` como 3er argumento. `FirestoreDishRepository` usa el path correcto `tenants/${tenantId}/menus/${menuId}/dishes/${dishId}`. `MockDishRepository` + `useDish` actualizados.
- **FAB "Editar plato"** en `DishDetailPage` — visible solo para usuarios autenticados (`useAuth().user`), link a `DishEditorPage` con `?menuId=` en querystring.
- **DigitalizarModal → Gemini REST directo** — `useDigitalizeMenu` reescrito para llamar `GeminiApiService.analyzeMenuImage()` sin Cloud Function. Nuevo servicio `src/infrastructure/services/GeminiApiService.ts` con prompt completo en español, manejo de JSON y normalización de payload.
- **4 archivos `.backup.tsx` eliminados** — causaban TS2554 (args incorrectos a `useDish`).
- **PENDIENTES.md actualizado** — Cloud Function item marcado como resuelto.
- `npm run build` → ✓ sin errores TypeScript ✅

---

### Iteración 7 — Editor tipo Canva: drag, resize, paleta de elementos

**Objetivo:** Que el editor sea interactivo como Canva — agregar elementos, moverlos libremente, cambiar tamaño.

#### Cambios realizados

- **`blocks.types.ts`** — `DataLayerTextStyle` tiene 3 campos nuevos:
  - `backgroundColor: string | null` — color de fondo de la capa (p. ej. botones con fondo azul)
  - `paddingX: number` — relleno horizontal
  - `paddingY: number` — relleno vertical
  - `defaultTextStyle()` actualizado con los nuevos defaults

- **`DataLayerRenderer/index.tsx`** — Ahora soporta interactividad completa:
  - **Drag-to-move**: `onPointerDown` + `setPointerCapture` en cada `LayerNode`. Arrastra la capa y despacha `UPDATE_LAYER_POSITION` con las nuevas coordenadas en porcentaje.
  - **8 handles de resize** (`nw/n/ne/e/se/s/sw/w`) en la capa seleccionada. Cada `ResizeHandle` tiene su propio `useRef` para el estado de drag y despacha `onResizeLayer` con el patch correcto por dirección.
  - Props nuevas: `onMoveLayer?: (id, x, y) => void` y `onResizeLayer?: (id, patch) => void`
  - `backgroundColor` de `textStyle` se aplica al wrapper de la capa como `backgroundColor` de CSS
  - `paddingX/Y` se aplican como `padding` CSS en `textStyleToCSS`

- **`EditorPage.tsx`** — Flujo Canva completo:
  - **Paleta de elementos** en el panel izquierdo (tab "Capas"):
    - `[T Texto]` — crea capa estática con "Texto", fontSize 24, centrado
    - `[⬛ Botón]` — crea capa estática con fondo azul (#3b82f6), borderRadius 12, padding
    - `[🖼 Imagen]` — crea capa con binding `tenant-field logoUrl`
  - **Inspector de texto** en panel derecho (cuando la capa seleccionada tiene textStyle):
    - Color de texto + Color de fondo (con botón ✕ para quitar fondo)
    - Tamaño de fuente (slider 8–120px)
    - Peso de fuente (Normal/Semibold/Bold/Extrabold/Black)
    - Alineación (Izquierda/Centro/Derecha)
    - Relleno X / Relleno Y
  - **Editor de contenido** (textarea) cuando la capa es `static` — edita el texto directamente
  - **Botón "Eliminar capa"** en rojo al fondo del inspector → `REMOVE_LAYER`
  - Inspector de posición reorganizado: X, Y, Ancho, Alto, Radio, Rotación, Opacidad, Visible
  - Wiring: `onMoveLayer` y `onResizeLayer` pasan directo al store via `UPDATE_LAYER_POSITION`

- **`templateRegistry.ts`** — `LText` usa merge explícito de campos en lugar de spread para incluir `backgroundColor: null`, `paddingX: 0`, `paddingY: 0`

- `npm run build` → ✓ sin errores TypeScript ✅

---

## 🔄 En progreso / Próximas iteraciones

- **URGENTE (usuario)**: Agregar member doc en Firestore: `tenants/soda-la-rustica/members/{uid}` con `role: "owner"` para que el editor pueda guardar y publicar
- **URGENTE (usuario)**: Agregar `VITE_GEMINI_API_KEY` en `.env` para activar digitalizador IA
- Mejorar UX móvil consumidor — gestos, skeleton, micro-animaciones
- `EditorPage` chunk size (729kb) — code-splitting del editor con `React.lazy` para DnD + templates

---

## 📊 Estado del build
- `npm run build` → `✓ built in ~750ms` sin errores TypeScript ✅
- **Cero `as any`** en todo el codebase ✅
- Sin `!` non-null assertions nuevas ✅
- Sin imports Firebase directos en páginas/componentes ✅
- Todas las imágenes de platos tienen `loading="lazy"` ✅
- Botón Guardar funcional ✅
- Botón Publicar funcional ✅
- Editor → menú público: pipeline completo ✅
