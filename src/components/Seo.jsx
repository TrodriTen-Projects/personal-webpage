/**
 * Seo — per-route document metadata using React 19's native metadata hoisting
 * (rendering <title>/<meta>/<link> anywhere lifts them into <head>). No extra
 * dependency. Overrides the site-wide defaults from index.html for each page,
 * which helps search engines and social previews for deep links (/blog/:slug…).
 */
const SITE = 'https://www.trodriten.com';
const BRAND = 'Tomas Rodriguez · TrodriTen';

export default function Seo({ title, description, path = '' }) {
  const fullTitle = title ? `${title} | ${BRAND}` : `${BRAND} — Cybersecurity & Web Dev Bogotá`;
  const url = `${SITE}${path}`;

  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
    </>
  );
}
