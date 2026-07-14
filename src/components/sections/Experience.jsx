/**
 * Experience Section - Vertical Timeline
 *
 * - Central vertical gold line (CSS via .timeline::before)
 * - Each item alternates left ↔ right on desktop
 * - Cards slide in from the opposite side with framer-motion whileInView
 * - On mobile the CSS collapses everything to the left automatically
 */
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlowCard } from '@/components/ui/glow-card';

export default function Experience() {
  const { t } = useTranslation();
  const items = t('experience.items', { returnObjects: true });

  return (
    <section id="experience" className="section">
      <div className="section__inner">
        {/* ── Title ───────────────────────────────────────────────────────── */}
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          {t('experience.title')}
        </motion.h2>

        {/* ── Timeline ───────────────────────────────────────────────────── */}
        <div className="timeline">
          {items.map((item, index) => {
            const isLeft = index % 2 === 0; // odd child = left side (CSS :nth-child(odd))
            const slideX = isLeft ? -50 : 50;

            return (
              <motion.div
                key={index}
                className="timeline__item"
                initial={{ opacity: 0, x: slideX }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
              >
                {/* Gold node on the centre line */}
                <div className="timeline__node" />

                {/* Card content */}
                <GlowCard className="p-8">
                  <div className="glass-card__header">
                    <h3 className="glass-card__title">{item.role}</h3>
                    <span className="glass-card__meta">{item.period}</span>
                  </div>
                  <p className="timeline__company">{item.company}</p>
                  <p className="glass-card__body">{item.description}</p>
                </GlowCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
