/**
 * Publications Section
 *
 * - Glass-cards with a CSS scanline overlay (horizontal line sweeping down)
 * - Each card: paper title, conference badge, role badge
 * - FaFileAlt icon per card
 * - Stagger entrance via framer-motion whileInView
 */
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaFileAlt } from 'react-icons/fa';

/* ── Animation variants ──────────────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function Publications() {
  const { t } = useTranslation();
  const items = t('publications.items', { returnObjects: true });

  return (
    <section id="publications" className="section">
      <div className="section__inner">
        {/* ── Title ───────────────────────────────────────────────────────── */}
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          {t('publications.title')}
        </motion.h2>

        {/* ── Cards grid ─────────────────────────────────────────────────── */}
        <motion.div
          className="publications-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {items.map((item, index) => (
            <motion.a
              key={index}
              href={item.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card publication-card"
              variants={cardVariants}
              style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
            >
              {/* Scanline overlay — purely decorative */}
              <div className="publication-card__scanline" aria-hidden="true" />

              {/* Icon */}
              <div className="publication-card__icon">
                <FaFileAlt />
              </div>

              {/* Paper title */}
              <h3 className="publication-card__title">{item.title}</h3>

              {/* Badges row */}
              <div className="publication-card__badges">
                <span className="publication-badge publication-badge--conference">
                  {item.conference}
                </span>
                <span className="publication-badge publication-badge--role">
                  {item.role}
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
