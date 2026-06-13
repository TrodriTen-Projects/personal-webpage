import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Scene from './components/three/Scene';
import Navbar from './components/Layout/Navbar';
import Hero from './components/sections/Hero';
import useMousePosition from './hooks/useMousePosition';

/* ── Lazy-load sections ──────────────────────── */
const About = lazy(() => import('./components/sections/About'));
const Experience = lazy(() => import('./components/sections/Experience'));
const Education = lazy(() => import('./components/sections/Education'));
const Publications = lazy(() => import('./components/sections/Publications'));
const Contact = lazy(() => import('./components/sections/Contact'));

/* ── Section fallback ──────────────────────────────────── */
const SectionFallback = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <span className="mono accent-text" style={{ opacity: 0.5 }}>
      ▓▓▓ DECRYPTING ▓▓▓
    </span>
  </div>
);

/**
 * SceneWrapper — Passes the current pathname down to Scene
 */
function SceneWrapper({ mouse }) {
  const location = useLocation();
  return <Scene mouse={mouse} pathname={location.pathname} />;
}

/**
 * App — Root component
 */
export default function App() {
  const mouse = useMousePosition();

  return (
    <Router>
      {/* ── Fixed 3D Background ─────────────────────────── */}
      <SceneWrapper mouse={mouse} />

      {/* ── Navigation ──────────────────────────────────── */}
      <Navbar />

      {/* ── Scrollable HTML Sections ────────────────────── */}
      <main
        style={{
          position: 'relative',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          <Suspense fallback={<SectionFallback />}>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/about" element={<About />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/education" element={<Education />} />
              <Route path="/publications" element={<Publications />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </Router>
  );
}
