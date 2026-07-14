/**
 * BlogPost - renders a single Markdown post at /blog/:slug.
 * Uses react-markdown + remark-gfm (tables, strikethrough, task lists) rendered
 * as React elements (no dangerouslySetInnerHTML → CSP-safe), styled with the
 * Tailwind typography plugin tuned to the brand palette.
 */
import { useTranslation } from 'react-i18next';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPost } from '@/lib/blog';
import Seo from '@/components/Seo';

export default function BlogPost() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const post = getPost(slug);

  if (!post) return <Navigate to="/blog" replace />;

  const locale = i18n.language?.slice(0, 2) === 'es' ? 'es-ES' : 'en-US';
  const dateStr = post.date
    ? new Date(post.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <section id="blog-post" className="section" style={{ minHeight: 'auto', paddingTop: 'var(--sp-24)' }}>
      <Seo title={post.title} description={post.description} path={`/blog/${post.slug}`} />
      <div className="section__inner">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Link
            to="/blog"
            className="mono"
            style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-sm)' }}
          >
            {t('blog.back')}
          </Link>

          <h1
            className="mono"
            style={{
              fontSize: 'var(--fs-3xl)',
              fontWeight: 700,
              lineHeight: 'var(--lh-tight)',
              margin: 'var(--sp-6) 0 var(--sp-3)',
            }}
          >
            {post.title}
          </h1>

          {dateStr && (
            <span className="education-card__period">{dateStr}</span>
          )}

          {post.tags.length > 0 && (
            <div className="publication-card__badges" style={{ margin: 'var(--sp-4) 0 var(--sp-10)' }}>
              {post.tags.map((tag) => (
                <span key={tag} className="publication-badge publication-badge--conference">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="prose prose-invert max-w-none prose-headings:font-mono prose-headings:text-foreground prose-a:text-primary prose-code:text-primary prose-strong:text-foreground prose-blockquote:border-l-primary prose-th:text-foreground">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
