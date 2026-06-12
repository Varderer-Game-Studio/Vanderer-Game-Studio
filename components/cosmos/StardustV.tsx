import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';

const COUNT = 3000;
function vTarget(i: number): [number, number, number] {
  const t = (i % (COUNT / 2)) / (COUNT / 2);
  const onRing = i > COUNT * 0.85;
  if (onRing) { const a = t * Math.PI * 2; return [Math.cos(a) * 3.2, Math.sin(a) * 3.2, (Math.random() - 0.5) * 0.4]; }
  const left = i < COUNT / 2; const x = left ? -1.6 + t * 1.6 : 1.6 - t * 1.6;
  const y = 1.8 - t * 3.6; return [x, y, (Math.random() - 0.5) * 0.3];
}
const Cloud: React.FC = () => {
  const ref = useRef<THREE.Points>(null);
  const { positions, targets } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3); const targets = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions.set([(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12], i * 3);
      targets.set(vTarget(i), i * 3);
    }
    return { positions, targets };
  }, []);
  useFrame((state) => {
    if (!ref.current) return;
    const g = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = g.array as Float32Array;
    for (let i = 0; i < arr.length; i++) arr[i] += (targets[i] - arr[i]) * 0.02;
    g.needsUpdate = true;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.15 + state.pointer.x * 0.2;
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
  if (reduced) return (
    <svg viewBox="0 0 120 120" className="w-48 h-48 mx-auto text-gold" aria-hidden>
      <path d="M30 30 L60 90 L90 30" fill="none" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
  return (
    <div className="w-full h-[46vh] min-h-[320px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.8]}>
        <Suspense fallback={null}><Cloud /></Suspense>
      </Canvas>
    </div>
  );
};
