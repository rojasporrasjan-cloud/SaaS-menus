import * as functions from 'firebase-functions'
import { db } from '../config/firebase'
import { firestorePaths } from '../config/paths'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TenantBranding {
  logoUrl?: string | null
  coverImageUrl?: string | null
  tagline?: string | null
}

interface TenantDocument {
  name?: string
  branding?: TenantBranding
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Escape HTML special chars to avoid XSS in meta tag content. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Build the OG/Twitter meta tag block for a restaurant.
 * ogImage must be an absolute URL (or empty string if none).
 */
function buildMetaTags(params: {
  name: string
  description: string
  ogImage: string
  menuUrl: string
}): string {
  const { name, description, ogImage, menuUrl } = params
  const safeName = escapeHtml(name)
  const safeDesc = escapeHtml(description)
  const safeUrl  = escapeHtml(menuUrl)
  const safeImg  = escapeHtml(ogImage)

  return [
    `<title>${safeName} — Menú Digital</title>`,
    `<meta name="description" content="${safeDesc}" />`,
    // Open Graph — WhatsApp, Facebook, LinkedIn, Telegram
    `<meta property="og:type"        content="website" />`,
    `<meta property="og:site_name"   content="${safeName}" />`,
    `<meta property="og:title"       content="${safeName}" />`,
    `<meta property="og:description" content="${safeDesc}" />`,
    `<meta property="og:url"         content="${safeUrl}" />`,
    safeImg ? `<meta property="og:image"       content="${safeImg}" />` : '',
    safeImg ? `<meta property="og:image:width"  content="1200" />` : '',
    safeImg ? `<meta property="og:image:height" content="630" />` : '',
    // Twitter / X
    `<meta name="twitter:card"        content="${safeImg ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title"       content="${safeName}" />`,
    `<meta name="twitter:description" content="${safeDesc}" />`,
    safeImg ? `<meta name="twitter:image" content="${safeImg}" />` : '',
    // Canonical
    `<link rel="canonical" href="${safeUrl}" />`,
  ].filter(Boolean).join('\n    ')
}

/**
 * Fallback HTML served when we cannot fetch the SPA index.html.
 * Shows the restaurant info with a "Ver menú" CTA so the visitor
 * still lands somewhere useful.
 */
function buildFallbackHtml(params: {
  name: string
  description: string
  ogImage: string
  menuUrl: string
}): string {
  const { name, description, ogImage, menuUrl } = params
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${buildMetaTags(params)}
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #0f0f0f; color: #f5f5f5;
      min-height: 100svh; display: flex; align-items: center; justify-content: center;
    }
    .card {
      max-width: 400px; width: calc(100% - 2rem);
      background: #1a1a1a; border: 1px solid #2a2a2a;
      border-radius: 20px; overflow: hidden; text-align: center;
    }
    .cover {
      width: 100%; height: 200px; object-fit: cover;
      background: #2a2a2a;
    }
    .body { padding: 1.5rem; }
    h1 { font-size: 1.4rem; font-weight: 800; margin-bottom: .5rem; }
    p  { font-size: .875rem; color: #999; margin-bottom: 1.5rem; }
    a  {
      display: inline-block; padding: .75rem 2rem;
      background: #e99a0e; color: #fff; font-weight: 700;
      border-radius: 999px; text-decoration: none; font-size: .9rem;
    }
    a:hover { background: #cc7809; }
  </style>
</head>
<body>
  <div class="card">
    ${ogImage ? `<img class="cover" src="${escapeHtml(ogImage)}" alt="${escapeHtml(name)}" />` : ''}
    <div class="body">
      <h1>${escapeHtml(name)}</h1>
      <p>${escapeHtml(description)}</p>
      <a href="${escapeHtml(menuUrl)}">Ver menú →</a>
    </div>
  </div>
</body>
</html>`
}

// ─── Cloud Function ───────────────────────────────────────────────────────────

/**
 * menuMetaPreview
 *
 * Intercepts GET /:tenantId/menu requests (via Firebase Hosting rewrite),
 * reads the tenant from Firestore, and serves the SPA index.html with
 * injected Open Graph / Twitter Card meta tags so that WhatsApp, Facebook,
 * Telegram, iMessage, and Google all see a beautiful restaurant preview.
 *
 * For real users the React SPA takes over immediately after the HTML loads;
 * for bots (which don't execute JS) the meta tags and fallback content are
 * sufficient for a rich link preview.
 */
export const menuMetaPreview = functions.https.onRequest(async (req, res) => {
  // ── 1. Extract tenantId from path ──────────────────────────────────────────
  // Path is /:tenantId/menu  (Firebase Hosting strips the prefix before calling the function)
  // req.path will be something like /sodarustica-abc12/menu
  const segments = req.path.split('/').filter(Boolean)
  const tenantId = segments[0] ?? ''

  if (!tenantId) {
    res.status(404).send('Not found')
    return
  }

  // ── 2. Read tenant from Firestore ──────────────────────────────────────────
  let tenantName = 'Menú Digital'
  let tagline    = 'Descubrí nuestro menú digital'
  let ogImage    = ''

  try {
    const snap = await db.doc(firestorePaths.tenant(tenantId)).get()
    if (snap.exists) {
      const data = snap.data() as TenantDocument
      if (data.name)                     tenantName = data.name
      if (data.branding?.tagline)        tagline    = data.branding.tagline
      if (data.branding?.coverImageUrl)  ogImage    = data.branding.coverImageUrl
      else if (data.branding?.logoUrl)   ogImage    = data.branding.logoUrl ?? ''
    }
  } catch (err) {
    functions.logger.warn('[menuMetaPreview] Firestore read failed — using defaults', err)
  }

  const menuUrl    = `${req.protocol}://${req.hostname}/${tenantId}/menu`
  const metaParams = { name: tenantName, description: tagline, ogImage, menuUrl }

  // ── 3. Fetch the SPA index.html from Firebase Hosting ─────────────────────
  // Since /:tenantId/menu is rewritten to this function, /index.html still
  // matches the `**` → /index.html rewrite, so there is no circular loop.
  let spaHtml: string | null = null

  try {
    const hostingUrl  = `${req.protocol}://${req.hostname}`
    const spaResponse = await fetch(`${hostingUrl}/index.html`, {
      headers: { 'User-Agent': 'MenuMetaPreviewFunction/1.0' },
      // Cloud Run default timeout is 60s; keep this well under
      signal: AbortSignal.timeout(5_000),
    })
    if (spaResponse.ok) {
      spaHtml = await spaResponse.text()
    }
  } catch (err) {
    functions.logger.warn('[menuMetaPreview] Could not fetch index.html — using fallback', err)
  }

  // ── 4. Inject meta tags into the SPA HTML ─────────────────────────────────
  if (spaHtml) {
    const metaBlock = buildMetaTags(metaParams)

    const html = spaHtml
      // Remove the generic title so ours takes precedence
      .replace(/<title>[^<]*<\/title>/, '')
      // Inject our meta tags just before </head>
      .replace('</head>', `  ${metaBlock}\n</head>`)
      // Set lang to Spanish
      .replace('<html lang="en">', '<html lang="es">')

    res.set('Content-Type', 'text/html; charset=utf-8')
    // Cache for 5 minutes at edge; stale-while-revalidate for 1 hour
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600')
    res.send(html)
    return
  }

  // ── 5. Fallback — serve a pure-HTML preview page ───────────────────────────
  // Reached only when the SPA HTML fetch failed (e.g. first deploy, cold start).
  res.set('Content-Type', 'text/html; charset=utf-8')
  res.set('Cache-Control', 'public, max-age=60')
  res.send(buildFallbackHtml(metaParams))
})
