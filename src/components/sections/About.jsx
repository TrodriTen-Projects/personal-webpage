/**
 * About Section
 *
 * - Section title + summary paragraph
 * - 3-column skills grid (regulations, cybersecurity, tools)
 * - Each category rendered as a glass-card with icon + pill badges
 * - Stagger animation on scroll via framer-motion whileInView
 */
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock, FaCode, FaGlobe } from 'react-icons/fa';

/* ── Map category keys to icons ──────────────────────────────────────────── */
const CATEGORY_ICONS = {
  regulations: FaShieldAlt,
  cybersecurity: FaLock,
  tools: FaCode,
  languages: FaGlobe,
};

/* ── Animation variants ──────────────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const pillVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

export default function About() {
  const { t } = useTranslation();

  // The translation returns { regulations: {...}, cybersecurity: {...}, tools: {...} }
  const categories = t('about.skillCategories', { returnObjects: true });
  const categoryKeys = Object.keys(categories); // preserves insertion order

  return (
    <section id="about" className="section">
      <div className="section__inner">
        {/* ── Title ───────────────────────────────────────────────────────── */}
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          {t('about.title')}
        </motion.h2>

        {/* ── Summary ────────────────────────────────────────────────────── */}
        <motion.p
          className="about-summary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ marginBottom: 'var(--sp-12)' }}
        >
          {t('about.summary')}
        </motion.p>

        {/* ── Skills grid ────────────────────────────────────────────────── */}
        <motion.div
          className="skills-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {categoryKeys.map((key) => {
            const category = categories[key];
            const Icon = CATEGORY_ICONS[key] || FaCode;

            return (
              <motion.div
                key={key}
                className="glass-card skill-category"
                variants={cardVariants}
              >
                {/* Icon */}
                <div className="skill-category__icon">
                  <Icon />
                </div>

                {/* Category title */}
                <h3 className="skill-category__title">{category.title}</h3>

                {/* Skill pills */}
                <motion.div
                  className="skill-pills"
                  variants={containerVariants}
                >
                  {category.items.map((item, index) => (
                    <motion.span
                      key={index}
                      className="skill-pill"
                      variants={pillVariants}
                    >
                      {item}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
