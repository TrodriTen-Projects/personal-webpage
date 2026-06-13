/**
 * Education Section
 *
 * - Two glass-cards in a flex row (stack on mobile)
 * - Each card: degree (accent color), institution, period
 * - Courses → gold-bordered badges · Activities → alt-styled badges
 * - Glowing left border (#FFD700) with hover lift + glow shadow
 * - FaGraduationCap icon for visual flair
 */
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaGraduationCap } from 'react-icons/fa';

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

export default function Education() {
  const { t } = useTranslation();
  const items = t('education.items', { returnObjects: true });

  return (
    <section id="education" className="section">
      <div className="section__inner">
        {/* ── Title ───────────────────────────────────────────────────────── */}
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          {t('education.title')}
        </motion.h2>

        {/* ── Cards ──────────────────────────────────────────────────────── */}
        <motion.div
          className="education-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              className="glass-card education-card"
              variants={cardVariants}
            >
              {/* Icon */}
              <div className="education-card__icon">
                <FaGraduationCap />
              </div>

              {/* Degree */}
              <h3 className="education-card__degree">{item.degree}</h3>

              {/* Institution & period */}
              <p className="education-card__institution">{item.institution}</p>
              <span className="education-card__period">{item.period}</span>

              {/* Courses badges (if present) */}
              {item.courses && (
                <div className="education-badges">
                  {item.courses.map((course) => (
                    <span key={course} className="education-badge education-badge--course">
                      {course}
                    </span>
                  ))}
                </div>
              )}

              {/* Activity badges (if present) */}
              {item.activities && (
                <div className="education-badges">
                  {item.activities.map((activity) => (
                    <span key={activity} className="education-badge education-badge--activity">
                      {activity}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
