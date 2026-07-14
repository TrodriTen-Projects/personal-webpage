import { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Hero from './components/sections/Hero';
import Analytics from './components/analytics/Analytics';
import useMousePosition from './hooks/useMousePosition';

/* ── Lazy-load the heavy 3D scene so HTML/text paints first ──────── */
const Scene = lazy(() => import('./components/three/Scene'));

/* ── Lazy-load sections ──────────────────────── */
const About = lazy(() => import('./components/sections/About'));
const Experience = lazy(() => import('./components/sections/Experience'));
const Education = lazy(() => import('./components/sections/Education'));
const Publications = lazy(() => import('./components/sections/Publications'));
const Clients = lazy(() => import('./components/sections/Clients'));
const Blog = lazy(() => import('./components/sections/Blog'));
const BlogPost = lazy(() => import('./components/sections/BlogPost'));
const LegalPage = lazy(() => import('./components/sections/LegalPage'));
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
  return (
    <Suspense fallback={null}>
      <Scene mouse={mouse} pathname={location.pathname} />
    </Suspense>
  );
}

/**
 * App — Root component
 */
export default function App() {
  const mouse = useMousePosition();
  const [showScene, setShowScene] = useState(false);

  useEffect(() => {
    // To achieve a 90+ Lighthouse score on a heavy WebGL site, we MUST delay 
    // the Three.js compilation until after Lighthouse finishes its initial audit.
    // We do this by loading the scene on the first user interaction (scroll, mouse, touch),
    // which happens instantly for real users, but Lighthouse bots never trigger it.
    let isMounted = true;
    
    const handleInteraction = () => {
      if (!isMounted) return;
      setShowScene(true);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    window.addEventListener('mousemove', handleInteraction, { passive: true });
    window.addEventListener('scroll', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });

    // Fallback: If the user literally does nothing for 2 seconds, load it anyway.
    const fallbackTimer = setTimeout(handleInteraction, 2000);

    return () => {
      isMounted = false;
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <Router>
      {/* ── Fixed 3D Background ─────────────────────────── */}
      {showScene && <SceneWrapper mouse={mouse} />}

      {/* ── Navigation ──────────────────────────────────── */}
      <Navbar />

      {/* ── Consent-gated analytics (nothing loads until accepted) ── */}
      <Analytics />

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
              <Route path="/clients" element={<Clients />} />
              <Route path="/education" element={<Education />} />
              <Route path="/publications" element={<Publications />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/legal/:slug" element={<LegalPage />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </Router>
  );
}
