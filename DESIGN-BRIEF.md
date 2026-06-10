# 🎨 DESIGN BRIEF — Rediseño premium de las plantillas de menú

> Documento autosuficiente para un agente de diseño. Contiene TODO el contexto
> necesario para rediseñar las 26 plantillas de menú a nivel premium sin
> conocimiento previo del proyecto. Léelo completo antes de tocar código.

---

## 0. TL;DR (qué hay que hacer)

Hay **26 plantillas** de menú digital (React/TS) en `src/features/templates/`.
Dos ya fueron rediseñadas a nivel **premium** como referencia canónica:
**`SodaTicaTemplate`** (claro) y **`DarkModernTemplate`** (oscuro).
**Tarea:** llevar las **24 restantes** al mismo estándar premium, respetando la
personalidad visual de cada una (colores, fuentes, layout).

El cambio más importante NO es decorar más: es el **patrón de presentación de
platos**. Ver sección 4.

---

## 1. Qué es el proyecto

SaaS multi-tenant de **menús digitales para restaurantes** (mercado LATAM, base en
Costa Rica). Cada restaurante ("tenant") arma su menú, lo personaliza y genera un
**código QR**. El comensal escanea → ve el menú en su celular. Las plantillas son
los "skins" visuales del menú público que ve el cliente final.

**Dato real crítico:** el restaurante piloto (Soda La Rústica) tiene **155 platos**
y **~90% NO tienen foto**. Cualquier diseño que dependa de imágenes grandes se ve
vacío y pobre. El diseño DEBE verse premium SIN fotos.

---

## 2. Stack y reglas de arquitectura (obligatorias)

- **React 19 + TypeScript + Vite + Tailwind CSS v4**
- **Clean Architecture.** Las plantillas son capa de presentación pura.
- **TypeScript estricto:** PROHIBIDO `any`, `as` (salvo en adaptadores con
  comentario `// safe:`), `!` non-null, `@ts-ignore`. Tipos de retorno explícitos.
- **Named exports**, excepto las plantillas que son **`export default`** (lazy-load).
- **Sin hardcodear** valores repetidos: usar constantes con nombre.
- **Estilos:** Tailwind para layout utilitario; `style={{}}` inline SOLO para
  valores dinámicos del tema (colores que vienen del branding del tenant).
- Verificación: `npm run build` debe pasar sin errores TS. `npx eslint <archivos>`
  sin warnings.

⚠️ **NO tocar:** auth, reglas de Firestore, multi-tenancy, el router, ni nada fuera
de `src/features/templates/`. El trabajo es **solo visual dentro de las plantillas**.

---

## 3. Cómo funciona una plantilla (contrato)

Cada plantilla vive en `src/features/templates/{Nombre}Template/index.tsx` y es un
`export default function` que recibe estos props (`src/features/templates/types.ts`):

```ts
interface MenuTemplateProps {
  tenant: Tenant          // restaurante: name, branding, etc.
  menu: Menu
  table: Table            // table.label (ej "Mesa 1") y table.number
  groups: DishesGroupedByCategory[]  // categorías con sus platos
  tenantId: string
}
```

`DishesGroupedByCategory` = `{ category: {id,name,description}, dishes: Dish[] }`.
Un `Dish` tiene: `name`, `description`, `price.amount`, `price.currency`,
`status` ('available'|'unavailable'), `assets.imageUrl` (string|null), `assets.hasAR`,
`nutrition.isVegan/isVegetarian/isGlutenFree`.

### Sistema de tema (USAR SIEMPRE)
`getThemeColors(tenant.branding)` de `@shared/utils/colorScale` devuelve colores ya
resueltos del branding del tenant. **No hardcodees colores del tema**, úsalo:

```ts
const tc = getThemeColors(tenant.branding)
// tc.bg, tc.gradient, tc.primary, tc.text, tc.textMuted, tc.surface,
// tc.border, tc.font, tc.cardRadius, tc.buttonRadius, tc.badgeRadius,
// tc.imgRadius, tc.textScale, tc.shadow
// tc detecta automáticamente si el fondo es claro u oscuro y ajusta text/muted/surface.
```

### Secciones compartidas (reutilizar, no reinventar)
De `../sections`: `AnnouncementBar`, `OrderButton`, `FeaturedSection`,
`ReservationSection`, `PromoSection`, `SocialsBar`, `InfoFooter`. Todas reciben
`branding={tenant.branding}` y `tc={tc}`. Mantén estas secciones en cada plantilla.

---

## 4. EL SISTEMA PREMIUM (lo que hay que aplicar)

Estudia las dos referencias YA HECHAS antes de tocar nada:
- `src/features/templates/SodaTicaTemplate/index.tsx`  ← versión clara
- `src/features/templates/DarkModernTemplate/index.tsx` ← versión oscura

Reglas del estándar premium:

1. **Platos = filas elegantes agrupadas en una "tarjeta de menú"** (no grid de
   tarjetas-foto). Una `<div>` tipo card (fondo `tc.surface`/blanco, `borderRadius`,
   `border: 1px tc.border`, sombra sutil) que contiene filas separadas por
   **divisores hairline** (`1px tc.border`).
   - Fila = `[miniatura opcional] · nombre (bold) ······ precio (acento, alineado a la derecha) · descripción (muted, 2 líneas máx) · badges`.
   - **Miniatura (64×64, redondeada) SOLO si `dish.assets.imageUrl` existe.** Si no
     hay foto, la fila es solo texto y se ve limpia y premium. Este es el punto clave.
2. **Precio** en `tc.primary`, peso 800, alineado a la derecha, `whitespace-nowrap`.
3. **Badges** compactos tipo pill: AR 3D, Vegano 🌱, Veggie 🥦, Sin gluten 🌾,
   Agotado (rojo suave). Respeta `branding.showDietaryBadges` y `showPrices`.
4. **Jerarquía tipográfica** clara: nombre 0.95rem/800, descripción 0.78rem/muted,
   título de categoría 1.1–1.2rem/900 con tick de acento y contador de platos.
5. **Paleta sobria.** Premium = restraint. Acento usado con moderación, mucho
   espacio en blanco, fondos suaves. Nada saturado.
6. **Hero refinado** propio de la identidad de la plantilla (mantén su personalidad:
   franja tica, glow cinemático, art déco, pizarrón, etc.) pero limpio.
7. **Fix obligatorio del bug de mesa:** usar
   `const tableLabel = table.label ?? \`Mesa ${table.number}\`` y mostrar
   `{tableLabel}` — NUNCA `Mesa {table.label}` (produce "Mesa Mesa 1").
8. **Nav de categorías** sticky (superior) o bottom-bar, con blur y estado activo
   con acento. Scroll suave a la sección.
9. **Accesibilidad:** contraste suficiente, touch targets ≥ 40px, `loading="lazy"`
   en imágenes.

La personalidad se conserva (cada plantilla mantiene su layout/hero/colores);
lo que se unifica es la **calidad**: tipografía, espaciado, manejo sin-foto.

---

## 5. Las 26 plantillas (24 pendientes)

✅ = ya rediseñada (referencia). El resto está pendiente.

| id | estilo | nota |
|----|--------|------|
| ✅ soda-tica | warm/light | REFERENCIA clara |
| ✅ dark-modern | dark | REFERENCIA oscura |
| light-minimal | light | minimalista |
| warm-bistro | warm | sodas/bistros (mercado clave) |
| carta-negra | dark | fine dining |
| menu-autor | warm | pergamino/bistro (mercado clave) |
| neon-ramen | dark | izakaya neón |
| taqueria-viva | warm | mexicano festivo (mercado clave) |
| la-trattoria | warm | italiano clásico |
| cafe-parisien | light | art déco |
| burger-joint | warm | americano bold |
| sushi-zen | light | japonés minimal |
| mediterraneo | light | azul marino |
| steakhouse | dark | parrilla premium |
| vegan-garden | light | verde orgánico |
| retro-diner | light | años 50 |
| artisan-coffee | warm | kraft/café |
| pizza-rustica | dark | pizarrón |
| patisserie | light | pastelería floral |
| wine-bodega | dark | carta de vinos |
| tapas-bar | warm | barra española |
| marisqueria | light | marino |
| cevicheria | light | cítrico tropical |
| comida-corrida | warm | almuerzo LATAM (mercado clave) |
| panaderia | warm | pan artesanal |
| heladeria | light | pastel divertido |

Metadata de cada una (nombre, tags, colores de preview) está en
`src/features/templates/registry.ts`.

---

## 6. Cómo correr, construir y verificar

```bash
npm run dev            # servidor local (anota el puerto, ej 5173/4010)
npm run build          # DEBE pasar sin errores TS antes de dar por hecho algo
npx eslint src/features/templates/<X>Template   # sin warnings
```

### Cómo PREVISUALIZAR una plantilla con datos reales (importante)
El menú público (`/soda-la-rustica/menu`) renderiza la plantilla que tenga el tenant
en `templateId` + su `branding`. Para ver otra plantilla hay 2 opciones:

- **Recomendado (seguro):** pídele al humano que agregue una ruta de preview de dev,
  o crea un harness que monte `<XTemplate>` con datos mock. NO mutar datos de
  producción si se puede evitar.
- **Fallback (con cuidado):** cambiar temporalmente `templateId` y
  `branding.backgroundColor/primaryColor` del tenant vía Admin SDK, capturar, y
  **restaurar EXACTO** los valores originales. Valores reales del tenant:
  `templateId: soda-tica`, `branding.backgroundColor: #fef3c7`,
  `branding.primaryColor: #b45309`. Para previsualizar una plantilla oscura hay que
  ponerle un `backgroundColor` oscuro (ej `#0B0B0C`) o se ve clara.

Capturas con Playwright (headless), viewport móvil 412×915, `waitUntil:
'domcontentloaded'` + espera fija (el menú mantiene conexiones Firebase abiertas, por
eso `networkidle` se cuelga).

---

## 7. Definición de "hecho" por plantilla

- [ ] Platos en filas premium (foto-opcional), no tarjetas-foto vacías
- [ ] Bug de mesa corregido (`table.label ?? \`Mesa ${table.number}\``)
- [ ] Usa `getThemeColors` (no colores de tema hardcodeados)
- [ ] Mantiene las secciones compartidas (Announcement, Order, Featured, etc.)
- [ ] Respeta `showPrices` y `showDietaryBadges`
- [ ] Conserva su personalidad (hero/colores propios)
- [ ] `npm run build` pasa sin errores TS
- [ ] `eslint` sin warnings; cero `any`/`as`/`!`
- [ ] Verificada visualmente con una captura

---

## 8. Sobre dejarlo trabajando toda la noche

Es **factible** que un agente recorra las 24 en un loop autónomo, PERO:
- El diseño es subjetivo: con este brief (spec clara + 2 referencias) el riesgo de
  "deriva" baja mucho, pero conviene un **checkpoint humano** tras las primeras 3-4.
- Cada plantilla debe pasar **build + eslint + captura** antes de seguir (gate de
  calidad automático).
- Que **haga commit después de cada plantilla** para no perder trabajo y poder
  revertir una que no guste.
- Empezar por el **mercado clave** (warm-bistro, menu-autor, taqueria-viva,
  comida-corrida) por si solo alcanza para unas pocas.

Orden sugerido de trabajo: agrupar por estilo (todas las `light`, luego `warm`,
luego `dark`) para reaprovechar decisiones de diseño dentro de cada familia.
