/**
 * Tracking configuration + helpers.
 *
 * IDs come from VITE_* env vars (inlined at build time; not secrets). An empty
 * id simply means that provider does not load — safe degradation. No script is
 * ever injected until the visitor grants consent (see components/analytics).
 */
const env = import.meta.env;

export const TRACKING = {
  GA_ID: env.VITE_GA_ID || '',
  FB_PIXEL_ID: env.VITE_FB_PIXEL_ID || '',
  GOOGLE_ADS_ID: env.VITE_GOOGLE_ADS_ID || '',
  GOOGLE_ADS_LABEL: env.VITE_GOOGLE_ADS_LABEL || '',
};

export const hasGoogle = () => !!(TRACKING.GA_ID || TRACKING.GOOGLE_ADS_ID);
export const hasMeta = () => !!TRACKING.FB_PIXEL_ID;
export const hasAnalytics = () => hasGoogle() || hasMeta();

/**
 * Fire a "lead" conversion (e.g. when the visitor opens WhatsApp or submits the
 * contact form). No-op if the providers aren't loaded / consent not granted.
 */
export function trackLead() {
  if (typeof window === 'undefined') return;
  if (window.gtag && TRACKING.GOOGLE_ADS_ID && TRACKING.GOOGLE_ADS_LABEL) {
    window.gtag('event', 'conversion', {
      send_to: `${TRACKING.GOOGLE_ADS_ID}/${TRACKING.GOOGLE_ADS_LABEL}`,
    });
  }
  if (window.fbq) window.fbq('track', 'Lead');
}
