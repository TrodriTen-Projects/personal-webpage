/**
 * Blog index - lists every Markdown post (newest first) as a GlowCard that
 * links to /blog/:slug. Posts come from src/content/blog/*.md via src/lib/blog.
 */
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GlowCard } from '@/components/ui/glow-card';
import { posts } from '@/lib/blog';
import Seo from '@/components/Seo';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Blog() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.slice(0, 2) === 'es' ? 'es-ES' : 'en-US';

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  return (
    <section id="blog" className="section">
      <Seo title={t('blog.title')} description={t('blog.description')} path="/blog" />
      <div className="section__inner">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          {t('blog.title')}
        </motion.h2>

        <motion.p
          className="about-summary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ marginBottom: 'var(--sp-12)' }}
        >
          {t('blog.description')}
        </motion.p>

        {posts.length > 0 ? (
          <motion.div
            className="publications-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {posts.map((post) => (
              <motion.div key={post.slug} variants={cardVariants}>
                <GlowCard as={Link} to={`/blog/${post.slug}`} className="block h-full p-8 no-underline text-inherit">
                  {post.tags.length > 0 && (
                    <div className="publication-card__badges" style={{ marginBottom: 'var(--sp-4)' }}>
                      {post.tags.map((tag) => (
                        <span key={tag} className="publication-badge publication-badge--conference">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h3 className="publication-card__title">{post.title}</h3>
                  {post.date && <span className="education-card__period">{fmtDate(post.date)}</span>}
                  <p className="glass-card__body" style={{ marginTop: 'var(--sp-3)' }}>
                    {post.description}
                  </p>
                  <span
                    className="mono"
                    style={{
                      marginTop: 'var(--sp-4)',
                      display: 'inline-block',
                      color: 'var(--color-accent)',
                      fontSize: 'var(--fs-xs)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {t('blog.readMore')} →
                  </span>
                </GlowCard>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p style={{ fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>{t('blog.empty')}</p>
        )}
      </div>
    </section>
  );
}
