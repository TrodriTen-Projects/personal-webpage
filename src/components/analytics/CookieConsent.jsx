import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * GDPR / Ley 1581 cookie-consent banner. No analytics load until the visitor
 * accepts. Links to the cookie policy so consent is informed.
 */
export default function CookieConsent({ onAccept, onReject }) {
  const { t } = useTranslation();

  return (
    <motion.div
      role="dialog"
      aria-live="polite"
      aria-label={t('consent.title')}
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed inset-x-3 bottom-3 z-[2000] mx-auto max-w-3xl rounded-lg border border-border bg-card/95 p-5 shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl md:inset-x-auto md:right-5 md:bottom-5 md:left-auto md:w-[440px]"
    >
      <p className="mono accent-text mb-1 text-xs uppercase tracking-widest">{t('consent.title')}</p>
      <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
        {t('consent.text')}{' '}
        <Link to="/legal/cookies" className="text-[var(--color-accent)] underline">
          {t('consent.cookiesLink')}
        </Link>
        .
      </p>
      <div className="flex gap-3">
        <button
          onClick={onReject}
          className="flex-1 rounded-md border border-border px-4 py-2 font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)] transition-colors hover:text-foreground"
        >
          {t('consent.reject')}
        </button>
        <button
          onClick={onAccept}
          className="flex-1 rounded-md bg-primary px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          {t('consent.accept')}
        </button>
      </div>
    </motion.div>
  );
}
