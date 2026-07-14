import { useState, useEffect, useCallback } from 'react';

/**
 * useMousePosition - Tracks normalized mouse position (-1 to 1)
 * Used to drive 3D interactions (particle repulsion, shield scale, etc.)
 */
export default function useMousePosition() {
  const [mouse, setMouse] = useState({ x: 0, y: 0, isActive: false });

  const handleMouseMove = useCallback((e) => {
    setMouse({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
      isActive: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouse((prev) => ({ ...prev, isActive: false }));
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return mouse;
}
