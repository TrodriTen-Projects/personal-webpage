import { useEffect } from 'react';
import { TRACKING } from '@/lib/tracking';

/**
 * Loads the Meta (Facebook) Pixel. The fbq stub runs as bundled app JS; only
 * the external fbevents.js loader needs connect.facebook.net in the CSP (no
 * 'unsafe-inline'). Mounted only after consent.
 */
export default function FacebookPixel() {
  useEffect(() => {
    if (!TRACKING.FB_PIXEL_ID || window.fbq) return;

    const fbq = function fbq() {
      fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
    };
    window.fbq = fbq;
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);

    window.fbq('init', TRACKING.FB_PIXEL_ID);
    window.fbq('track', 'PageView');
  }, []);

  return null;
}
