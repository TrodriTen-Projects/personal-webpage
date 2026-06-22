import { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, Preload } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Vignette,
  Glitch,
} from '@react-three/postprocessing';
import { GlitchMode } from 'postprocessing';
import * as THREE from 'three';
import CryptoCore from './CryptoCore';
import ParticleNetwork from './ParticleNetwork';
import DataStream from './DataStream';
import { useFrame } from '@react-three/fiber';

/**
 * AnimatedLayer — wraps the core and particles and translates them
 * depending on the current route.
 */
function AnimatedLayer({ pathname, mouse }) {
  const groupRef = useRef();

  useFrame(() => {
    if (!groupRef.current) return;
    const targetX = pathname === '/' ? 0 : 3;
    const targetScale = pathname === '/' ? 1 : 0.7;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.05));
  });

  return (
    <group ref={groupRef}>
      <CryptoCore mouse={mouse} pathname={pathname} />
      <ParticleNetwork mouse={mouse} />
    </group>
  );
}

/**
 * SceneContent — All 3D elements inside the Canvas
 */
function SceneContent({ mouse, pathname }) {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    setGlitchActive(true);
    const timeout = setTimeout(() => setGlitchActive(false), 300);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {/* ── Lighting ──────────────────────────────────── */}
      <ambientLight intensity={0.15} />
      <pointLight
        position={[10, 10, 10]}
        intensity={0.8}
        color="#FFD700"
      />
      <pointLight
        position={[-10, -5, -10]}
        intensity={0.3}
        color="#F5F5F5"
      />
      <directionalLight
        position={[0, 5, 5]}
        intensity={0.4}
        color="#FFFFFF"
      />

      {/* ── Background stars ──────────────────────────── */}
      <Stars
        radius={80}
        depth={60}
        count={1500}
        factor={3}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* ── Data streams (Matrix rain) ────────────────── */}
      <DataStream count={20} bounds={14} speed={0.25} />

      {/* ── Main animated layer (Core + Particles) ────── */}
      <AnimatedLayer pathname={pathname} mouse={mouse} />

      {/* ── Postprocessing effects ────────────────────── */}
      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          intensity={1.1}
          mipmapBlur
        />
        <Vignette
          eskil={false}
          offset={0.15}
          darkness={0.85}
        />
        {glitchActive && (
          <Glitch
            delay={new THREE.Vector2(0, 0)}
            duration={new THREE.Vector2(0.1, 0.3)}
            strength={new THREE.Vector2(0.1, 0.3)}
            mode={GlitchMode.SPORADIC}
            active
            ratio={0.85}
          />
        )}
      </EffectComposer>

      <Preload all />
    </>
  );
}

/**
 * Scene — Main 3D Canvas wrapper
 * Manages the R3F Canvas, camera, and passes mouse/pathname data to children.
 */
export default function Scene({ mouse, pathname }) {
  return (
    <div
      id="scene-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{
          position: [0, 0, 8],
          fov: 55,
          near: 0.1,
          far: 200,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: '#050505' }}
      >
        <SceneContent
          mouse={mouse}
          pathname={pathname}
        />
      </Canvas>
    </div>
  );
}
