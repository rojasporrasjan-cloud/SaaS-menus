# Pendientes — Requieren acción del usuario

Estas tareas no pueden completarse sin intervención externa (credenciales, consola, assets).

---

## ✅ Flujo self-serve completo — RESUELTO (sin Cloud Functions, plan gratis)

El embudo registro → restaurante → editor → publicar → menú público funciona de
punta a punta. Probado end-to-end como usuarios reales (registro desde cero,
registro con plantilla, cotización) — todos llegan al dashboard sin errores.

Cambios clave de esta sesión:
- **Provisioning del lado del cliente** — `TenantProvisioningService` ya NO depende
  de la Cloud Function `initializeTenant` (no estaba desplegada → registro fallaba
  con `functions/not-found`). Ahora el navegador crea tenant + member owner +
  mapping `users/{uid}` + menú + categoría + **mesa por defecto** directamente.
- **Reglas Firestore** actualizadas y **desplegadas** para permitir el bootstrap
  self-serve de forma segura (un usuario solo crea SU tenant y se hace owner de él;
  verificado que NO puede secuestrar tenants ajenos — 5 ataques bloqueados).
- **Bug 403 del dashboard resuelto** — `TenantProvider` tenía un fallback a un
  tenant fijo (`devTenantId`) que hacía que un usuario recién registrado se
  suscribiera transitoriamente a otro tenant. Eliminado: cada usuario resuelve
  SOLO su propio mapping `users/{uid}`.
- **Editor: bug de guardado/publicado resuelto** (path de borradores con paridad
  de segmentos inválida — ver más abajo).
- **Mesa por defecto** creada en el provisioning → el menú público resuelve apenas
  el dueño se registra (antes quedaba en skeleton infinito sin mesas).
- `users/{uid}` creado para la cuenta existente rojasporrasjan@gmail.com.

## 🔑 Firebase / Backend

- [x] ~~**Agregar usuario admin a Firestore members**~~ — **Verificado: ya existe.**
  El doc `tenants/soda-la-rustica/members/k2Bx2PzojfRQh1jR7b4RonYTyis2`
  (rojasporrasjan@gmail.com) está con `role: "owner"`. No era el problema.

- [x] ~~**Editor no guarda / no publica**~~ — **RESUELTO (bug de código, no de permisos).**
  Las rutas de borradores en `src/shared/constants/firestore-paths.ts` tenían la
  paridad de segmentos invertida: `editor/drafts` (4 seg = doc) se usaba con
  `collection()` y `editor/drafts/{id}` (5 seg = colección) con `doc()`. Cada
  `saveDraft` lanzaba "must have even number of segments" → el editor quedaba
  "dirty" para siempre → el botón Publicar (disabled si `isDirty`) nunca se
  habilitaba. Fix: borradores movidos a `editor/drafts/items/{id}` (paridad
  correcta, sigue bajo `editor/**` → reglas ya desplegadas lo cubren).
  Verificado escribiendo/leyendo/borrando como el usuario real.

- [ ] **(Menor) Falta el mapeo `users/{uid}`** — `users/k2Bx2...` no existe.
  En dev no afecta porque `VITE_DEV_TENANT_ID` resuelve el tenant. En PRODUCCIÓN
  (sin esa var) este usuario no podría resolver su restaurante al iniciar sesión.
  Las cuentas nuevas sí lo crean (Cloud Function `initializeTenant`). Para esta
  cuenta vieja, crear: `users/{uid}` = `{ tenantId: "soda-la-rustica", role: "owner" }`.

- [ ] **Variables de entorno** — Confirmar que `.env.local` tiene todas las vars:
  ```
  VITE_FIREBASE_API_KEY=
  VITE_FIREBASE_AUTH_DOMAIN=
  VITE_FIREBASE_PROJECT_ID=
  VITE_FIREBASE_STORAGE_BUCKET=
  VITE_FIREBASE_MESSAGING_SENDER_ID=
  VITE_FIREBASE_APP_ID=
  ```
- [x] ~~**Cloud Function `analyzeMenuImage`**~~ — **Resuelto**: el digitalizador IA ahora llama Gemini 1.5 Flash directamente desde el browser vía REST API. No requiere Cloud Function. Configurar `VITE_GEMINI_API_KEY` en `.env` (obtener en https://aistudio.google.com/app/apikey).
- [ ] **Custom Claims** — Al registrar un nuevo restaurante, llamar `setCustomUserClaims(uid, { tenantId })` desde el backend para que las Storage Rules funcionen correctamente.
- [ ] **Firestore Rules** — Correr `firebase deploy --only firestore:rules,storage:rules` después de revisar las reglas de seguridad.

---

## 🖼 Assets / Cloudinary

- [ ] **Thumbnails de plantillas** — Subir 10 PNGs (una por template) a Cloudinary bajo `menu-saas/templates/{slug}-bg.jpg`. Actualizar `CLOUD_NAME` en `src/features/editor/templates/templateRegistry.ts` con el slug real de la cuenta.
- [ ] **Logo del restaurante** — Subir logo real en Configuración > Apariencia del admin.
- [ ] **Imagen de portada** — Subir cover real en Configuración > Apariencia.

---

## 🚀 Deploy

- [ ] **Firebase Hosting** — Cuando todo esté listo: `npm run build && firebase deploy --only hosting`
- [ ] **Dominio personalizado** — Configurar dominio en Firebase Hosting Console.

---

## 📱 Testing real

- [ ] Probar flujo QR completo: generar QR → escanear con celular → ver menú en móvil.
- [ ] Probar flujo IA: subir foto de menú físico → verificar que Gemini extrae platos correctamente.
- [ ] Probar login con Google en producción (no mock).
