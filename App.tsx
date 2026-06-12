import React from 'react';
import { ThemeProvider } from './lib/ThemeProvider';
import { Starfield } from './components/cosmos/Starfield';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GameGrid from './components/GameGrid';
import Studio from './components/Studio';
import TeamGrid from './components/TeamGrid';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Starfield />
      <div className="relative min-h-[100dvh]">
        <Navbar />
        <main>
          <Hero />
          <GameGrid />
          <Studio />
          <TeamGrid />
          <Contact />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;
