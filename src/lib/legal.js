/**
 * Legal docs loader - reads src/content/legal/*.md (Markdown with a `title` /
 * `updated` front-matter) and exposes them by slug for the /legal/:slug route.
 */
const modules = import.meta.glob('/src/content/legal/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function parse(raw) {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, content: raw.trim() };
  const data = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    data[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
  }
  return { data, content: match[2].trim() };
}

export const legalDocs = Object.fromEntries(
  Object.entries(modules).map(([path, raw]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '');
    const { data, content } = parse(raw);
    return [slug, { slug, title: data.title || slug, updated: data.updated || '', content }];
  })
);

export const getLegal = (slug) => legalDocs[slug];
