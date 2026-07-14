/**
 * Blog loader.
 *
 * Reads every Markdown file in `src/content/blog/*.md` at build time via
 * Vite's import.meta.glob, parses a small YAML-ish front-matter block, and
 * exposes the posts sorted newest-first. To publish, just drop a new `.md`
 * file in that folder with front-matter - it appears automatically after the
 * next build/deploy.
 *
 * Front-matter example:
 *   ---
 *   title: "My post"
 *   date: "2026-06-25"
 *   description: "One-line summary."
 *   tags: [Cyber, Notes]
 *   ---
 *   Markdown body...
 */
const modules = import.meta.glob('/src/content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function parseFrontmatter(raw) {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, content: raw.trim() };

  const data = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    }
    data[key] = val;
  }
  return { data, content: match[2].trim() };
}

export const posts = Object.entries(modules)
  .map(([path, raw]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '');
    const { data, content } = parseFrontmatter(raw);
    return {
      slug,
      title: data.title || slug,
      date: data.date || '',
      description: data.description || '',
      tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
      content,
    };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

export const getPost = (slug) => posts.find((p) => p.slug === slug);
