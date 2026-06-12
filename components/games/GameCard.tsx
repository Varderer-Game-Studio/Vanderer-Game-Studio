import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Game } from '../../types';
import { useTheme } from '../../lib/ThemeProvider';

interface GameCardProps {
  game: Game;
  isOpen: boolean;
  onToggle: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, isOpen, onToggle }) => {
  const { setAccent, resetAccent } = useTheme();
  const [imgError, setImgError] = useState(false);

  const handleMouseEnter = () => {
    setAccent(game.accent);
  };

  const handleMouseLeave = () => {
    // Only reset when this card is not the currently open one
    if (!isOpen) {
      resetAccent();
    }
  };

  const handleToggle = () => {
    // Always set accent when opening; GameGrid's useEffect handles reset on close
    setAccent(game.accent);
    onToggle();
  };

  return (
    <div
      className={`group relative bg-deep rounded-md overflow-hidden flex flex-col transition-all duration-300 cursor-pointer
        border ${isOpen ? 'border-[var(--accent)]' : 'border-gold/15 hover:border-[var(--accent)]'}
        hover:shadow-[0_4px_32px_rgba(0,0,0,0.4)] hover:-translate-y-0.5`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle(); } }}
      aria-expanded={isOpen}
    >
      {/* Cover image */}
      <div className="relative h-52 overflow-hidden flex-shrink-0 bg-surface">
        {!imgError ? (
          <img
            src={game.imageUrl}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-surface flex items-center justify-center">
            <span className="font-display text-lg text-ink-dim">{game.title}</span>
          </div>
        )}

        {/* Status pill */}
        <div className="absolute top-3 right-3 z-10 bg-void/70 backdrop-blur-sm px-2.5 py-1 rounded-full">
          <span
            className={`text-xs font-sans font-medium uppercase tracking-wide ${
              game.status === 'Released' ? 'text-emerald-300' : 'text-[var(--accent)]'
            }`}
          >
            {game.status}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col gap-2 flex-grow">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl text-ink leading-tight">{game.title}</h3>
          <ChevronDown
            size={18}
            className={`text-ink-dim flex-shrink-0 mt-1 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        <p className="text-ink-dim text-sm font-sans leading-snug line-clamp-2">{game.logline}</p>

        {/* Genre chips */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {game.genres.map((g) => (
            <span
              key={g}
              className="border border-gold/20 text-ink-dim text-xs uppercase tracking-wide px-2 py-0.5 rounded-sm"
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
