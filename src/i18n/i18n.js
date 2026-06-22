/**
 * i18n Configuration
 * 
 * Configures react-i18next with language detection and HTTP backend
 * for lazy-loading translation files from /locales/{{lng}}/translation.json.
 * 
 * Supported languages: English (en), Spanish (es)
 * Default / Fallback: English
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations statically to avoid network roundtrips
import enTranslation from '../../public/locales/en/translation.json';
import esTranslation from '../../public/locales/es/translation.json';

const resources = {
  en: { translation: enTranslation },
  es: { translation: esTranslation }
};

const SUPPORTED_LANGUAGES = ['en', 'es'];

i18n
  // Detect user language from localStorage or browser settings
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    resources,
    // ---------- Language settings ----------
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    ns: ['translation'],
    defaultNS: 'translation',

    // ---------- Detection – how to pick the initial language ----------
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    // ---------- Interpolation ----------
    interpolation: {
      escapeValue: false, // React already escapes by default
    },

    // ---------- Misc ----------
    react: {
      // Disabling suspense since resources are static
      useSuspense: false,
    },
  });

/* ── Keep <html lang> in sync with the active language ──────────────────────
   The document was hardcoded to lang="en"; without this it never reflects the
   selected language, hurting accessibility and SEO. */
const syncHtmlLang = (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = (lng || i18n.language || 'en').slice(0, 2);
  }
};
i18n.on('languageChanged', syncHtmlLang);
i18n.on('initialized', () => syncHtmlLang(i18n.language));

export default i18n;
