# Editor Architecture — Soda La Rustica

Documento vivo. Última actualización: 2026-05-27.

---

## Visión

El editor visual es un **compositor de bloques**, no un generador de HTML.
Su responsabilidad es permitir que un dueño de restaurante (o la IA) ensamble
una página de menú combinando bloques predefinidos, configurando su contenido
y orden — sin tocar código.

**La IA orquesta. El engine renderiza.**

---

## Principio fundamental

```
JSON  →  Engine  →  UI
```

El estado persiste siempre como JSON puro. El engine React convierte ese JSON
en UI. La IA solo produce JSON. Nunca produce HTML ni CSS.

---

## Estructura de capas del editor

```
src/features/editor/
  blocks/              ← Definición de cada tipo de bloque
    hero/
      schema.ts        ← Tipos TypeScript del bloque
      renderer.tsx     ← Componente de render (solo lectura)
      editor-panel.tsx ← Controles de edición (solo en admin)
    menu-section/
    promo/
    reservation/
    featured/
    testimonial/
    socials/
    footer/
  
  composer/            ← El orquestador que ensambla bloques
    EditorComposer.tsx
    BlockList.tsx
    BlockWrapper.tsx
  
  store/               ← Estado del editor (Zustand o Context)
    editorStore.ts
    editorReducer.ts
    editorSelectors.ts
  
  ai/                  ← Adaptador entre IA y el store del editor
    AIEditorAdapter.ts
    AIEditorSchema.ts  ← Validación Zod del output de IA
    AIEditorActions.ts
  
  persistence/         ← Guardar/cargar en Firestore
    EditorPersistenceService.ts
    snapshotUtils.ts
  
  types/
    editor.types.ts    ← Todos los tipos del editor
```

---

## Schema de datos — EditorDocument

Este es el único formato que se persiste. Todo lo demás se deriva de esto.

```ts
interface EditorDocument {
  readonly version: 1                    // versión del schema
  readonly tenantId: string
  readonly templateId: TemplateId        // base visual (colores, fuentes)
  readonly theme: EditorTheme
  readonly blocks: readonly Block[]
  readonly updatedAt: string             // ISO string
}

interface EditorTheme {
  readonly primaryColor: string          // hex
  readonly backgroundColor: string       // hex
  readonly fontFamily: string
  readonly heroHeight: 'compact' | 'normal' | 'tall'
  readonly textScale: string
  readonly imgRadius: string
}

// Discriminated union — cada tipo de bloque es un branch separado
type Block =
  | HeroBlock
  | MenuSectionBlock
  | FeaturedBlock
  | PromoBlock
  | ReservationBlock
  | TestimonialBlock
  | AnnouncementBlock
  | SocialsBlock
  | FooterBlock
```

### Regla: los bloques son datos puros

Un bloque **no** contiene:
- Clases CSS
- Estilos inline
- Referencias a componentes React
- HTML generado

Un bloque **sí** contiene:
- Texto que el usuario configura
- URLs de imágenes (de Firebase Storage)
- Flags booleanos (visible, highlighted, etc.)
- IDs de referencia (dishId, categoryId)

---

## Tipos de bloques disponibles

| Tipo | Descripción | Único | Obligatorio |
|---|---|---|---|
| `hero` | Banner principal con imagen y nombre del restaurante | Sí | Sí |
| `menu-section` | Categoría de platillos (se repite por categoría) | No | Sí |
| `featured` | Platillos destacados horizontal scroll | Sí | No |
| `promo` | Banner de promoción con imagen | No | No |
| `reservation` | Sección de reservaciones | Sí | No |
| `testimonial` | Reseñas de clientes | Sí | No |
| `announcement` | Barra de aviso (horario, delivery, etc.) | Sí | No |
| `socials` | Links a redes sociales | Sí | No |
| `footer` | Información de contacto y créditos | Sí | Sí |

---

## Flujo de render

```
EditorDocument (Firestore)
        ↓
  EditorComposer
        ↓
  blocks.map(block => BlockRenderer[block.type])
        ↓
  cada BlockRenderer recibe: block.data + theme
        ↓
  UI final
```

El `BlockRenderer` es un switch exhaustivo:

```tsx
function BlockRenderer({ block, theme }: { block: Block; theme: EditorTheme }) {
  switch (block.type) {
    case 'hero':         return <HeroRenderer block={block} theme={theme} />
    case 'menu-section': return <MenuSectionRenderer block={block} theme={theme} />
    case 'featured':     return <FeaturedRenderer block={block} theme={theme} />
    // ... todos los cases
    // TypeScript fuerza exhaustiveness — el compilador avisa si falta un case
  }
}
```

---

## Flujo de edición

```
Usuario hace cambio en EditorPanel
        ↓
  dispatchEditorAction({ type: 'UPDATE_BLOCK_DATA', blockId, patch })
        ↓
  editorReducer produce nuevo EditorDocument (inmutable)
        ↓
  React re-renders solo el bloque afectado
        ↓
  [debounced 1.5s] EditorPersistenceService.saveDraft(document)
        ↓
  Firestore: tenants/{tenantId}/editor/drafts/{snapshotId}
```

### Historial de versiones
- Cada `saveDraft` crea un snapshot con timestamp
- Se mantienen los últimos 50 snapshots por tenant
- El usuario puede hacer "undo" hasta 50 cambios atrás
- `publish()` copia el draft actual a `tenants/{tenantId}/editor/published`

---

## Flujo de la IA

```
Usuario describe lo que quiere
        ↓
  AI Chat Feature (ya existe)
        ↓
  Gemini produce AIEditorAction[]
        ↓
  AIEditorAdapter.validate(actions)   ← Zod valida cada acción
        ↓
  Si válido → dispatch al editorStore
  Si inválido → error tipado, nada se aplica
        ↓
  Preview en tiempo real
        ↓
  Usuario confirma o descarta
```

### Contrato de acción de IA

```ts
// El output de Gemini SIEMPRE se valida antes de aplicar
const AIEditorActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('select-template'),
    templateId: z.string(),
  }),
  z.object({
    type: z.literal('set-block-data'),
    blockId: z.string().uuid(),
    patch: z.record(z.string(), z.unknown()),  // validado específicamente por bloque
  }),
  z.object({
    type: z.literal('reorder-blocks'),
    orderedIds: z.array(z.string().uuid()),
  }),
  z.object({
    type: z.literal('set-theme'),
    theme: EditorThemeSchema.partial(),
  }),
])
```

---

## Persistencia en Firestore

### Estructura de colecciones

```
tenants/{tenantId}/
  editor/
    published/             ← documento activo visible a clientes
      document.json
    drafts/
      {snapshotId}/        ← historial (máx 50, FIFO)
        document.json
        metadata.json      ← { createdAt, triggeredBy: 'user' | 'ai', userId }
```

### Reglas de seguridad
- Solo el tenant owner puede leer/escribir `editor/`
- `editor/published/document.json` es readable públicamente (para el menú)
- Los drafts son privados del owner

---

## Fases de implementación

### Fase 1 — Editor básico (sin IA)
- [ ] `EditorDocument` schema y tipos
- [ ] `editorStore` con Zustand
- [ ] `BlockRenderer` exhaustivo para los 9 tipos
- [ ] `EditorComposer` con drag-and-drop básico (dnd-kit)
- [ ] `EditorPanel` con controles por tipo de bloque
- [ ] `EditorPersistenceService` — save draft, load, publish
- [ ] Historial de versiones básico (undo/redo)

### Fase 2 — AI Menu Scanner
- [ ] `AIMenuScannerService` — Gemini Vision procesa foto de menú físico
- [ ] Produce JSON de categorías y platillos
- [ ] Popula automáticamente los `menu-section` blocks

### Fase 3 — AI Editor Assistant
- [ ] `AIEditorAdapter` completo
- [ ] Chat UI para describir cambios
- [ ] Preview antes de confirmar
- [ ] "AI Theme Engine": usuario describe estilo → IA selecciona template + colores

### Fase 4 — Motion & Media (HeyGen/HyperFrames)
- [ ] Hero animations
- [ ] Promo banner generator
- [ ] Reels automáticos desde menú

---

## Decisiones de arquitectura tomadas (ADRs)

### ADR-001: JSON sobre HTML
**Decisión:** El estado del editor persiste como JSON estructurado, no como HTML.
**Razón:** HTML generado es frágil, difícil de editar, imposible de versionar semánticamente.
El JSON permite que la IA opere con seguridad, que el undo/redo sea trivial, y que
el mismo documento se exporte a múltiples formatos en el futuro.

### ADR-002: Templates como base, bloques como contenido
**Decisión:** El `templateId` define el *skin* visual (colores, tipografías, estética).
Los bloques definen el *contenido y estructura*.
**Razón:** Separar apariencia de contenido permite cambiar el template sin perder datos.

### ADR-003: Firebase sobre Supabase para el MVP
**Decisión:** Mantenemos Firebase.
**Razón:** Ya está en producción con auth, Firestore y Storage funcionando.
Migrar a Supabase antes del primer cliente pagando es deuda técnica pura.
Se revisará en Fase 4 si los límites de Firestore se vuelven un problema.

### ADR-004: Craft.js solo en Fase 3+
**Decisión:** El editor de Fase 1 usa dnd-kit + componentes custom.
**Razón:** Craft.js tiene una curva de aprendizaje significativa y agrega ~100KB al bundle.
Para Fase 1, un compositor de bloques con drag-and-drop básico cubre el 90% del valor.
Se evalúa Craft.js cuando se necesiten zonas de drag anidadas y rich text inline.

### ADR-005: IA como orquestadora, nunca como diseñadora
**Decisión:** La IA solo produce `AIEditorAction[]` con tipos predefinidos.
Nunca produce HTML, CSS, ni componentes.
**Razón:** Los outputs libres de IA en UI producen inconsistencias,
responsive roto y estilos incompatibles. El engine controla el render, siempre.
