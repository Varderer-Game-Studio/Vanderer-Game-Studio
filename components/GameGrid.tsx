import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { games } from '../data/games';
import { useTheme } from '../lib/ThemeProvider';
import { Section } from './ui/Section';
import { Reveal } from './ui/Reveal';
import Modal from './ui/Modal';
import GameCard from './games/GameCard';
import GameDetailPanel from './games/GameDetailPanel';

const GameGrid: React.FC = () => {
  const { setAccent, resetAccent } = useTheme();
  const [openId, setOpenId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openGame = games.find((g) => g.id === openId) ?? null;

  // Sync accent with open game; reset when nothing is open
  useEffect(() => {
    if (openGame) {
      setAccent(openGame.accent);
    } else {
      resetAccent();
    }
  }, [openId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <Section id="games" className="bg-void border-t border-white/5">
      <Reveal>
        <div className="mb-14">
          <h2 className="font-display text-5xl md:text-6xl text-ink mb-3">Worlds</h2>
          <p className="text-ink-dim font-sans text-base max-w-md">
            Four worlds, four experiments. Each game is a variable in the same grand design.
          </p>
        </div>
      </Reveal>

      {/* Card grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {games.map((game, i) => (
          <Reveal key={game.id} delay={i * 80}>
            <GameCard
              game={game}
              isOpen={openId === game.id}
              onToggle={() => handleToggle(game.id)}
            />
          </Reveal>
        ))}
      </div>

      {/* Expanded detail panel — full width below grid */}
      <AnimatePresence>
        {openGame && (
          <motion.div
            key={openGame.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden mt-4 rounded-md border border-[var(--accent)]/25 bg-deep"
          >
            <GameDetailPanel
              game={openGame}
              onUnavailable={() => setModalOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unavailable link modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Not yet on this platform"
      >
        <p>
          This world hasn't been deployed to that platform yet — check back soon.
        </p>
      </Modal>
    </Section>
  );
};

export default GameGrid;
