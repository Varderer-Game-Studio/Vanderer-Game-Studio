import React, { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';

interface Star {
  x: number;
  y: number;
  z: number; // depth 0.15..1 — drives size, brightness, parallax
  r: number;
  t: number; // twinkle phase
  tw: number; // twinkle speed
  hue: 'gold' | 'white' | 'blue';
}

interface Shooting {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  len: number;
}

const HUES: Record<Star['hue'], [number, number, number]> = {
  gold: [246, 217, 138],
  white: [226, 232, 245],
  blue: [150, 180, 235],
};

export const Starfield: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    let stars: Star[] = [];
    const shooters: Shooting[] = [];

    const seed = () => {
      // Dense field — scales with viewport area, capped for perf.
      const count = Math.min(900, Math.floor((w * h) / 2200));
      stars = Array.from({ length: count }, () => {
        const z = Math.pow(Math.random(), 1.6) * 0.85 + 0.15;
        const roll = Math.random();
        const hue: Star['hue'] = roll > 0.82 ? 'gold' : roll > 0.64 ? 'blue' : 'white';
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: z * 1.4 + 0.25,
          t: Math.random() * Math.PI * 2,
          tw: 0.004 + Math.random() * 0.02,
          hue,
        };
      });
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      mouse.tx = e.clientX / w - 0.5;
      mouse.ty = e.clientY / h - 0.5;
    };
    window.addEventListener('mousemove', onMove);

    const spawnShooter = () => {
      const fromLeft = Math.random() > 0.5;
      const speed = 6 + Math.random() * 5;
      const angle = (Math.random() * 0.3 + 0.15) * Math.PI; // downward diagonal
      shooters.push({
        x: fromLeft ? -40 : w + 40,
        y: Math.random() * h * 0.5,
        vx: (fromLeft ? 1 : -1) * Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        len: 80 + Math.random() * 120,
      });
    };

    const tick = () => {
      // ease mouse for smooth parallax
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        s.t += s.tw;
        const tw = 0.55 + Math.sin(s.t) * 0.45;
        const px = s.x + mouse.x * 60 * s.z;
        const py = s.y + mouse.y * 60 * s.z;
        const [rr, gg, bb] = HUES[s.hue];
        const alpha = Math.min(1, 0.45 * tw + s.z * 0.4);
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rr},${gg},${bb},${alpha})`;
        ctx.fill();
        // faint glow on the brightest near stars
        if (s.z > 0.75) {
          ctx.beginPath();
          ctx.arc(px, py, s.r * 2.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rr},${gg},${bb},${0.06 * tw})`;
          ctx.fill();
        }
      }

      // shooting stars
      if (Math.random() < 0.004 && shooters.length < 2) spawnShooter();
      for (let i = shooters.length - 1; i >= 0; i--) {
        const sh = shooters[i];
        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life -= 0.012;
        const tailX = sh.x - sh.vx * (sh.len / 8);
        const tailY = sh.y - sh.vy * (sh.len / 8);
        const grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY);
        grad.addColorStop(0, `rgba(246,217,138,${0.8 * sh.life})`);
        grad.addColorStop(1, 'rgba(246,217,138,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        if (sh.life <= 0 || sh.x < -60 || sh.x > w + 60 || sh.y > h + 60) shooters.splice(i, 1);
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,#0b0e17,#05060a)]" />
    );
  }

  return (
    <>
      {/* Deep nebula base sits behind the moving field */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_-10%,#10131f_0%,#070912_45%,#05060a_100%)]" />
      <canvas ref={ref} className="fixed inset-0 -z-10 pointer-events-none" />
    </>
  );
};
