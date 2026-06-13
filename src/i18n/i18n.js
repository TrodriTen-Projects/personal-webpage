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
import HttpBackend from 'i18next-http-backend';

const SUPPORTED_LANGUAGES = ['en', 'es'];

i18n
  // Load translations via HTTP (lazy-loaded from /public/locales)
  .use(HttpBackend)
  // Detect user language from localStorage or browser settings
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    // ---------- Language settings ----------
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    ns: ['translation'],
    defaultNS: 'translation',

    // ---------- Backend – where to fetch JSON ----------
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },

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
      useSuspense: true,
    },
  });

export default i18n;
