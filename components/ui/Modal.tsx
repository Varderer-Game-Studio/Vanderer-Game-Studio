import React, { useEffect, useState } from 'react';
import { X, Telescope } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="absolute inset-0 bg-void/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-deep border border-gold/30 rounded-md shadow-[0_0_40px_rgba(232,195,107,0.12)] w-full max-w-md p-8">
        {/* Subtle top glow line */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-dim hover:text-ink transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="text-[var(--accent)]">
            <Telescope size={40} strokeWidth={1.5} />
          </div>

          {title && (
            <h3 className="font-display text-2xl text-ink">
              {title}
            </h3>
          )}

          <div className="text-ink-dim font-sans text-sm leading-relaxed">
            {children}
          </div>

          <Button variant="primary" onClick={onClose}>
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
