/**
 * Hero Section
 *
 * Full-viewport overlay that floats above the 3D Canvas (z-index: 10).
 * - Name rendered in JetBrains Mono at ~4rem
 * - Role with a character-by-character typewriter effect + blinking cursor
 * - Decorative horizontal gold line animating from 0→200px width
 * - Bouncing scroll-down hint at the bottom
 * - Services grid and footer
 */
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaClipboardCheck, FaNetworkWired, FaCode } from 'react-icons/fa';

/* ── Typewriter speed (ms per character) ─────────────────────────────────── */
const TYPE_SPEED = 65;

export default function Hero() {
  const { t } = useTranslation();

  /* ── Typewriter state ────────────────────────────────────────────────── */
  const fullRole = t('hero.role');
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let index = 0;

    const interval = setInterval(() => {
      index += 1;
      setDisplayed(fullRole.slice(0, index));
      if (index >= fullRole.length) clearInterval(interval);
    }, TYPE_SPEED);

    return () => clearInterval(interval);
  }, [fullRole]);

  const handleScrollClick = useCallback(() => {
    const el = document.getElementById('services-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const services = [
    { id: 'defensive', icon: FaShieldAlt },
    { id: 'grc', icon: FaClipboardCheck },
    { id: 'network', icon: FaNetworkWired },
    { id: 'dev', icon: FaCode },
  ];

  return (
    <div className="landing-wrapper">
      <section id="home" className="hero-section">
        {/* ── Name ─────────────────────────────────────────────────────────── */}
        <motion.h1
          className="hero-name"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {t('hero.name')}
        </motion.h1>

        {/* ── Decorative gold line ─────────────────────────────────────────── */}
        <motion.div
          className="hero-line"
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
        />

        {/* ── Typewriter role ──────────────────────────────────────────────── */}
        <motion.p
          className="hero-role"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {displayed}
          <span className="hero-cursor" aria-hidden="true">
            |
          </span>
        </motion.p>

        {/* ── Scroll indicator ─────────────────────────────────────────────── */}
        <motion.button
          className="hero-scroll-hint"
          onClick={handleScrollClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          aria-label={t('hero.scrollHint')}
        >
          <span className="hero-scroll-hint__arrow">↓</span>
          <span className="hero-scroll-hint__text">{t('hero.scrollHint')}</span>
        </motion.button>
      </section>

      {/* ── Services & Contact Section ──────────────────────────────────────── */}
      <section id="services-grid" className="services-section">
        <div className="section__inner section__inner--hero" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 'var(--sp-8)', alignItems: 'start' }}>
          
          {/* Services Grid */}
          <motion.div
            className="services-grid-container"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } }
            }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 'var(--sp-6)' }}
          >
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={svc.id}
                  className="glass-card service-card"
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <div className="service-card__icon"><Icon size={32} style={{ marginBottom: '1rem', color: 'var(--color-accent)' }}/></div>
                  <h3 className="mono accent-text" style={{ fontSize: 'var(--fs-md)', marginBottom: 'var(--sp-2)' }}>
                    {t(`hero.services.${svc.id}.title`)}
                  </h3>
                  <p style={{ fontSize: 'var(--fs-sm)' }}>
                    {t(`hero.services.${svc.id}.description`)}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Quick Contact Form */}
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'var(--sp-8)' }}
          >
            <h2 className="mono accent-text" style={{ fontSize: 'var(--fs-2xl)', marginBottom: 'var(--sp-4)' }}>
              {t('hero.cta.title')}
            </h2>
            <p style={{ marginBottom: 'var(--sp-8)', maxWidth: '600px' }}>
              {t('hero.cta.description')}
            </p>
            <form 
              action="mailto:contact@trodriten.com" 
              method="post" 
              encType="text/plain"
              style={{ display: 'flex', gap: 'var(--sp-4)', width: '100%', maxWidth: '500px', flexDirection: 'column' }}
            >
              <input 
                type="text" 
                name="name" 
                placeholder={t('hero.cta.namePlaceholder')} 
                required 
                className="form-input"
              />
              <textarea 
                name="body" 
                placeholder={t('hero.cta.bodyPlaceholder')} 
                rows="4" 
                required 
                className="form-input"
              ></textarea>
              <button type="submit" className="cta-button" style={{ width: '100%', justifyContent: 'center' }}>
                {t('hero.cta.submitButton')}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <p className="mono" style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-secondary)', textAlign: 'center', padding: '2rem 0' }}>{t('contact.footer')}</p>
      </footer>
    </div>
  );
}
