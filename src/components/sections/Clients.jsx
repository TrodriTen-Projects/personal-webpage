import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlowCard } from '@/components/ui/glow-card';

export default function Clients() {
  const { t } = useTranslation();

  // For now, we will render a placeholder or empty items from translations
  // If items exist, they could be mapped here.
  const clientsItems = t('clients.items', { returnObjects: true });
  const hasClients = Array.isArray(clientsItems) && clientsItems.length > 0;

  return (
    <section id="clients" className="section" style={{ minHeight: 'auto', paddingBottom: 'var(--sp-12)' }}>
      <div className="section__inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="section-title">
            {t('clients.title')}
          </h2>
          <p style={{ marginBottom: 'var(--sp-8)', color: 'var(--color-text-secondary)', maxWidth: '600px' }}>
            {t('clients.description')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--sp-6)' }}>
            {hasClients ? (
              clientsItems.map((client, idx) => (
                <GlowCard 
                  key={idx} 
                  as={client.link ? "a" : "div"}
                  href={client.link}
                  target={client.link ? "_blank" : undefined}
                  rel={client.link ? "noopener noreferrer" : undefined}
                  className="p-6 h-full" 
                  style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit' }}
                >
                  <h3 className="mono accent-text" style={{ fontSize: 'var(--fs-md)', marginBottom: 'var(--sp-2)' }}>
                    {client.name || 'Client Name'}
                  </h3>
                  <p style={{ fontSize: 'var(--fs-sm)', flexGrow: 1 }}>
                    {client.description || 'Project description goes here.'}
                  </p>
                  {client.link && (
                    <span style={{ marginTop: 'var(--sp-4)', color: 'var(--color-accent)', textDecoration: 'underline', fontSize: 'var(--fs-xs)' }} className="mono">
                      View Project ↗
                    </span>
                  )}
                </GlowCard>
              ))
            ) : (
              <GlowCard className="p-6 h-full" style={{ opacity: 0.7 }}>
                <p style={{ fontSize: 'var(--fs-sm)', fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
                  Loading projects... / Próximamente...
                </p>
              </GlowCard>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
