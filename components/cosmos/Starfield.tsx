import React, { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';

export const Starfield: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const canvas = ref.current!; const ctx = canvas.getContext('2d')!;
    let raf = 0, w = 0, h = 0; const mouse = { x: 0, y: 0 };
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const count = Math.min(220, Math.floor((window.innerWidth * window.innerHeight) / 9000));
    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h, z: Math.random() * 0.8 + 0.2,
      r: Math.random() * 1.2 + 0.3, t: Math.random() * Math.PI * 2,
    }));
    const onMove = (e: MouseEvent) => { mouse.x = (e.clientX / w - 0.5); mouse.y = (e.clientY / h - 0.5); };
    window.addEventListener('mousemove', onMove);
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.t += 0.02; const tw = 0.6 + Math.sin(s.t) * 0.4;
        const px = s.x + mouse.x * 40 * s.z, py = s.y + mouse.y * 40 * s.z;
        ctx.beginPath(); ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(246,217,138,${0.5 * tw * s.z})`; ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); };
  }, [reduced]);
  if (reduced) return <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,#0b0e17,#05060a)]" />;
  return <canvas ref={ref} className="fixed inset-0 -z-10 pointer-events-none" />;
};
