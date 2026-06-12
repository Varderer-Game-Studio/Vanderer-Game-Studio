import React from 'react';
import { Download, Gamepad2, ImageIcon, Trophy } from 'lucide-react';
import { Game } from '../../types';
import Button from '../ui/Button';

interface GameDetailPanelProps {
  game: Game;
  onUnavailable: () => void;
}

const PLACEHOLDER_STEAM = 'https://store.steampowered.com/';
const PLACEHOLDER_ITCH = 'https://itch.io/';

function isPlaceholderUrl(url?: string): boolean {
  return !url || url === '' || url === PLACEHOLDER_STEAM || url === PLACEHOLDER_ITCH;
}

const GameDetailPanel: React.FC<GameDetailPanelProps> = ({ game, onUnavailable }) => {
  const bodyText = game.description || game.logline;

  const handleSteam = (e: React.MouseEvent) => {
    if (isPlaceholderUrl(game.steamUrl)) {
      e.preventDefault();
      onUnavailable();
    }
  };

  const handleItch = (e: React.MouseEvent) => {
    if (isPlaceholderUrl(game.itchUrl)) {
      e.preventDefault();
      onUnavailable();
    }
  };

  return (
    <div className="px-6 pb-6 pt-2 space-y-5">
      {/* Gallery / placeholder */}
      {game.gallery.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {game.gallery.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${game.title} screenshot ${i + 1}`}
              className="w-full aspect-video object-cover rounded border border-gold/15"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center aspect-video w-full rounded border border-dashed border-gold/20 bg-surface/40 text-ink-dim gap-2">
          <ImageIcon size={28} strokeWidth={1.5} className="opacity-40" />
          <span className="text-xs font-sans tracking-wide opacity-50">Media coming soon</span>
        </div>
      )}

      {/* Description */}
      <p className="text-ink-dim font-sans text-sm leading-relaxed whitespace-pre-line">
        {bodyText}
      </p>

      {/* Genres */}
      <div className="flex flex-wrap gap-2">
        {game.genres.map((g) => (
          <span
            key={g}
            className="border border-gold/20 text-ink-dim text-xs uppercase tracking-wide px-2 py-1 rounded-sm"
          >
            {g}
          </span>
        ))}
      </div>

      {/* Status + Award */}
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`text-xs font-sans uppercase tracking-wide font-medium ${
            game.status === 'Released' ? 'text-emerald-300' : 'text-[var(--accent)]'
          }`}
        >
          {game.status}
        </span>

        {game.award && (
          <span className="flex items-center gap-1.5 text-[var(--accent)] text-xs font-sans">
            <Trophy size={13} strokeWidth={1.5} />
            {game.award}
          </span>
        )}
      </div>

      {/* Store buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          icon={Gamepad2}
          href={game.steamUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleSteam}
        >
          Steam
        </Button>
        <Button
          variant="outline"
          icon={Download}
          href={game.itchUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleItch}
        >
          Itch.io
        </Button>
      </div>
    </div>
  );
};

export default GameDetailPanel;
