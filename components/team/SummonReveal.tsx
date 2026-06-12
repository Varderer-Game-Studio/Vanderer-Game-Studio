import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Wrench, ExternalLink } from 'lucide-react';
import { TeamMember } from '../../types';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';

interface SummonRevealProps {
  member: TeamMember;
  onClose: () => void;
}

/** Lightweight stardust burst that converges into the portrait, then fades. */
const StardustBurst: React.FC<{ accent: string }> = ({ accent }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { clientWidth: w, clientHeight: h } = canvas;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const cx = w / 2;
    const cy = h * 0.42;
    const count = 130;
    const particles = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.max(w, h) * (0.5 + Math.random() * 0.5);
      return {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        tx: cx + (Math.random() - 0.5) * w * 0.6,
        ty: cy + (Math.random() - 0.5) * h * 0.4,
        size: 0.6 + Math.random() * 1.8,
      };
    });

    const duration = 850;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of particles) {
        const x = p.x + (p.tx - p.x) * ease;
        const y = p.y + (p.ty - p.y) * ease;
        ctx.globalAlpha = (1 - t) * 0.9;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.fill();
      }
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [accent]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
};

const SummonReveal: React.FC<SummonRevealProps> = ({ member, onClose }) => {
  const reduced = usePrefersReducedMotion();
  const [resolved, setResolved] = useState(reduced);
  const [imgFailed, setImgFailed] = useState(false);
  const initial = member.name.charAt(0).toUpperCase();

  // Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Portrait resolves in after the burst (skipped under reduced motion)
  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(() => setResolved(true), 550);
    return () => clearTimeout(id);
  }, [reduced]);

  const portfolioReady = Boolean(member.portfolioUrl);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-void/85 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${member.name} — ${member.clazz}`}
        initial={reduced ? false : { scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative grid w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-lg border bg-deep shadow-[0_0_60px_-10px_rgba(0,0,0,0.8)] md:grid-cols-[minmax(0,42%)_1fr]"
        style={{ borderColor: `${member.accent}40` }}
      >
        {/* Top accent line */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${member.accent}, transparent)` }}
        />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 text-ink-dim hover:text-ink transition-colors"
        >
          <X size={20} />
        </button>

        {/* Portrait side */}
        <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[420px] overflow-hidden bg-surface">
          {!imgFailed ? (
            <img
              src={member.avatarUrl}
              alt={member.name}
              onError={() => setImgFailed(true)}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
              style={{ opacity: resolved ? 1 : 0 }}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-700"
              style={{ opacity: resolved ? 1 : 0 }}
            >
              <span
                className="absolute inset-0 opacity-30"
                style={{ background: `radial-gradient(circle at 50% 40%, ${member.accent}, transparent 70%)` }}
              />
              <span className="font-display text-8xl font-black" style={{ color: member.accent }}>
                {initial}
              </span>
            </div>
          )}

          {/* Accent flash on resolve */}
          {!reduced && (
            <motion.span
              className="pointer-events-none absolute inset-0"
              style={{ background: `radial-gradient(circle at 50% 42%, ${member.accent}, transparent 60%)` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0] }}
              transition={{ duration: 0.6, delay: 0.5, times: [0, 0.4, 1] }}
            />
          )}

          {!resolved && !reduced && <StardustBurst accent={member.accent} />}

          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/90 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-deep/30" />
        </div>

        {/* Detail side */}
        <motion.div
          className="relative overflow-y-auto p-7 md:p-8"
          initial={reduced ? false : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: reduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="font-sans text-xs uppercase tracking-[0.22em]"
            style={{ color: member.accent }}
          >
            {member.clazz}
          </p>
          <h2 className="mt-1 font-display text-3xl text-ink leading-tight">{member.name}</h2>
          <p className="mt-1 font-sans text-sm text-ink-dim">{member.role}</p>

          <p className="mt-4 font-sans text-sm leading-relaxed text-ink-dim italic">
            {member.classDescription}
          </p>

          <p className="mt-4 font-sans text-sm leading-relaxed text-ink">{member.bio}</p>

          {/* Specialties */}
          <div className="mt-6">
            <div className="flex items-center gap-2 text-ink-dim">
              <Sparkles size={14} style={{ color: member.accent }} />
              <span className="font-sans text-[11px] uppercase tracking-[0.18em]">Specialties</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {member.specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full border px-3 py-1 font-sans text-xs text-ink"
                  style={{ borderColor: `${member.accent}50` }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="mt-5">
            <div className="flex items-center gap-2 text-ink-dim">
              <Wrench size={14} style={{ color: member.accent }} />
              <span className="font-sans text-[11px] uppercase tracking-[0.18em]">Tools</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {member.tools.map((t) => (
                <span key={t} className="font-sans text-xs text-ink-dim">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          <div className="mt-7">
            {portfolioReady ? (
              <a
                href={member.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm px-5 py-2.5 font-sans text-sm font-medium text-void transition-colors"
                style={{ backgroundColor: member.accent }}
              >
                <ExternalLink size={16} />
                View Portfolio
              </a>
            ) : (
              <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-sm border border-gold/20 px-5 py-2.5 font-sans text-sm text-ink-dim/70">
                Portfolio — coming soon
              </span>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SummonReveal;
