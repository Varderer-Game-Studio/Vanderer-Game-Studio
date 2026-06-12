import React from 'react';
import { Compass, Heart, Sparkles, Trophy } from 'lucide-react';
import { games } from '../data/games';
import { Section } from './ui/Section';
import { Reveal } from './ui/Reveal';

const beliefs = [
  {
    Icon: Heart,
    title: 'Passion × Demand',
    body: 'We build at the intersection of what we love and what players need — listening first, then finding the compromise point where our obsession meets a real audience.',
  },
  {
    Icon: Compass,
    title: 'Variables, Wandering',
    body: 'Varderer is Variable + Wanderer. We are the variables — capable of anything — who wandered, found each other, and chose to build together as one union.',
  },
  {
    Icon: Sparkles,
    title: 'The North Star',
    body: 'Our ultimate goal is not to make another game in a known genre, but to invent a new one — a category that did not exist until we wandered into it.',
  },
];

const facts = [
  { label: 'Founded', value: '2023' },
  { label: 'Based in', value: 'Thailand' },
  { label: 'The Variables', value: '9 strong' },
];

const Studio: React.FC = () => {
  const traction = games.filter((g) => g.award);

  return (
    <Section id="studio" className="bg-void border-t border-white/5">
      {/* Intro */}
      <Reveal>
        <p className="font-sans text-xs uppercase tracking-[0.28em] text-gold mb-4">The Studio</p>
        <h2 className="font-display text-4xl md:text-6xl text-ink leading-[1.05] max-w-3xl">
          A union of variables, wandering toward something new.
        </h2>
        <p className="mt-6 font-sans text-base md:text-lg text-ink-dim leading-relaxed max-w-2xl">
          We are a game studio born from a simple idea: that the most capable people are the ones
          still searching. We found each other, and decided to build — chasing the games we believe
          should exist, and the players who have been waiting for them.
        </p>
      </Reveal>

      {/* Facts row */}
      <Reveal delay={80}>
        <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6 border-y border-gold/10 py-6">
          {facts.map((f) => (
            <div key={f.label}>
              <div className="font-display text-3xl text-ink">{f.value}</div>
              <div className="font-sans text-xs uppercase tracking-[0.18em] text-ink-dim mt-1">
                {f.label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Beliefs */}
      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {beliefs.map((b, i) => (
          <Reveal key={b.title} delay={i * 80}>
            <div className="h-full rounded-md border border-gold/10 bg-deep p-7 transition-colors duration-300 hover:border-gold/30">
              <b.Icon size={22} className="text-gold" strokeWidth={1.5} />
              <h3 className="mt-4 font-display text-xl text-ink">{b.title}</h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-ink-dim">{b.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Traction */}
      {traction.length > 0 && (
        <div className="mt-16">
          <Reveal>
            <h3 className="font-display text-2xl text-ink mb-6">Recognition</h3>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {traction.map((g, i) => (
              <Reveal key={g.id} delay={i * 80}>
                <div
                  className="flex items-start gap-4 rounded-md border bg-deep p-6"
                  style={{ borderColor: `${g.accent}33` }}
                >
                  <Trophy size={22} style={{ color: g.accent }} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                  <div>
                    <div className="font-display text-lg text-ink">{g.award}</div>
                    <div className="font-sans text-sm text-ink-dim mt-0.5">{g.title}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
};

export default Studio;
