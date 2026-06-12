import React, { useState } from 'react';
import { TeamMember } from '../../types';

interface SummonCardProps {
  member: TeamMember;
  onSelect: () => void;
}

/**
 * Scannable card face for "The Variables".
 * Shows a celestial-duotone portrait, name and real role.
 * Click summons the full reveal. onError falls back to a
 * constellation-initial avatar so a missing image never breaks the grid.
 */
const SummonCard: React.FC<SummonCardProps> = ({ member, onSelect }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const initial = member.name.charAt(0).toUpperCase();

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Summon ${member.name}, ${member.role}`}
      className="group relative flex flex-col text-left w-full rounded-md border border-gold/15 bg-deep overflow-hidden transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--card-accent)]/70"
      style={
        {
          // Local accent for this card's hover glow + frame, scoped to the button.
          ['--card-accent' as string]: member.accent,
        } as React.CSSProperties
      }
    >
      {/* Accent glow on hover */}
      <span
        className="pointer-events-none absolute -inset-px rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: `0 0 36px -6px ${member.accent}55, inset 0 0 0 1px ${member.accent}40` }}
      />

      {/* Portrait */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface">
        {!imgFailed ? (
          <>
            <img
              src={member.avatarUrl}
              alt={member.name}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="absolute inset-0 h-full w-full object-cover grayscale contrast-[1.05] brightness-90 transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.03]"
            />
            {/* Celestial duotone wash — recedes on hover to reveal true color */}
            <span
              className="pointer-events-none absolute inset-0 mix-blend-color opacity-70 transition-opacity duration-500 group-hover:opacity-0"
              style={{ backgroundColor: member.accent }}
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep via-deep/20 to-transparent" />
          </>
        ) : (
          // Constellation-initial fallback
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="absolute inset-0 opacity-25"
              style={{ background: `radial-gradient(circle at 50% 40%, ${member.accent}, transparent 70%)` }}
            />
            <span
              className="font-display text-7xl font-black"
              style={{ color: member.accent }}
            >
              {initial}
            </span>
          </div>
        )}
      </div>

      {/* Identity */}
      <div className="relative p-5">
        <h3 className="font-display text-xl text-ink leading-tight">{member.name}</h3>
        <p className="mt-1 font-sans text-xs uppercase tracking-[0.18em] text-ink-dim">
          {member.role}
        </p>
        <span
          className="mt-3 inline-flex items-center gap-1.5 font-sans text-[11px] tracking-wide text-ink-dim opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
          style={{ color: member.accent }}
        >
          Summon →
        </span>
      </div>
    </button>
  );
};

export default SummonCard;
