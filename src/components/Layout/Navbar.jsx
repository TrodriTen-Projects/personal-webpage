/**
 * Navbar — Fixed top navigation
 *
 * - Left:   Logo "T.R." in JetBrains Mono accent color
 * - Centre: Navigation links to different pages
 * - Right:  EN / ES language toggle pill
 * - Backdrop blur with opacity that increases after scrolling
 * - Hides on scroll down, shows on scroll up
 */
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { FaEarthAmericas, FaBars, FaXmark } from 'react-icons/fa6';

const NAV_ITEMS = [
  { key: 'home',         path: '/' },
  { key: 'about',        path: '/about' },
  { key: 'experience',   path: '/experience' },
  { key: 'education',    path: '/education' },
  { key: 'publications', path: '/publications' },
  { key: 'contact',      path: '/contact' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();

  /* ── Scroll-based background opacity & Hide on scroll ────────────────── */
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  /* ── Mobile menu ─────────────────────────────────────────────────────── */
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 60);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true); // scrolling down
      } else {
        setHidden(false); // scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY]);

  /* ── Language toggle ─────────────────────────────────────────────────── */
  const currentLang = i18n.language?.slice(0, 2) ?? 'en';

  const toggleLanguage = useCallback(() => {
    const next = currentLang === 'en' ? 'es' : 'en';
    i18n.changeLanguage(next);
  }, [currentLang, i18n]);

  return (
    <motion.nav
      className={`navbar${scrolled ? ' navbar--scrolled' : ''}${hidden ? ' navbar--hidden' : ''}`}
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <NavLink
        to="/"
        className="navbar__logo"
        onClick={closeMenu}
      >
        T.R.
      </NavLink>

      {/* ── Navigation links (collapses into a dropdown on mobile) ───────── */}
      <div className={`navbar__links${menuOpen ? ' navbar__links--open' : ''}`}>
        {NAV_ITEMS.map(({ key, path }) => (
          <NavLink
            key={key}
            to={path}
            onClick={closeMenu}
            className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
          >
            {t(`nav.${key}`)}
          </NavLink>
        ))}
      </div>

      {/* ── Right-side actions ───────────────────────────────────────────── */}
      <div className="navbar__actions">
        {/* Language toggle */}
        <button
          className="lang-toggle"
          onClick={toggleLanguage}
          aria-label={t('nav.language')}
        >
          <FaEarthAmericas style={{ color: 'var(--color-accent)', marginRight: '4px' }} />
          <span
            className={`lang-toggle__option${currentLang === 'en' ? ' lang-toggle__option--active' : ''}`}
          >
            EN
          </span>
          <span
            className={`lang-toggle__option${currentLang === 'es' ? ' lang-toggle__option--active' : ''}`}
          >
            ES
          </span>
        </button>

        {/* Hamburger — mobile only (shown via CSS ≤768px) */}
        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaXmark /> : <FaBars />}
        </button>
      </div>
    </motion.nav>
  );
}
