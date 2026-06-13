/**
 * ShieldMesh.jsx
 * ---------------------------------------------------------------------------
 * Outer protective layer of the CryptoCore — two nested wireframe
 * icosahedrons that slowly rotate in opposite directions.  The outer shell
 * reacts to mouse proximity with a subtle scale-up, while an inner shell
 * adds depth.  A third, solid-but-nearly-invisible icosahedron sits between
 * them to fake an "edge glow" via additive-blended emissive material.
 * ---------------------------------------------------------------------------
 */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/* ── reusable scratch vectors (avoid GC in the render loop) ─────────── */
const _targetScale = new THREE.Vector3();

export default function ShieldMesh({ mouse }) {
  const outerRef = useRef();
  const innerRef = useRef();
  const glowRef  = useRef();

  /* ── material configs (memoised so we don't recreate every render) ── */
  const outerMat = useMemo(
    () => ({
      color:            '#FFD700',
      emissive:         '#FFD700',
      emissiveIntensity: 0.35,
      wireframe:        true,
      transparent:      true,
      opacity:          0.45,
      depthWrite:       false,
    }),
    [],
  );

  const innerMat = useMemo(
    () => ({
      color:            '#FFD700',
      emissive:         '#FFD700',
      emissiveIntensity: 0.2,
      wireframe:        true,
      transparent:      true,
      opacity:          0.18,
      depthWrite:       false,
    }),
    [],
  );

  const glowMat = useMemo(
    () => ({
      color:            '#FFD700',
      emissive:         '#FFD700',
      emissiveIntensity: 0.6,
      transparent:      true,
      opacity:          0.07,
      blending:         THREE.AdditiveBlending,
      side:             THREE.BackSide,
      depthWrite:       false,
    }),
    [],
  );

  /* ── per-frame animation ──────────────────────────────────────────── */
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    /* --- outer icosahedron rotation + hover scale --- */
    if (outerRef.current) {
      outerRef.current.rotation.y += 0.0012;
      outerRef.current.rotation.x += 0.0006;

      // Smooth scale lerp toward target on hover
      const hoverScale = mouse ? 1.08 : 1.0;
      _targetScale.set(hoverScale, hoverScale, hoverScale);
      outerRef.current.scale.lerp(_targetScale, 0.045);
    }

    /* --- inner icosahedron — counter-rotate, slightly faster --- */
    if (innerRef.current) {
      innerRef.current.rotation.y -= 0.0018;
      innerRef.current.rotation.x -= 0.0009;
      innerRef.current.rotation.z += 0.0004;

      // Subtle breathing on the inner shell
      const breath = 1.0 + Math.sin(t * 0.8) * 0.015;
      innerRef.current.scale.setScalar(breath);
    }

    /* --- glow shell tracks outer rotation --- */
    if (glowRef.current && outerRef.current) {
      glowRef.current.rotation.copy(outerRef.current.rotation);

      // Pulse the glow opacity based on time
      glowRef.current.material.opacity = 0.06 + Math.sin(t * 1.2) * 0.025;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.45}>
      <group>
        {/* ── Outer wireframe icosahedron (detail 1 = 42 verts) ───── */}
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[2.2, 1]} />
          <meshStandardMaterial {...outerMat} />
        </mesh>

        {/* ── Inner wireframe icosahedron (detail 2 = 162 verts) ──── */}
        <mesh ref={innerRef}>
          <icosahedronGeometry args={[2.0, 2]} />
          <meshStandardMaterial {...innerMat} />
        </mesh>

        {/* ── Edge-glow shell (solid, back-side, additive) ────────── */}
        <mesh ref={glowRef}>
          <icosahedronGeometry args={[2.35, 1]} />
          <meshStandardMaterial {...glowMat} />
        </mesh>
      </group>
    </Float>
  );
}
