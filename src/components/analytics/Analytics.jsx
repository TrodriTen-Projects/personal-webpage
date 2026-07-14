import { useConsent } from '@/hooks/useConsent';
import { hasAnalytics } from '@/lib/tracking';
import GoogleAnalytics from './GoogleAnalytics';
import FacebookPixel from './FacebookPixel';
import CookieConsent from './CookieConsent';

/**
 * Consent-gated analytics. Nothing is loaded until the visitor accepts. If no
 * tracking IDs are configured at all, the banner is skipped entirely (there is
 * nothing to consent to).
 */
export default function Analytics() {
  const { consent, accept, reject } = useConsent();

  if (!hasAnalytics()) return null;

  return (
    <>
      {consent === 'granted' && (
        <>
          <GoogleAnalytics />
          <FacebookPixel />
        </>
      )}
      {consent === 'unset' && <CookieConsent onAccept={accept} onReject={reject} />}
    </>
  );
}
