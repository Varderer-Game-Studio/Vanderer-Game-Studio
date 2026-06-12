import React from 'react';
import { Github, Youtube, Mail, Facebook } from 'lucide-react';

// Custom Icon for X (formerly Twitter)
const XIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

// Custom Icon for TikTok
const TikTokIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Footer: React.FC = () => {
  const socialLinks: { Icon: React.FC<{ size?: number; className?: string }>; href: string; label: string; external?: boolean }[] = [
    { Icon: XIcon, href: "https://x.com", label: "X", external: true },
    { Icon: Github, href: "https://github.com/Vanderer-Game-Studio", label: "GitHub", external: true },
    { Icon: Youtube, href: "https://www.youtube.com/channel/UCNd2Gp4cHGh0F75MpW-kbnA", label: "YouTube", external: true },
    { Icon: Mail, href: "mailto:vardererstudio@gmail.com", label: "Email", external: false },
    { Icon: Facebook, href: "https://www.facebook.com/VardererGameStudio", label: "Facebook", external: true },
    { Icon: TikTokIcon, href: "https://tiktok.com/@varderer", label: "TikTok", external: true },
  ];

  const navLinks = [
    { label: "Games", href: "#games" },
    { label: "Studio", href: "#studio" },
    { label: "Team", href: "#team" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer id="site-footer" className="bg-deep border-t border-gold/10 pt-16 pb-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12 mb-12">
          {/* Left / brand section */}
          <div className="flex flex-col gap-5">
            <span className="font-display text-3xl font-black text-ink tracking-tight">
              VARDERER
            </span>
            <p className="font-sans text-sm text-ink-dim leading-relaxed max-w-xs">
              Varderer Game Studio — a union of variables. Thailand, est. 2023.
            </p>
            {/* Social icon row */}
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map(({ Icon, href, label, external }, i) => (
                <a
                  key={i}
                  href={href}
                  {...(external !== false && { target: '_blank', rel: 'noopener noreferrer' })}
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center border border-gold/15 text-ink-dim hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav column */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-col gap-3">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="font-sans text-sm text-ink-dim hover:text-ink transition-colors duration-200"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom row */}
        <div className="border-t border-gold/10 pt-6">
          <p className="font-sans text-xs text-ink-dim">
            © {new Date().getFullYear()} Varderer Game Studio · Thailand
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
