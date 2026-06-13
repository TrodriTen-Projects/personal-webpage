/**
 * Contact Section
 *
 * - Title + subtitle
 * - Contact pills: email, phone, LinkedIn, GitHub
 * - CTA button with rotating-border gradient (mailto link)
 * - Footer copyright line
 * - Stagger animation on scroll
 */
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  FaEnvelope,
  FaWhatsapp,
  FaLinkedin,
  FaGithub,
} from 'react-icons/fa';

/* ── Animation variants ──────────────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function Contact() {
  const { t } = useTranslation();

  /* ── Contact entries ───────────────────────────────────────────────────── */
  const links = [
    {
      icon: FaEnvelope,
      label: t('contact.email'),
      href: `mailto:${t('contact.email')}`,
    },
    {
      icon: FaWhatsapp,
      label: t('contact.whatsapp'),
      href: `https://wa.me/573176193232`,
      external: true,
    },
    {
      icon: FaLinkedin,
      label: t('contact.linkedin'),
      href: 'https://linkedin.com/in/tomasalbertorodriguez',
      external: true,
    },
    {
      icon: FaGithub,
      label: t('contact.github'),
      href: 'https://github.com/TrodriTen',
      external: true,
    },
  ];

  return (
    <section id="contact" className="section">
      <div className="section__inner text-center">
        {/* ── Title ───────────────────────────────────────────────────────── */}
        <motion.h2
          className="section-title"
          /* Centered section: balance the decorative ::before bar (4px + gap)
             with matching padding-right so the title text lands on the same
             centered axis as the pills/CTA below. (translateX is unreliable
             here because framer-motion controls the transform.) */
          style={{ justifyContent: 'center', paddingRight: 'calc(4px + var(--sp-4))' }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          {t('contact.title')}
        </motion.h2>

        {/* ── Subtitle ───────────────────────────────────────────────────── */}
        <motion.p
          className="section-subtitle text-secondary"
          /* Drop the left-aligned-section padding so the subtitle stays
             truly centered under the title. */
          style={{ paddingLeft: 0 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {t('contact.subtitle')}
        </motion.p>

        {/* ── Pill links ─────────────────────────────────────────────────── */}
        <motion.div
          className="contact-links"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {links.map(({ icon: Icon, label, href, external }) => (
            <motion.a
              key={label}
              href={href}
              className="contact-pill"
              variants={itemVariants}
              {...(external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              <span className="contact-pill__icon">
                <Icon />
              </span>
              {label}
            </motion.a>
          ))}
        </motion.div>

        {/* ── CTA button ─────────────────────────────────────────────────── */}
        <motion.div
          style={{ marginTop: 'var(--sp-12)' }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a
            href="mailto:contact@trodriten.com"
            className="cta-button"
          >
            {t('contact.cta')}
          </a>
        </motion.div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <motion.footer
          className="footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <small>{t('contact.footer')}</small>
        </motion.footer>
      </div>
    </section>
  );
}
