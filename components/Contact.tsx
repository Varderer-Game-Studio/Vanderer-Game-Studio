import React, { useState } from 'react';
import { Mail, Send, Download, Loader2, CheckCircle2 } from 'lucide-react';
import { Section } from './ui/Section';
import { Reveal } from './ui/Reveal';
import Button from './ui/Button';

const STUDIO_EMAIL = 'vardererstudio@gmail.com';
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;

type Status = 'idle' | 'submitting' | 'success' | 'error';

const Contact: React.FC = () => {
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!FORMSPREE_ID) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus('submitting');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full rounded-sm border border-gold/15 bg-deep px-4 py-3 font-sans text-sm text-ink placeholder:text-ink-dim/60 outline-none transition-colors focus:border-[var(--accent)]';

  return (
    <Section id="contact" className="bg-deep border-t border-white/5">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Left: invitation */}
        <Reveal>
          <p className="font-sans text-xs uppercase tracking-[0.28em] text-gold mb-4">Contact</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink leading-tight">
            Let's build something that doesn't exist yet.
          </h2>
          <p className="mt-5 font-sans text-base text-ink-dim leading-relaxed max-w-md">
            Publishers, collaborators, and the curious — we'd love to hear from you. Reach out
            directly or send us a note.
          </p>

          <a
            href={`mailto:${STUDIO_EMAIL}`}
            className="mt-8 inline-flex items-center gap-3 font-sans text-ink hover:text-[var(--accent)] transition-colors"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-gold/20">
              <Mail size={18} />
            </span>
            {STUDIO_EMAIL}
          </a>

          <div className="mt-8">
            <Button variant="outline" icon={Download} disabled className="opacity-60 cursor-not-allowed">
              Download studio kit — soon
            </Button>
          </div>
        </Reveal>

        {/* Right: form */}
        <Reveal delay={100}>
          {status === 'success' ? (
            <div className="flex h-full flex-col items-center justify-center rounded-md border border-gold/15 bg-void/40 p-10 text-center">
              <CheckCircle2 size={40} className="text-[var(--accent)]" strokeWidth={1.5} />
              <h3 className="mt-4 font-display text-2xl text-ink">Message sent</h3>
              <p className="mt-2 font-sans text-sm text-ink-dim">
                Thank you — we'll get back to you soon.
              </p>
            </div>
          ) : FORMSPREE_ID ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-md border border-gold/10 bg-void/30 p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block font-sans text-xs uppercase tracking-[0.15em] text-ink-dim">
                    Name
                  </label>
                  <input id="name" name="name" type="text" required className={inputClass} placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block font-sans text-xs uppercase tracking-[0.15em] text-ink-dim">
                    Email
                  </label>
                  <input id="email" name="email" type="email" required className={inputClass} placeholder="you@studio.com" />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block font-sans text-xs uppercase tracking-[0.15em] text-ink-dim">
                  Message
                </label>
                <textarea id="message" name="message" required rows={5} className={`${inputClass} resize-none`} placeholder="Tell us what you have in mind…" />
              </div>

              {status === 'error' && (
                <p className="font-sans text-sm text-red-400">
                  Something went wrong. Please email us directly at {STUDIO_EMAIL}.
                </p>
              )}

              <Button type="submit" variant="primary" disabled={status === 'submitting'} className="mt-1 self-start">
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send size={18} /> Send message
                  </>
                )}
              </Button>
            </form>
          ) : (
            // Graceful fallback when Formspree isn't configured
            <div className="flex h-full flex-col items-center justify-center rounded-md border border-dashed border-gold/20 bg-void/30 p-10 text-center">
              <Mail size={32} className="text-gold" strokeWidth={1.5} />
              <p className="mt-4 font-sans text-sm text-ink-dim max-w-xs">
                Our contact form is being wired up. In the meantime, reach us directly:
              </p>
              <a
                href={`mailto:${STUDIO_EMAIL}`}
                className="mt-3 font-sans text-sm text-[var(--accent)] hover:underline"
              >
                {STUDIO_EMAIL}
              </a>
            </div>
          )}
        </Reveal>
      </div>
    </Section>
  );
};

export default Contact;
