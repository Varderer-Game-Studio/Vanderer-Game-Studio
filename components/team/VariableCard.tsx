import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TeamMember } from '../../types';

interface VariableCardProps {
  member: TeamMember;
  onOpenDetail: () => void;
  /** Skip the flip animation under reduced motion. */
  instant?: boolean;
}

/**
 * A single drawn card. Back shows the role only. First click flips it to
 * the face (portrait + name + class); clicking the face opens the detail.
 */
const VariableCard: React.FC<VariableCardProps> = ({ member, onOpenDetail, instant }) => {
  const [flipped, setFlipped] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const initial = member.name.charAt(0).toUpperCase();

  const handleClick = () => {
    if (!flipped) setFlipped(true);
    else onOpenDetail();
  };

  const faceBase =
    'absolute inset-0 rounded-xl overflow-hidden border [backface-visibility:hidden]';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={flipped ? `Open ${member.name}'s details` : `Flip card to reveal ${member.role}`}
      className="group relative block h-full w-full rounded-xl [perspective:1200px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--card-accent)]/70"
      style={{ ['--card-accent' as string]: member.accent } as React.CSSProperties}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={instant ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* BACK — role only */}
        <div
          className={`${faceBase} bg-deep`}
          style={{ borderColor: `${member.accent}40` }}
        >
          {/* cosmic back motif */}
          <span
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${member.accent}40, transparent 60%)`,
            }}
          />
          <span className="pointer-events-none absolute inset-3 rounded-lg border border-gold/15" />
          <span
            className="pointer-events-none absolute left-1/2 top-[34%] -translate-x-1/2 text-2xl"
            style={{ color: member.accent }}
          >
            ✦
          </span>
          <div className="absolute inset-x-0 bottom-0 p-4 text-center">
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-ink-dim">Variable</p>
            <p
              className="mt-1 font-display text-sm leading-tight"
              style={{ color: member.accent }}
            >
              {member.role}
            </p>
            <p className="mt-3 font-sans text-[10px] uppercase tracking-[0.2em] text-ink-dim/70">
              Tap to reveal
            </p>
          </div>
        </div>

        {/* FRONT — portrait + identity */}
        <div
          className={`${faceBase} bg-surface [transform:rotateY(180deg)]`}
          style={{ borderColor: `${member.accent}66` }}
        >
          {!imgFailed ? (
            <img
              src={member.avatarUrl}
              alt={member.name}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="absolute inset-0 opacity-30"
                style={{ background: `radial-gradient(circle at 50% 40%, ${member.accent}, transparent 70%)` }}
              />
              <span className="font-display text-6xl font-black" style={{ color: member.accent }}>
                {initial}
              </span>
            </div>
          )}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep via-deep/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em]" style={{ color: member.accent }}>
              {member.clazz}
            </p>
            <h3 className="mt-0.5 font-display text-base leading-tight text-ink">{member.name}</h3>
            <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.18em] text-ink-dim opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Open ›
            </p>
          </div>
        </div>
      </motion.div>
    </button>
  );
};

export default VariableCard;
