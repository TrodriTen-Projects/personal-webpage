/**
 * URL hardening (patches H-03: CWE-79 DOM-XSS / CWE-601 Open Redirect).
 *
 * React does NOT sanitize URL schemes in href/src attributes - only text.
 * Any href built from data (i18n JSON, a future CMS, query params) must pass
 * through here so that `javascript:`, `data:`, `vbscript:` etc. can never be
 * placed in a link. Principle of least privilege: only known-safe schemes and
 * relative/anchor links are allowed; everything else collapses to a no-op.
 */
const SAFE_URL_SCHEME = /^(https?:|mailto:|tel:)/i;

export function safeHref(url, fallback = '#') {
  if (typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  // Same-page anchors and root-relative paths are safe.
  if (trimmed.startsWith('#') || trimmed.startsWith('/')) return trimmed;
  return SAFE_URL_SCHEME.test(trimmed) ? trimmed : fallback;
}
