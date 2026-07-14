/**
 * Clients Section
 *
 * Data-driven from i18n `clients.items` (add entries in both locales and the
 * cards appear automatically). Each item: { name, description, logo?, link? }.
 * Place logo files under /public/clients/ and reference them as
 * "/clients/<file>.svg" (same-origin, allowed by the CSP img-src).
 */
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlowCard } from '@/components/ui/glow-card';
import Seo from '@/components/Seo';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Clients() {
  const { t } = useTranslation();
  const items = t('clients.items', { returnObjects: true });
  const clients = Array.isArray(items) ? items : [];

  return (
    <section id="clients" className="section">
      <Seo title={t('clients.title')} description={t('clients.description')} path="/clients" />
      <div className="section__inner">
        {/* ── Title ───────────────────────────────────────────────────────── */}
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          {t('clients.title')}
        </motion.h2>

        <motion.p
          className="about-summary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ marginBottom: 'var(--sp-12)' }}
        >
          {t('clients.description')}
        </motion.p>

        {/* ── Grid ────────────────────────────────────────────────────────── */}
        {clients.length > 0 ? (
          <motion.div
            className="clients-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {clients.map((client, idx) => {
              const linkProps = client.link
                ? { as: 'a', href: client.link, target: '_blank', rel: 'noopener noreferrer' }
                : {};

              return (
                <motion.div key={idx} variants={cardVariants} className="h-full">
                  <GlowCard
                    {...linkProps}
                    className="flex h-full flex-col items-center p-8 text-center no-underline text-inherit"
                  >
                    {/* Logo (or the name as fallback) */}
                    <div className="mb-5 flex h-16 w-full items-center justify-center">
                      {client.logo ? (
                        <img
                          src={client.logo}
                          alt={client.name}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          className="max-h-16 w-auto max-w-[160px] object-contain opacity-85 transition-opacity duration-300 group-hover:opacity-100"
                        />
                      ) : (
                        <span className="mono accent-text text-xl font-bold tracking-wide">
                          {client.name}
                        </span>
                      )}
                    </div>

                    {client.logo && (
                      <h3 className="mono accent-text mb-2 text-base font-bold">{client.name}</h3>
                    )}

                    <p className="flex-grow text-sm text-[var(--color-text-secondary)]">
                      {client.description}
                    </p>

                    {client.link && (
                      <span className="mono mt-5 text-xs uppercase tracking-widest text-[var(--color-accent)]">
                        {t('clients.viewProject')} ↗
                      </span>
                    )}
                  </GlowCard>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <p className="text-[var(--color-text-secondary)] italic">{t('clients.empty')}</p>
        )}
      </div>
    </section>
  );
}
