import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  icon: Icon,
  children,
  className = '',
  href,
  ...props
}) => {
  const baseStyles = "relative inline-flex items-center justify-center gap-2 px-6 py-3 font-sans text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70";

  const variants = {
    primary: "bg-[var(--accent)] text-void hover:bg-gold-bright",
    outline: "border border-gold/40 text-ink hover:border-[var(--accent)] hover:text-[var(--accent)] bg-transparent",
    ghost: "bg-transparent text-ink-dim hover:text-[var(--accent)]",
  };

  const Content = () => (
    <>
      {Icon && <Icon size={18} />}
      {children}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        <Content />
      </a>
    );
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <Content />
    </button>
  );
};

export default Button;
