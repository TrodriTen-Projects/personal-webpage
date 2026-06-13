/**
 * ParticleNetwork.jsx
 * ---------------------------------------------------------------------------
 * A reactive particle swarm arranged in a spherical shell.  2 000 particles
 * are distributed between radius 4–8 using Fibonacci-sphere sampling.  The
 * system reacts to mouse position: particles inside a repulsion radius are
 * pushed outward, and all particles spring back to their resting positions
 * when the cursor leaves.
 *
 * Nearby particles (distance < threshold) are connected by translucent lines,
 * rendered as a single `<lineSegments>` call with a pre-allocated buffer for
 * maximum performance (no React re-renders, no GC).
 *
 * PERFORMANCE NOTES
 * -  All position arrays are Float32Array, allocated once via useMemo.
 * -  useFrame mutates the buffers directly and flips `needsUpdate`.
 * -  Connection lines use a fixed-size buffer (MAX_LINES * 2 * 3 floats).
 * ---------------------------------------------------------------------------
 */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── tunables ──────────────────────────────────────────────────────────── */
const PARTICLE_COUNT    = 2000;
const SHELL_INNER       = 4.0;
const SHELL_OUTER       = 8.0;
const REPULSION_RADIUS  = 2.5;
const REPULSION_FORCE   = 0.12;
const SPRING_FACTOR     = 0.018;
const CONNECT_DIST      = 0.8;
const MAX_LINES         = 350;
const ROTATION_SPEED    = 0.0004;
const PARTICLE_SIZE     = 0.022;

/* ── scratch vectors (reused per-frame, avoid alloc) ───────────────── */
const _mouse3D = new THREE.Vector3();
const _particlePos = new THREE.Vector3();
const _pushDir = new THREE.Vector3();
const _original = new THREE.Vector3();

export default function ParticleNetwork({ mouse }) {
  const groupRef = useRef();
  const pointsRef = useRef();
  const linesRef = useRef();

  /* ──────────────────────────────────────────────────────────────────
   * INITIALISE PARTICLE POSITIONS
   * Fibonacci-sphere + random radial jitter for a natural look.
   * We keep two typed arrays: `positions` (mutable) and `origins`
   * (immutable rest state).
   * ────────────────────────────────────────────────────────────────── */
  const { positions, origins, colors } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const orig = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);

    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ≈ 2.3999…

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Fibonacci-sphere direction
      const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2; // −1 → 1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;

      const dx = Math.cos(theta) * radiusAtY;
      const dy = y;
      const dz = Math.sin(theta) * radiusAtY;

      // Random radius within the shell band
      const r = SHELL_INNER + Math.random() * (SHELL_OUTER - SHELL_INNER);

      const i3 = i * 3;
      pos[i3]     = dx * r;
      pos[i3 + 1] = dy * r;
      pos[i3 + 2] = dz * r;

      // Store the rest positions
      orig[i3]     = pos[i3];
      orig[i3 + 1] = pos[i3 + 1];
      orig[i3 + 2] = pos[i3 + 2];

      // Warm gold with slight variation per particle
      const luminance = 0.85 + Math.random() * 0.15;
      col[i3]     = 1.0   * luminance;  // R
      col[i3 + 1] = 0.843 * luminance;  // G  (#FFD700 ≈ 1.0, 0.843, 0.0)
      col[i3 + 2] = 0.0   * luminance;  // B
    }

    return { positions: pos, origins: orig, colors: col };
  }, []);

  /* ──────────────────────────────────────────────────────────────────
   * INITIALISE CONNECTION-LINE BUFFER
   * Pre-allocate enough room for MAX_LINES segments (2 verts each).
   * Unused verts are zeroed out so they collapse to invisible points.
   * ────────────────────────────────────────────────────────────────── */
  const { linePositions, lineColors, lineGeometry } = useMemo(() => {
    const lp = new Float32Array(MAX_LINES * 2 * 3); // 2 endpoints × 3 coords
    const lc = new Float32Array(MAX_LINES * 2 * 3); // per-vertex color

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(lp, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(lc, 3));
    geo.setDrawRange(0, 0); // start with nothing visible

    return { linePositions: lp, lineColors: lc, lineGeometry: geo };
  }, []);

  /* ──────────────────────────────────────────────────────────────────
   * PER-FRAME LOGIC
   * ────────────────────────────────────────────────────────────────── */
  useFrame(() => {
    if (!pointsRef.current || !linesRef.current || !groupRef.current) return;

    /* --- slow global rotation ------------------------------------ */
    groupRef.current.rotation.y += ROTATION_SPEED;
    groupRef.current.rotation.x += ROTATION_SPEED * 0.3;

    /* --- project 2D mouse → 3D position (simple mapping) --------- */
    const hasMouse = mouse && (mouse.x !== 0 || mouse.y !== 0);
    if (hasMouse) {
      _mouse3D.set(mouse.x * 6, mouse.y * 6, 0);
    }

    /* --- update each particle ------------------------------------ */
    const posAttr = pointsRef.current.geometry.attributes.position;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      _particlePos.set(positions[i3], positions[i3 + 1], positions[i3 + 2]);

      if (hasMouse) {
        const dx = _particlePos.x - _mouse3D.x;
        const dy = _particlePos.y - _mouse3D.y;
        const dz = _particlePos.z - _mouse3D.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < REPULSION_RADIUS && dist > 0.001) {
          // Push away from cursor
          const force = (1 - dist / REPULSION_RADIUS) * REPULSION_FORCE;
          _pushDir.set(dx, dy, dz).normalize().multiplyScalar(force);
          positions[i3]     += _pushDir.x;
          positions[i3 + 1] += _pushDir.y;
          positions[i3 + 2] += _pushDir.z;
        }
      }

      // Spring back toward origin
      _original.set(origins[i3], origins[i3 + 1], origins[i3 + 2]);
      positions[i3]     += (_original.x - positions[i3])     * SPRING_FACTOR;
      positions[i3 + 1] += (_original.y - positions[i3 + 1]) * SPRING_FACTOR;
      positions[i3 + 2] += (_original.z - positions[i3 + 2]) * SPRING_FACTOR;
    }

    // Flag the buffer for GPU upload
    posAttr.needsUpdate = true;

    /* --- build connection lines between nearby particles --------- *
     * Only check a subset of particle pairs per frame for perf.     *
     * We use a sliding-window approach with index stride.            */
    let lineCount = 0;
    const stride = 6; // check every 6th particle for connections

    outer:
    for (let i = 0; i < PARTICLE_COUNT; i += stride) {
      const ax = positions[i * 3];
      const ay = positions[i * 3 + 1];
      const az = positions[i * 3 + 2];

      for (let j = i + stride; j < PARTICLE_COUNT; j += stride) {
        const bx = positions[j * 3];
        const by = positions[j * 3 + 1];
        const bz = positions[j * 3 + 2];

        const dx = ax - bx;
        const dy = ay - by;
        const dz = az - bz;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < CONNECT_DIST * CONNECT_DIST) {
          const idx = lineCount * 6; // 2 verts × 3 floats
          linePositions[idx]     = ax;
          linePositions[idx + 1] = ay;
          linePositions[idx + 2] = az;
          linePositions[idx + 3] = bx;
          linePositions[idx + 4] = by;
          linePositions[idx + 5] = bz;

          // Fade colour by distance
          const dist01 = Math.sqrt(distSq) / CONNECT_DIST;
          const alpha  = 1 - dist01; // 1 = close, 0 = far
          lineColors[idx]     = alpha;
          lineColors[idx + 1] = 0.843 * alpha;
          lineColors[idx + 2] = 0.0;
          lineColors[idx + 3] = alpha;
          lineColors[idx + 4] = 0.843 * alpha;
          lineColors[idx + 5] = 0.0;

          lineCount++;
          if (lineCount >= MAX_LINES) break outer;
        }
      }
    }

    // Zero out unused vertices so they don't render as stale lines
    for (let k = lineCount * 6; k < MAX_LINES * 6; k++) {
      linePositions[k] = 0;
      lineColors[k] = 0;
    }

    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;
    lineGeometry.setDrawRange(0, lineCount * 2);
  });

  /* ── JSX ─────────────────────────────────────────────────────────── */
  return (
    <group ref={groupRef}>
      {/* ── Particle cloud ──────────────────────────────────────── */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={PARTICLE_COUNT}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={PARTICLE_SIZE}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* ── Connection lines ────────────────────────────────────── */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.25}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
