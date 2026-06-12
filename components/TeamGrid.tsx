import React, { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { team } from '../data/team';
import { TeamMember } from '../types';
import { Section } from './ui/Section';
import { Reveal } from './ui/Reveal';
import VariableCard from './team/VariableCard';
import SummonReveal from './team/SummonReveal';
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion';

const CARD_W = 150;
const CARD_H = 210;
const RING_H = 680;

const CompassRose: React.FC = () => (
  <svg viewBox="0 0 100 100" className="h-24 w-24 text-gold/70" aria-hidden>
    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
    <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.3" />
    <path d="M50 6 L56 50 L50 94 L44 50 Z" fill="currentColor" opacity="0.6" />
    <path d="M6 50 L50 44 L94 50 L50 56 Z" fill="currentColor" opacity="0.35" />
    <circle cx="50" cy="50" r="3" fill="currentColor" />
  </svg>
);

const TeamGrid: React.FC = () => {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [dealt, setDealt] = useState(reduced); // reduced motion: cards present immediately
  const [selected, setSelected] = useState<TeamMember | null>(null);

  // Track wrapper width to lay out the ring / decide ring-vs-grid.
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const isRing = width >= 768;

  // Ring geometry
  const cx = width / 2;
  const cy = RING_H / 2;
  const radius = Math.min(width, 660) * 0.34;
  const ringPos = (i: number) => {
    const angle = -Math.PI / 2 + (i / team.length) * Math.PI * 2;
    return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
  };

  return (
    <Section id="team" className="bg-deep border-t border-white/5">
      <Reveal>
        <div className="mb-10">
          <h2 className="font-display text-5xl md:text-6xl text-ink mb-3">The Variables</h2>
          <p className="text-ink-dim font-sans text-base max-w-md">
            Nine variables, one union. Draw the deck, flip a card to meet each — then open it for the full story.
          </p>
        </div>
      </Reveal>

      <div
        ref={wrapRef}
        className="relative mx-auto w-full"
        style={{ height: dealt && isRing ? RING_H : undefined, minHeight: dealt && !isRing ? undefined : 420 }}
      >
        {/* DECK — pre-deal */}
        <AnimatePresence>
          {!dealt && (
            <motion.button
              type="button"
              onClick={() => setDealt(true)}
              aria-label="Draw the deck to reveal the team"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
              className="group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            >
              <div className="relative" style={{ width: CARD_W, height: CARD_H }}>
                {[3, 2, 1, 0].map((d) => (
                  <div
                    key={d}
                    className="absolute inset-0 rounded-xl border border-gold/30 bg-deep shadow-lg transition-transform duration-300"
                    style={{
                      transform: `translate(${d * 5}px, ${d * -5}px) rotate(${d * 1.5}deg)`,
                      zIndex: 10 - d,
                    }}
                  >
                    <span
                      className="absolute inset-0 rounded-xl opacity-40"
                      style={{ background: 'radial-gradient(circle at 50% 30%, rgba(232,195,107,0.25), transparent 60%)' }}
                    />
                    <span className="absolute inset-2 rounded-lg border border-gold/15" />
                    {d === 0 && (
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-gold/80">
                        ✦
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <span className="mt-6 font-sans text-xs uppercase tracking-[0.25em] text-gold group-hover:text-gold-bright transition-colors">
                Draw the Variables
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* DEALT */}
        {dealt && (
          <>
            {/* Center compass for the ring */}
            {isRing && (
              <motion.div
                initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: reduced ? 0 : 0.4, duration: 0.6 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              >
                <CompassRose />
              </motion.div>
            )}

            {isRing ? (
              // Zodiac ring — absolutely positioned cards
              team.map((member, i) => {
                const { x, y } = ringPos(i);
                return (
                  <motion.div
                    key={member.id}
                    className="absolute"
                    style={{ left: x, top: y, width: CARD_W, height: CARD_H, marginLeft: -CARD_W / 2, marginTop: -CARD_H / 2 }}
                    initial={reduced ? false : { x: cx - x, y: cy - y, scale: 0.5, opacity: 0, rotate: (i % 2 ? 1 : -1) * 12 }}
                    animate={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
                    transition={reduced ? { duration: 0 } : { delay: i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <VariableCard member={member} onOpenDetail={() => setSelected(member)} instant={reduced} />
                  </motion.div>
                );
              })
            ) : (
              // Mobile / narrow — staggered grid
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {team.map((member, i) => (
                  <motion.div
                    key={member.id}
                    className="aspect-[5/7]"
                    initial={reduced ? false : { opacity: 0, y: 24, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={reduced ? { duration: 0 } : { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <VariableCard member={member} onOpenDetail={() => setSelected(member)} instant={reduced} />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {selected && <SummonReveal member={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </Section>
  );
};

export default TeamGrid;
