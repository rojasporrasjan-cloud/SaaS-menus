/**
 * Construye un enlace de WhatsApp (wa.me) con mensaje pre-rellenado.
 * El número va en formato internacional sin "+" (ej: 50688887777).
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/[^0-9]/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}
