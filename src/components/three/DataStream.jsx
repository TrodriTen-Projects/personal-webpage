/**
 * DataStream.jsx
 * ---------------------------------------------------------------------------
 * Decorative "Matrix rain" data streams - thin vertical line segments that
 * float slowly upward and loop back to the bottom.  Provides subtle digital
 * atmosphere without dominating the scene.
 *
 * Props
 * ─────
 *   count  number  How many stream lines (default 15)
 *   bounds number  XZ scatter radius (default 12)
 *   speed  number  Global speed multiplier (default 1)
 *
 * Each stream is a short vertical segment at a random X / Z position.  The
 * Y position increments every frame and wraps via modulo.  Opacity and
 * height vary per stream for visual variety.
 * ---------------------------------------------------------------------------
 */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── defaults ──────────────────────────────────────────────────────────── */
const Y_MIN = -10;
const Y_MAX = 10;
const Y_RANGE = Y_MAX - Y_MIN;
const SPEED_MIN = 0.008;
const SPEED_MAX = 0.025;
const HEIGHT_MIN = 0.5;
const HEIGHT_MAX = 2.0;

export default function DataStream({ count = 15, bounds = 12, speed: speedMul = 1 }) {
  const groupRef = useRef();

  /* ──────────────────────────────────────────────────────────────────
   * PRE-COMPUTE STREAM METADATA
   * Each stream gets a random X, Z, height, speed, and opacity.
   * The position buffer holds 2 verts per stream (top & bottom).
   * ────────────────────────────────────────────────────────────────── */
  const { streams, geometries } = useMemo(() => {
    const s = [];
    const g = [];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * bounds * 2;
      const z = (Math.random() - 0.5) * bounds * 2;
      const height = HEIGHT_MIN + Math.random() * (HEIGHT_MAX - HEIGHT_MIN);
      const baseSpd = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
      const opacity = 0.12 + Math.random() * 0.2;  // 0.12 → 0.32
      const yStart = Y_MIN + Math.random() * Y_RANGE;

      // Two-point buffer: bottom and top of the line segment
      const pos = new Float32Array(6); // 2 verts × 3
      pos[0] = x; pos[1] = yStart; pos[2] = z;
      pos[3] = x; pos[4] = yStart + height; pos[5] = z;

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

      s.push({ x, z, height, speed: baseSpd, opacity, y: yStart, positions: pos });
      g.push(geo);
    }

    return { streams: s, geometries: g };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, bounds]);

  /* ── per-frame: advance Y and wrap ──────────────────────────────── */
  useFrame(() => {
    for (let i = 0; i < streams.length; i++) {
      const st = streams[i];

      // Advance upward, scaled by the global speed multiplier
      st.y += st.speed * speedMul;

      // Wrap around when the bottom of the segment passes Y_MAX
      if (st.y > Y_MAX) {
        st.y = Y_MIN - st.height;
      }

      // Update the buffer directly
      st.positions[1] = st.y;
      st.positions[4] = st.y + st.height;

      geometries[i].attributes.position.needsUpdate = true;
    }
  });

  /* ── render ─────────────────────────────────────────────────────── */
  return (
    <group ref={groupRef}>
      {streams.map((s, i) => (
        <line key={i} geometry={geometries[i]}>
          <lineBasicMaterial
            color="#FFD700"
            transparent
            opacity={s.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}
    </group>
  );
}
