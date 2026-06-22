/**
 * CryptoCore.jsx
 * ---------------------------------------------------------------------------
 * Central 3D model of the cybersecurity portfolio hero. Contains the inner
 * layers of the composition:
 *
 *   1. Inner octahedron core — glass/transmission material, pulsing scale
 *   2. Three orbital torus rings — different axes, different speeds
 *   3. ShieldMesh — dual wireframe icosahedrons with edge glow
 *
 * ParticleNetwork and DataStream are rendered separately by Scene.jsx so
 * they can be positioned and configured independently.
 *
 * Props
 * ─────
 *   mouse    {x, y} | null   Normalised cursor position (-1 → 1)
 *   pathname string          Current route path
 *
 * When pathname !== '/', the entire model translates right to make room
 * for page content.
 * ---------------------------------------------------------------------------
 */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import ShieldMesh from './ShieldMesh';

/* ── tunables ──────────────────────────────────────────────────────────── */
const RING_RADIUS      = 1.6;
const RING_TUBE        = 0.015;
const RING_SEGMENTS    = 64;
const RING_TUBE_SEGS   = 8;
const PULSE_SPEED      = 1.2;       // oscillation Hz (approx)
const PULSE_AMPLITUDE  = 0.06;      // ±6 % scale swing

/* ── ring configs: rotation axis tilts & per-ring speed multiplier ──── */
const RING_CONFIGS = [
  { axis: new THREE.Euler(0, 0, 0),                speed: 0.003  },
  { axis: new THREE.Euler(Math.PI / 3, 0, Math.PI / 6), speed: -0.004 },
  { axis: new THREE.Euler(0, Math.PI / 4, Math.PI / 3), speed: 0.0025 },
];

export default function CryptoCore({ mouse, pathname = '/' }) {
  /* ── refs ────────────────────────────────────────────────────────── */
  const groupRef = useRef();
  const coreRef  = useRef();
  const ringsRef = useRef([]);
  const scanRef  = useRef();

  /* ── memoised ring material ──────────────────────────────────────── */
  const ringMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color:            '#FFD700',
        emissive:         '#FFD700',
        emissiveIntensity: 0.5,
        metalness:        0.7,
        roughness:        0.25,
        transparent:      true,
        opacity:          0.55,
      }),
    [],
  );

  /* ── per-frame animation ─────────────────────────────────────────── */
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    /* --- octahedron pulse ---------------------------------------- */
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * PULSE_SPEED) * PULSE_AMPLITUDE;
      coreRef.current.scale.setScalar(pulse);
      coreRef.current.rotation.y += 0.003;
      coreRef.current.rotation.x += 0.001;
    }

    /* --- orbital rings ------------------------------------------- */
    ringsRef.current.forEach((ring, i) => {
      if (!ring) return;
      const cfg = RING_CONFIGS[i];
      // Rotate around own Z (which is tilted via the Euler above)
      ring.rotation.z += cfg.speed;
    });

    /* --- holographic scan ring sweeping the vault vertically ----- *
     * A horizontal gold ring travels up & down, its radius following
     * the spherical cage profile so it looks like a security scan.   */
    if (scanRef.current) {
      const R = 2.15;
      const y = Math.sin(t * 0.5) * R;
      const ringR = Math.sqrt(Math.max(0.0001, R * R - y * y));
      scanRef.current.position.y = y;
      scanRef.current.scale.setScalar(ringR);
      scanRef.current.material.opacity = 0.55 * (ringR / R);
    }
  });

  return (
    <group>
      {/* ═══════════════════════════════════════════════════════════
       * LAYER 1 — Inner Octahedron Core
       * Glass-like transmission material for a holographic feel.
       * ═══════════════════════════════════════════════════════════ */}
      <group>
        <mesh ref={coreRef}>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#FFD700"
            metalness={0}
            roughness={0.05}
            transmission={0.95}
            ior={2.4}
            thickness={0.5}
            envMapIntensity={1}
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* ── Orbital torus rings ─────────────────────────────────── */}
        {RING_CONFIGS.map((cfg, i) => (
          <mesh
            key={i}
            ref={(el) => (ringsRef.current[i] = el)}
            rotation={cfg.axis}
            material={ringMat}
          >
            <torusGeometry args={[RING_RADIUS, RING_TUBE, RING_TUBE_SEGS, RING_SEGMENTS]} />
          </mesh>
        ))}

        {/* ── Holographic scan ring (vault scanner) ───────────────── */}
        <mesh ref={scanRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.012, 8, 96]} />
          <meshBasicMaterial
            color="#FFD700"
            transparent
            opacity={0.55}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════════
       * LAYER 2 — Shield Mesh (wireframe icosahedrons)
       * ═══════════════════════════════════════════════════════════ */}
      <group>
        <ShieldMesh mouse={mouse} />
      </group>
    </group>
  );
}
