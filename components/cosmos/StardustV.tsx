import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';

const COUNT = 3000;

function vTarget(i: number): [number, number, number] {
  const t = (i % (COUNT / 2)) / (COUNT / 2);
  const onRing = i > COUNT * 0.85;
  if (onRing) {
    const a = t * Math.PI * 2;
    return [Math.cos(a) * 3.2, Math.sin(a) * 3.2, (Math.random() - 0.5) * 0.4];
  }
  const left = i < COUNT / 2;
  const x = left ? -1.6 + t * 1.6 : 1.6 - t * 1.6;
  const y = 1.8 - t * 3.6;
  return [x, y, (Math.random() - 0.5) * 0.3];
}

const Cloud: React.FC<{ scatterRef: React.MutableRefObject<number> }> = ({ scatterRef }) => {
  const ref = useRef<THREE.Points>(null);

  const { positions, targets, scatter, wander } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const targets = new Float32Array(COUNT * 3);
    const scatter = new Float32Array(COUNT * 3); // dispersed cloud position
    const wander = new Float32Array(COUNT * 3); // phase, freq, amp seeds
    for (let i = 0; i < COUNT; i++) {
      positions.set(
        [(Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14],
        i * 3,
      );
      targets.set(vTarget(i), i * 3);
      // wide scattered destination when fully dispersed
      const ang = Math.random() * Math.PI * 2;
      const rad = 4 + Math.random() * 5;
      scatter.set([Math.cos(ang) * rad, (Math.random() - 0.5) * 9, Math.sin(ang) * rad - 1], i * 3);
      wander.set([Math.random() * Math.PI * 2, 0.4 + Math.random() * 0.8, 0.5 + Math.random()], i * 3);
    }
    return { positions, targets, scatter, wander };
  }, []);

  // Smoothed scatter value so scroll feels fluid
  const s = useRef(0);

  useFrame((state) => {
    if (!ref.current) return;
    const target = scatterRef.current;
    s.current += (target - s.current) * 0.08;
    const k = s.current;
    const tElapsed = state.clock.elapsedTime;

    const g = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = g.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = ix + 2;
      // blend V target with the scattered cloud
      const baseX = targets[ix] * (1 - k) + scatter[ix] * k;
      const baseY = targets[iy] * (1 - k) + scatter[iy] * k;
      const baseZ = targets[iz] * (1 - k) + scatter[iz] * k;
      // continuous wander — gentle when formed, roaming when scattered
      const amp = 0.05 + k * 0.7;
      const ph = wander[ix];
      const fr = wander[iy];
      const wx = Math.sin(tElapsed * fr + ph) * amp;
      const wy = Math.cos(tElapsed * fr * 0.9 + ph) * amp;
      const wz = Math.sin(tElapsed * fr * 1.1 + ph) * amp;
      arr[ix] += (baseX + wx - arr[ix]) * 0.04;
      arr[iy] += (baseY + wy - arr[iy]) * 0.04;
      arr[iz] += (baseZ + wz - arr[iz]) * 0.04;
    }
    g.needsUpdate = true;

    ref.current.rotation.y =
      Math.sin(tElapsed * 0.1) * 0.15 + state.pointer.x * 0.2 + k * tElapsed * 0.05;
    ref.current.rotation.x = state.pointer.y * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#F6D98A" sizeAttenuation transparent opacity={0.9} />
    </points>
  );
};

export const StardustV: React.FC = () => {
  const reduced = usePrefersReducedMotion();
  const scatterRef = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      // Fully scattered once you've scrolled ~70% of a viewport past the top.
      const span = window.innerHeight * 0.7;
      scatterRef.current = Math.min(1, Math.max(0, window.scrollY / span));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduced]);

  if (reduced) {
    return (
      <svg viewBox="0 0 120 120" className="w-48 h-48 mx-auto text-gold" aria-hidden>
        <path d="M30 30 L60 90 L90 30" fill="none" stroke="currentColor" strokeWidth="4" />
      </svg>
    );
  }

  return (
    <div className="w-full h-[46vh] min-h-[320px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.8]}>
        <Suspense fallback={null}>
          <Cloud scatterRef={scatterRef} />
        </Suspense>
      </Canvas>
    </div>
  );
};
