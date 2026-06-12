import React from 'react';
import { ChevronDown } from 'lucide-react';
import Button from './ui/Button';
import { StardustV } from './cosmos/StardustV';
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion';

const Hero: React.FC = () => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
      {/* Centerpiece: V-shaped stardust particle cloud */}
      <div className="w-full flex flex-col items-center px-6">
        <StardustV />

        {/* Headline */}
        <h1 className="font-display text-7xl md:text-9xl text-ink tracking-tight text-center leading-none mt-2 mb-4 select-none">
          VARDERER
        </h1>

        {/* Tagline */}
        <p className="font-display italic text-ink-dim text-xl md:text-2xl text-center mb-5 tracking-wide">
          Code is our Compass
          <span className="text-gold mx-1">.</span>
          {' '}Chaos is our Map
          <span className="text-gold">.</span>
        </p>

        {/* Supporting line */}
        <p className="text-ink-dim max-w-xl text-center text-sm md:text-base leading-relaxed mb-10 font-sans">
          A studio of variables — wanderers who found each other, building games that bend and wander with the player.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button href="#games" variant="primary">
            Explore the Worlds
          </Button>
          <Button href="#contact" variant="outline">
            Work with us
          </Button>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#games"
        aria-label="Scroll to games"
        className="absolute bottom-8 flex flex-col items-center gap-2 text-gold/60 hover:text-gold transition-colors duration-300 group"
      >
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-gold/50 group-hover:to-gold transition-colors duration-300" />
        <ChevronDown
          size={20}
          className={reducedMotion ? '' : 'animate-bounce'}
        />
      </a>
    </section>
  );
};

export default Hero;
