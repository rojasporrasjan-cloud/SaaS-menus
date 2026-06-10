/**
 * Convierte un texto libre en un slug seguro para URLs e IDs de Firestore.
 * "Soda La Rústica!" → "soda-la-rustica"
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita acentos (combining diacritics)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // no alfanumérico → guion
    .replace(/^-+|-+$/g, '') // recorta guiones de los extremos
    .slice(0, 40)
}

/**
 * Genera un slug único añadiendo un sufijo aleatorio corto.
 * Evita colisiones cuando dos restaurantes comparten nombre.
 */
export function uniqueSlug(input: string): string {
  const base = slugify(input) || 'restaurante'
  const suffix = Math.random().toString(36).slice(2, 7)
  return `${base}-${suffix}`
}
