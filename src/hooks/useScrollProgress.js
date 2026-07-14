import { useState, useEffect, useCallback } from 'react';

/**
 * useScrollProgress - Tracks normalized scroll progress (0 to 1)
 * Falls back to standard window scroll when outside R3F ScrollControls.
 */
export default function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [velocity, setVelocity] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const newProgress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

    setVelocity(Math.abs(newProgress - progress));
    setProgress(newProgress);
  }, [progress]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { progress, velocity };
}
