/**
 * Design Tokens & Configuration Constants
 *
 * Central source of truth for colors, particle settings,
 * scroll pagination, and responsive breakpoints.
 */

// ─── Color Palette ──────────────────────────────────────────────────────────
export const COLORS = {
  background: '#050505',
  surface: '#0A0A0A',
  border: '#1A1A1A',
  textPrimary: '#F5F5F5',
  textSecondary: '#888888',
  accent: '#FFD700',
  accentAlt: '#EAE041',
  glow: '#FFD70066',
};

// ─── 3D Particle Network Configuration ──────────────────────────────────────
export const PARTICLE_CONFIG = {
  count: 2000,
  mobileCount: 800,
  maxConnections: 300,
  connectionDistance: 0.8,
  repulsionRadius: 2,
  sphereRadius: { min: 4, max: 8 },
  size: { min: 0.015, max: 0.04 },
};

// ─── Scroll-based Page Count (react-three/drei <ScrollControls>) ────────────
export const SCROLL_PAGES = 6;

// ─── Responsive Breakpoints (px) ────────────────────────────────────────────
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
};
