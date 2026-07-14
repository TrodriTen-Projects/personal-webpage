import { useState, useEffect, useCallback } from 'react';

const KEY = 'cookie-consent'; // 'granted' | 'denied'

/**
 * Cookie-consent state, persisted in localStorage. 'unset' until the visitor
 * chooses. Analytics scripts are only mounted when consent === 'granted'.
 */
export function useConsent() {
  const [consent, setConsent] = useState('unset');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored === 'granted' || stored === 'denied') setConsent(stored);
    } catch {
      /* localStorage unavailable (private mode) - stay 'unset' */
    }
  }, []);

  const set = useCallback((value) => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setConsent(value);
  }, []);

  return {
    consent,
    accept: useCallback(() => set('granted'), [set]),
    reject: useCallback(() => set('denied'), [set]),
  };
}
