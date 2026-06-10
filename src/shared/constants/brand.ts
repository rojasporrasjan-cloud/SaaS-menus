/**
 * Plataforma SaaS — identidad de marca.
 *
 * Esto es la marca del PRODUCTO (la plataforma que vende menús digitales),
 * no la de un restaurante cliente. Cada restaurante es un `tenant` con su
 * propio branding en `Tenant.branding`.
 *
 * Nombre provisional: cámbialo en un solo lugar cuando definas la marca final.
 */
export const PLATFORM = {
  name: 'MenuLab',
  tagline: 'Tu menú digital, listo en minutos',
  description:
    'Crea el menú digital de tu restaurante desde cero, con plantillas profesionales o déjanos cotizarlo por ti. Códigos QR, realidad aumentada y edición visual incluidos.',
  // Número de WhatsApp de ventas (formato internacional sin +, ej: 50688887777).
  // Se usa para el flujo "Cotizar con nosotros".
  salesWhatsApp: '50600000000',
  salesEmail: 'ventas@menulab.app',
  legalName: 'MenuLab',
} as const
