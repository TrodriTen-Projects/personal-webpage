import { useEffect } from 'react';
import { TRACKING } from '@/lib/tracking';

/**
 * Loads gtag.js (Google Analytics 4 + Google Ads). The gtag bootstrap runs as
 * bundled app JS (script-src 'self'); only the external loader needs
 * googletagmanager.com in the CSP - so no 'unsafe-inline' is required.
 * Mounted only after consent (see Analytics.jsx).
 */
export default function GoogleAnalytics() {
  useEffect(() => {
    const id = TRACKING.GA_ID || TRACKING.GOOGLE_ADS_ID;
    if (!id || window.gtag) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    if (TRACKING.GA_ID) window.gtag('config', TRACKING.GA_ID, { anonymize_ip: true });
    if (TRACKING.GOOGLE_ADS_ID) window.gtag('config', TRACKING.GOOGLE_ADS_ID);
  }, []);

  return null;
}
