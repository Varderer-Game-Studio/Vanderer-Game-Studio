import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { team } from '../data/team';
import { TeamMember } from '../types';
import { Section } from './ui/Section';
import { Reveal } from './ui/Reveal';
import SummonCard from './team/SummonCard';
import SummonReveal from './team/SummonReveal';

const TeamGrid: React.FC = () => {
  const [selected, setSelected] = useState<TeamMember | null>(null);

  return (
    <Section id="team" className="bg-deep border-t border-white/5">
      <Reveal>
        <div className="mb-14">
          <h2 className="font-display text-5xl md:text-6xl text-ink mb-3">The Variables</h2>
          <p className="text-ink-dim font-sans text-base max-w-md">
            Nine variables, one union. Summon each to see who they are.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {team.map((member, i) => (
          <Reveal key={member.id} delay={i * 60}>
            <SummonCard member={member} onSelect={() => setSelected(member)} />
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <SummonReveal member={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </Section>
  );
};

export default TeamGrid;
