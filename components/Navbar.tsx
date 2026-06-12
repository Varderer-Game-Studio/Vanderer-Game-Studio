import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Button from './ui/Button';

const navLinks = [
  { label: 'Games', href: '#games' },
  { label: 'Studio', href: '#studio' },
  { label: 'Team', href: '#team' },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-deep/80 backdrop-blur-md border-b border-gold/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-content mx-auto px-6 flex items-center justify-between h-16">

        {/* Wordmark */}
        <a href="#" className="flex items-center gap-3 group shrink-0">
          {/* Gold "V" mark */}
          <div className="w-9 h-9 flex items-center justify-center">
            <span className="font-display text-gold text-3xl font-black leading-none select-none">
              V
            </span>
          </div>
          {/* Brand text */}
          <div className="flex flex-col leading-none">
            <span className="font-display font-black text-xl tracking-tight text-ink">
              VARDERER
            </span>
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold">
              Variable Wanderers
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-sans text-sm text-ink-dim hover:text-ink transition-colors duration-200 relative group"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
          <Button href="#contact" variant="primary">
            Contact
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-ink-dim hover:text-ink transition-colors p-2 relative z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Fullscreen Overlay */}
      <div
        className={`fixed inset-0 bg-deep/98 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-10 transition-all duration-500 ${
          isMobileMenuOpen
            ? 'opacity-100 visible pointer-events-auto'
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-8">
          {navLinks.map((link, idx) => (
            <a
              key={link.label}
              href={link.href}
              className="font-display text-3xl font-black text-ink hover:text-gold transition-colors duration-200"
              style={{ transitionDelay: `${idx * 60}ms` }}
              onClick={closeMobileMenu}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2">
            <Button href="#contact" variant="primary" onClick={closeMobileMenu}>
              Contact
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
