/**
 * LegalPage - renders a legal document (privacy, cookies, terms) from Markdown
 * at /legal/:slug. Reuses react-markdown (CSP-safe) + the typography plugin.
 */
import { useTranslation } from 'react-i18next';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getLegal } from '@/lib/legal';

export default function LegalPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const doc = getLegal(slug);

  if (!doc) return <Navigate to="/" replace />;

  return (
    <section className="section" style={{ minHeight: 'auto', paddingTop: 'var(--sp-24)' }}>
      <div className="section__inner">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Link to="/" className="mono" style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-sm)' }}>
            {t('legal.back')}
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
            {doc.title}
          </h1>

          {doc.updated && (
            <p className="education-card__period">
              {t('legal.updated')}: {doc.updated}
            </p>
          )}

          <div
            className="prose prose-invert max-w-none prose-headings:font-mono prose-headings:text-foreground prose-a:text-primary prose-code:text-primary prose-strong:text-foreground prose-blockquote:border-l-primary prose-th:text-foreground"
            style={{ marginTop: 'var(--sp-8)' }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.content}</ReactMarkdown>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
