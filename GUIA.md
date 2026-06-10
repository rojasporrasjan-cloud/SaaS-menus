# 📖 Guía fácil de MenuLab (Soda La Rústica SaaS)

> Explicado simple. Esto es lo que tienes hoy, cómo se usa y cómo funciona por dentro.

---

## 1. ¿Qué es esto en una frase?

Una plataforma (SaaS) donde **cualquier restaurante crea su menú digital**: lo arma
desde cero, elige una plantilla, o pide que se lo hagamos. Cada restaurante recibe
un **código QR** para que sus clientes vean el menú en el celular.

Hay **dos caras** en la app:

| Cara | ¿Para quién? | ¿Qué hace? |
|------|--------------|------------|
| 🌐 **Pública** | El dueño del restaurante (antes de registrarse) y sus clientes | Vender el producto + mostrar el menú al cliente que escanea el QR |
| 🔒 **Admin** | El dueño del restaurante (ya registrado) | Crear y administrar su menú, platos, QR, apariencia, etc. |

---

## 2. ¿Cómo lo abro en mi compu?

```bash
cd "C:\Users\rojas\Desktop\Clientes\Soda La Rustica\soda-la-rustica"
npm run dev
```

Luego abre en el navegador: **http://localhost:5173** (o el puerto que diga la consola).

---

## 3. ✅ ¿Qué tenemos? (respuesta rápida)

- **Landing page:** ✅ SÍ, está creada y es la página de inicio (`/`).
- **Galería de plantillas pública:** ✅ SÍ (`/plantillas`) — 26 plantillas.
- **Cotizar:** ✅ SÍ (`/cotizar`).
- **Registro e inicio de sesión:** ✅ SÍ.
- **Panel admin completo:** ✅ SÍ — dashboard, editor visual, menús, platos, QR,
  plantillas, apariencia, analíticas y configuración.
- **Menú público (lo que ve el cliente con el QR):** ✅ SÍ.
- **Flujo completo registrarse → crear restaurante → publicar → ver menú:** ✅ FUNCIONA.

---

## 4. 🌐 Páginas PÚBLICAS (sin necesidad de login)

| Página | URL local | ¿Qué es? |
|--------|-----------|----------|
| **Landing** | `/` | La portada. Explica el producto, muestra los 3 caminos (desde cero / plantilla / cotizar), las funciones, las plantillas y los precios. Botones para registrarse. |
| **Plantillas** | `/plantillas` | Vitrina de las 26 plantillas con filtro por tipo de restaurante. Al elegir una, te lleva a registrarte **con esa plantilla ya seleccionada**. |
| **Cotizar** | `/cotizar` | Formulario para que un restaurante pida que le armemos el menú. Se guarda como "lead" y tiene botón directo a WhatsApp. |
| **Registro** | `/auth/register` | Crear cuenta nueva (email o Google). Aquí nace el restaurante. |
| **Login** | `/auth/login` | Iniciar sesión si ya tienes cuenta. |
| **Menú del cliente** | `/{restaurante}/menu` | Lo que ve el comensal al escanear el QR. Ej: `/soda-la-rustica/menu` |

---

## 5. 🔒 Páginas ADMIN (requieren iniciar sesión)

Todas viven bajo `/admin`. Si entras sin login, te manda al login.

| Página | URL local | ¿Qué hace? |
|--------|-----------|------------|
| **Dashboard** | `/admin/dashboard` | Resumen: métricas, actividad reciente y accesos rápidos. Es la primera pantalla al entrar. |
| **Editor visual** | `/admin/editor` | Editor tipo Canva: arrastra, redimensiona y edita elementos de tu menú. Aquí está **Guardar** y **Publicar**. También el botón de **digitalizar con IA** (subir foto del menú físico). |
| **Menú** | `/admin/menu` | Crear y organizar menús y categorías. |
| **Platos** | `/admin/dishes` | Lista de platos. Crear, editar, activar/agotar, subir foto. |
| **Nuevo/editar plato** | `/admin/dishes/new` | Formulario de un plato (precio, descripción, alérgenos, dietas, foto). |
| **Mesas & QR** | `/admin/qr` | Generar un código QR por mesa para imprimir y poner en las mesas. |
| **Plantillas** | `/admin/templates` | Cambiar la plantilla de tu menú cuando quieras. |
| **Apariencia** | `/admin/appearance` | Editor estilo Shopify: colores, logo, portada, secciones (anuncios, redes, reservas, promos), tipografía, etc. Con vista previa en vivo. |
| **Analíticas** | `/admin/analytics` | Cuántas vistas, escaneos, platos más vistos, por dispositivo. Exporta a CSV. |
| **Configuración** | `/admin/settings` | Perfil del restaurante, branding y plan. |

---

## 6. 🔄 ¿Cómo funciona el flujo completo? (paso a paso)

```
1. El dueño llega a la LANDING (/)
        │
        ├─ "Crear desde cero" ────────► Registro
        ├─ "Ver plantillas" ──► Galería ─► elige una ─► Registro (con plantilla)
        └─ "Cotizar con nosotros" ────► Formulario ─► nos llega el lead
        │
2. REGISTRO (email o Google)
        │  Al registrarse, automáticamente se crea su restaurante:
        │  • su cuenta de dueño
        │  • un menú vacío + una categoría
        │  • una mesa por defecto
        │  • se aplica la plantilla elegida (o una por defecto)
        │
3. Entra al PANEL ADMIN → aparece un asistente de bienvenida (onboarding)
        │
4. Agrega sus PLATOS, ajusta su APARIENCIA, organiza su MENÚ
        │
5. Pulsa GUARDAR y luego PUBLICAR en el editor
        │
6. Genera sus QR en "Mesas & QR" y los imprime
        │
7. El CLIENTE escanea el QR → ve el menú en su celular (/{restaurante}/menu)
```

---

## 7. 🧠 ¿Cómo funciona por dentro? (en simple)

- **Multi-tenant:** cada restaurante es un "tenant" (inquilino) separado. Sus datos
  viven aislados: nadie puede ver ni tocar el restaurante de otro. Esto está protegido
  por reglas de seguridad en Firebase (probadas: no se puede "secuestrar" otro
  restaurante).
- **Base de datos:** Firebase Firestore guarda todo (restaurantes, menús, platos, etc.).
- **Sin servidor propio:** el restaurante se crea **directamente desde el navegador**
  (no usamos Cloud Functions). Esto funciona en el plan **gratis** de Firebase.
- **Fotos:** se suben a Cloudinary.
- **IA:** el digitalizador usa Gemini (subir foto del menú físico → extrae los platos).
- **El menú que se publica** se guarda como datos (JSON), nunca como código suelto.

---

## 8. 🛠️ Cosas que faltan / por configurar antes de lanzar

Estas son decisiones o datos que solo tú puedes poner:

- **WhatsApp y email de ventas reales** → archivo `src/shared/constants/brand.ts`
  (hoy tiene valores de relleno: `50600000000` / `ventas@menulab.app`).
- **Nombre de marca final** → mismo archivo (`brand.ts`). Hoy se llama "MenuLab".
- **Precios finales de los planes** → archivo `src/features/marketing/constants/marketing.content.ts`.
- **Cobros (Stripe):** hoy el registro crea cuentas **gratis** al instante. Si quieres
  cobrar (ej. prueba de 7 días), eso sería el siguiente paso por construir.
- **Panel para ver los leads de cotización:** hoy llegan a la base de datos pero se
  revisan desde la consola de Firebase (aún no hay pantalla interna para verlos).
- **Subir el sitio a internet (deploy):** `npm run build` y luego publicar en Firebase
  Hosting + ponerle un dominio.

---

## 9. 🗺️ Mapa rápido de carpetas (por si entras al código)

```
src/
  app/          → arranque, rutas y layouts (público, admin, marketing)
  pages/        → cada página (marketing, admin, auth, public)
  features/     → módulos: marketing, auth, dishes, menus, editor, qr,
                  analytics, settings, templates (las 26 plantillas), onboarding...
  core/         → reglas de negocio puras (entidades, casos de uso)
  infrastructure→ conexión con Firebase, Cloudinary, etc.
  shared/       → constantes, utilidades, componentes de UI reutilizables
firestore.rules → reglas de seguridad de la base de datos
```

---

¿Dudas? Lo más importante: **todo el flujo ya funciona**. Lo que falta es ponerle tus
datos reales (marca, WhatsApp, precios) y decidir si vas a cobrar.
