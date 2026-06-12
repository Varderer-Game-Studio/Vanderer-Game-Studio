# Varderer Cosmic Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Note on this plan's style:** This is an exploratory visual/motion redesign. Deterministic work (build migration, data schema, link-gating, reduced-motion, build/typecheck gates) is specified exactly and verified by commands. Look-and-feel work (cosmic 3D, particles, exact colors/spacing) is given as **runnable scaffolds + visual acceptance criteria**, tuned live against `npm run dev`. Visual values in code blocks are deliberate *starting points*, not final pixels — expect to adjust them on sight with the user.

**Goal:** Replace the dated cyberpunk/glitch Varderer portfolio with a polished, publisher-first, cosmic-themed single-page site whose signature is an interactive "summon card" team section.

**Architecture:** React 19 + Vite + TypeScript single-page app (no router — games expand in place). Proper production Tailwind build (PostCSS) replaces the CDN/import-map. A cosmic motion layer uses `@react-three/fiber` for the hero centerpiece only and a lightweight 2D canvas starfield elsewhere, all gated behind a `prefers-reduced-motion` hook. Content lives in typed data modules; sections are focused components composed by `App.tsx`.

**Tech Stack:** React 19, Vite 6, TypeScript, Tailwind CSS v3 (PostCSS), `@react-three/fiber` + `@react-three/drei` + `three`, `framer-motion` (reveal/summon orchestration), `lucide-react` (icons), `@fontsource` fonts (Fraunces display serif + Inter sans), Formspree (contact). Removes: `recharts`, Tailwind CDN, AI-Studio import-map, Gemini env defines.

**Design tokens (starting points):**
- `--bg-void: #05060a`, `--bg-deep: #0b0e17`, `--surface: #121726`
- `--gold: #E8C36B`, `--gold-bright: #F6D98A`, `--gold-dim: #8A7236`
- `--text: #ECEEF5`, `--text-dim: #9AA2B6`, hairlines `rgba(232,195,107,0.14)`
- Per-game accents: Baby May Cry `#5B9BD5` (cold), NChanter `#7E6BD0` (arcane), Elementaria `#E0793B` (ember), PRYSM `#46C7B0` (prism)
- Fonts: display `"Fraunces"`, body/UI `"Inter"`

---

## Phase 0 — Build migration & dependencies

### Task 0.1: Install/remove dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add and remove packages**

Run:
```bash
npm install three @react-three/fiber @react-three/drei framer-motion @fontsource/fraunces @fontsource/inter
npm install -D tailwindcss@^3 postcss autoprefixer @types/three
npm uninstall recharts
```
Expected: installs succeed, `recharts` removed from `dependencies`.

- [ ] **Step 2: Commit**
```bash
git add package.json package-lock.json
git commit -m "build: swap recharts for three/fiber, framer-motion, tailwind toolchain"
```

### Task 0.2: Production Tailwind + PostCSS

**Files:**
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.css`
- Modify: `index.html`
- Modify: `index.tsx`

- [ ] **Step 1: Create `tailwind.config.js`**
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './index.tsx', './App.tsx', './components/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#05060a', deep: '#0b0e17', surface: '#121726',
        gold: { DEFAULT: '#E8C36B', bright: '#F6D98A', dim: '#8A7236' },
        ink: { DEFAULT: '#ECEEF5', dim: '#9AA2B6' },
      },
      fontFamily: { display: ['Fraunces', 'serif'], sans: ['Inter', 'sans-serif'] },
      maxWidth: { content: '1200px' },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Create `postcss.config.js`**
```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

- [ ] **Step 3: Create `index.css`** (replaces old CDN styles; CSS var theme + base)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import '@fontsource/fraunces/400.css';
@import '@fontsource/fraunces/600.css';
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';

:root {
  --accent: #E8C36B; /* live per-game accent; updated by ThemeProvider */
}
html { scroll-behavior: smooth; }
body { @apply bg-void text-ink font-sans antialiased; overflow-x: hidden; }
::selection { background: var(--accent); color: #05060a; }
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #05060a; }
::-webkit-scrollbar-thumb { background: #2a2f40; }
::-webkit-scrollbar-thumb:hover { background: var(--accent); }
.accent { color: var(--accent); }
.bg-accent { background-color: var(--accent); }
```

- [ ] **Step 4: Strip `index.html`** — remove the Tailwind CDN `<script>`, the inline `tailwind.config`, the entire `<style>` block (glitch/scanline), the `<link rel="stylesheet" href="/index.css">` line, the import-map `<script>`, and the Google Fonts links. Final `<head>` keeps only charset, viewport, title (update to `VARDERER | Variable Wanderers`). Remove `<div class="scanline">`. Body class becomes `class="bg-void text-ink"`. Keep `<div id="root">` and `<script type="module" src="/index.tsx">`.

- [ ] **Step 5: Import CSS in `index.tsx`** — add `import './index.css';` at the top.

- [ ] **Step 6: Clean `vite.config.ts`** — delete the `define` block (Gemini env). Keep server/plugins/resolve.

- [ ] **Step 7: Verify build & dev**
Run: `npm run build`
Expected: build succeeds, no CDN warnings, CSS emitted.
Run: `npm run dev` → open `localhost:3000`. Expected: dark `#05060a` page, Inter/Fraunces load (check Network), no console errors. (Existing components will look unstyled/broken — that's fine, they're replaced in later phases.)

- [ ] **Step 8: Commit**
```bash
git add tailwind.config.js postcss.config.js index.css index.html index.tsx vite.config.ts
git commit -m "build: production Tailwind/PostCSS, drop CDN + import-map + gemini defines"
```

---

## Phase 1 — Foundation primitives (motion gate, theme, layout)

### Task 1.1: `usePrefersReducedMotion` hook

**Files:**
- Create: `lib/usePrefersReducedMotion.ts`
- Test: `lib/usePrefersReducedMotion.test.ts` (only if a test runner is added; otherwise verify via Step 3 manual check)

- [ ] **Step 1: Implement hook**
```ts
import { useEffect, useState } from 'react';

/** True when the user requests reduced motion OR the device is low-power (coarse pointer + low cores). */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4 && window.matchMedia('(pointer: coarse)').matches;
    const update = () => setReduced(mq.matches || lowPower);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}
```

- [ ] **Step 2: Verify typecheck**
Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual check** — temporarily log the value in `App`, toggle OS "reduce motion", confirm it flips. Remove the log.

- [ ] **Step 4: Commit**
```bash
git add lib/usePrefersReducedMotion.ts
git commit -m "feat: add prefers-reduced-motion / low-power hook"
```

### Task 1.2: Accent theme context (per-game theming)

**Files:**
- Create: `lib/ThemeProvider.tsx`

- [ ] **Step 1: Implement provider** — exposes the current accent and writes it to the `--accent` CSS var so any element using `.accent`/`var(--accent)` re-themes.
```tsx
import React, { createContext, useCallback, useContext, useState } from 'react';

const DEFAULT_ACCENT = '#E8C36B';
interface ThemeCtx { accent: string; setAccent: (hex: string) => void; resetAccent: () => void; }
const Ctx = createContext<ThemeCtx>({ accent: DEFAULT_ACCENT, setAccent: () => {}, resetAccent: () => {} });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accent, setAccentState] = useState(DEFAULT_ACCENT);
  const setAccent = useCallback((hex: string) => {
    setAccentState(hex);
    document.documentElement.style.setProperty('--accent', hex);
  }, []);
  const resetAccent = useCallback(() => setAccent(DEFAULT_ACCENT), [setAccent]);
  return <Ctx.Provider value={{ accent, setAccent, resetAccent }}>{children}</Ctx.Provider>;
};
export const useTheme = () => useContext(Ctx);
export { DEFAULT_ACCENT };
```

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit` → no errors.

- [ ] **Step 3: Commit**
```bash
git add lib/ThemeProvider.tsx
git commit -m "feat: accent ThemeProvider driving --accent CSS var for per-game theming"
```

### Task 1.3: `Reveal` + `Section` layout primitives (replace RevealSection)

**Files:**
- Create: `components/ui/Reveal.tsx`
- Create: `components/ui/Section.tsx`

- [ ] **Step 1: `Reveal.tsx`** — framer-motion scroll reveal, reduced-motion aware.
```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';

export const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
};
```

- [ ] **Step 2: `Section.tsx`** — consistent vertical rhythm + max-width container.
```tsx
import React from 'react';
export const Section: React.FC<{ id?: string; className?: string; children: React.ReactNode }> = ({ id, className = '', children }) => (
  <section id={id} className={`relative py-28 px-6 ${className}`}>
    <div className="mx-auto max-w-content">{children}</div>
  </section>
);
```

- [ ] **Step 3: Typecheck** — `npx tsc --noEmit` → no errors.

- [ ] **Step 4: Commit**
```bash
git add components/ui/Reveal.tsx components/ui/Section.tsx
git commit -m "feat: Reveal + Section layout primitives"
```

### Task 1.4: Rebuild `Button` (cosmic, accent-aware)

**Files:**
- Modify: `components/ui/Button.tsx`

- [ ] **Step 1: Read current Button** to preserve its prop API (`href`, `variant`, `icon`, `onClick`, `target`, `rel`, `className`, `children`). Replace styling: remove skew/glitch; primary = gold fill on void text, outline = hairline border with `var(--accent)` hover. Keep it polymorphic (`<a>` when `href`, else `<button>`).

- [ ] **Step 2: Typecheck + visual** — `npx tsc --noEmit`; render a sample in dev, confirm no skew/glitch, gold styling, hover uses accent.

- [ ] **Step 3: Commit**
```bash
git add components/ui/Button.tsx
git commit -m "refactor: cosmic accent-aware Button, drop glitch/skew"
```

---

## Phase 2 — Cosmic motion engine

### Task 2.1: 2D canvas starfield (ambient background)

**Files:**
- Create: `components/cosmos/Starfield.tsx`

- [ ] **Step 1: Implement** a fixed full-viewport `<canvas>` of drifting stars with subtle parallax toward the mouse; renders nothing when reduced motion is on (static CSS-gradient fallback instead). Density scales down on narrow viewports. Acceptance: ~60fps, stars twinkle subtly in gold/white, pointer nudges parallax, `position: fixed; inset:0; z-index:-1; pointer-events:none`.
```tsx
import React, { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';

export const Starfield: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const canvas = ref.current!; const ctx = canvas.getContext('2d')!;
    let raf = 0, w = 0, h = 0; const mouse = { x: 0, y: 0 };
    const resize = () => { w = canvas.width = innerWidth; h = canvas.height = innerHeight; };
    resize(); addEventListener('resize', resize);
    const count = Math.min(220, Math.floor((innerWidth * innerHeight) / 9000));
    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h, z: Math.random() * 0.8 + 0.2,
      r: Math.random() * 1.2 + 0.3, t: Math.random() * Math.PI * 2,
    }));
    const onMove = (e: MouseEvent) => { mouse.x = (e.clientX / w - 0.5); mouse.y = (e.clientY / h - 0.5); };
    addEventListener('mousemove', onMove);
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.t += 0.02; const tw = 0.6 + Math.sin(s.t) * 0.4;
        const px = s.x + mouse.x * 40 * s.z, py = s.y + mouse.y * 40 * s.z;
        ctx.beginPath(); ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(246,217,138,${0.5 * tw * s.z})`; ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('mousemove', onMove); };
  }, [reduced]);
  if (reduced) return <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,#0b0e17,#05060a)]" />;
  return <canvas ref={ref} className="fixed inset-0 -z-10 pointer-events-none" />;
};
```

- [ ] **Step 2: Mount temporarily in `App`** behind `<ThemeProvider>` to eyeball it; confirm fps/feel. Commit.
```bash
git add components/cosmos/Starfield.tsx
git commit -m "feat: ambient 2D canvas starfield with reduced-motion fallback"
```

### Task 2.2: Hero 3D centerpiece — stardust → V (react-three-fiber)

**Files:**
- Create: `components/cosmos/StardustV.tsx`

- [ ] **Step 1: Implement** an R3F `<Canvas>` particle system: ~2–4k points that idle as a slow-rotating cloud and, on mount, lerp toward target positions sampled along a "V" + compass-rose ring. Mouse drifts the camera/cloud subtly. Suspense-wrapped; renders a static SVG "V" fallback when reduced motion. This is the hero's one heavy WebGL moment.

Scaffold (geometry/lerp real; exact point targets + look tuned live):
```tsx
import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';

const COUNT = 3000;
function vTarget(i: number): [number, number, number] {
  // Half points on each stroke of the V; remainder on a faint compass ring.
  const t = (i % (COUNT / 2)) / (COUNT / 2);
  const onRing = i > COUNT * 0.85;
  if (onRing) { const a = t * Math.PI * 2; return [Math.cos(a) * 3.2, Math.sin(a) * 3.2, (Math.random() - 0.5) * 0.4]; }
  const left = i < COUNT / 2; const x = left ? -1.6 + t * 1.6 : 1.6 - t * 1.6;
  const y = 1.8 - t * 3.6; return [x, y, (Math.random() - 0.5) * 0.3];
}
const Cloud: React.FC = () => {
  const ref = useRef<THREE.Points>(null);
  const { positions, targets } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3); const targets = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions.set([(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12], i * 3);
      targets.set(vTarget(i), i * 3);
    }
    return { positions, targets };
  }, []);
  useFrame((state) => {
    const g = ref.current!.geometry.attributes.position as THREE.BufferAttribute;
    const arr = g.array as Float32Array;
    for (let i = 0; i < arr.length; i++) arr[i] += (targets[i] - arr[i]) * 0.02;
    g.needsUpdate = true;
    ref.current!.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.15 + state.pointer.x * 0.2;
    ref.current!.rotation.x = state.pointer.y * 0.1;
  });
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} /></bufferGeometry>
      <pointsMaterial size={0.035} color="#F6D98A" sizeAttenuation transparent opacity={0.9} />
    </points>
  );
};
export const StardustV: React.FC = () => {
  const reduced = usePrefersReducedMotion();
  if (reduced) return (
    <svg viewBox="0 0 120 120" className="w-48 h-48 mx-auto text-gold" aria-hidden>
      <path d="M30 30 L60 90 L90 30" fill="none" stroke="currentColor" strokeWidth="4" /></svg>
  );
  return (
    <div className="w-full h-[46vh] min-h-[320px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.8]}>
        <Suspense fallback={null}><Cloud /></Suspense>
      </Canvas>
    </div>
  );
};
```

- [ ] **Step 2: Visual tune** in dev — confirm the cloud resolves into a readable V + ring, ~60fps desktop, fallback shows under reduced motion. Adjust `COUNT`, `size`, lerp rate, targets with the user.

- [ ] **Step 3: Commit**
```bash
git add components/cosmos/StardustV.tsx
git commit -m "feat: hero stardust->V WebGL centerpiece with static fallback"
```

---

## Phase 3 — Data layer

### Task 3.1: Types + game data

**Files:**
- Modify: `types.ts`
- Create: `data/games.ts`

- [ ] **Step 1: Replace `types.ts`** — drop `Stat`; add accent + media + awards fields.
```ts
export interface Game {
  id: string; title: string; logline: string; description: string;
  imageUrl: string; gallery: string[]; trailerUrl?: string;
  genres: string[]; status: 'In Development' | 'Released' | 'Prototype';
  accent: string; award?: string;
  steamUrl?: string; itchUrl?: string;
}
export interface TeamMember {
  id: string; name: string; role: string; clazz: string; classDescription: string;
  avatarUrl: string; specialties: string[]; tools: string[];
  bio: string; accent: string; portfolioUrl?: string;
}
```

- [ ] **Step 2: Create `data/games.ts`** — port the 4 existing games into the new shape: keep `description`, set `genres` from old `tags`, add `logline` (one line), `gallery: []`, `accent` per the token table, and real `award` for Baby May Cry (`'Rising Star — BU GAME ON'`) and NChanter (`'Semi-finalist — Thailand Game Festival'`). Keep existing `steamUrl`/`itchUrl`.

- [ ] **Step 3: Typecheck** — `npx tsc --noEmit` → no errors.

- [ ] **Step 4: Commit**
```bash
git add types.ts data/games.ts
git commit -m "feat: new Game/TeamMember types + games data with accents and awards"
```

### Task 3.2: Team data (real credentials, no stats)

**Files:**
- Create: `data/team.ts`

- [ ] **Step 1: Port all 9 members** from the old `TeamGrid.tsx` into the new `TeamMember` shape: keep `name`, `role`, `class`→`clazz`, `classDescription`, `avatarUrl`, `bio`(from old `description`); split old `specialty` into `specialties[]`; map old `equipment`→`tools`; assign each an `accent` (reuse game accents or a gold family); set `portfolioUrl: undefined` (placeholder). **Drop** `level` and `stats`.

- [ ] **Step 2: Add a `PORTFOLIO LINKS` comment block** at the top of `data/team.ts` documenting exactly where to paste each member's URL (the `portfolioUrl` field), so the user can self-serve.

- [ ] **Step 3: Typecheck** — `npx tsc --noEmit` → no errors.

- [ ] **Step 4: Commit**
```bash
git add data/team.ts
git commit -m "feat: team data with real credentials, drop fake stats/levels"
```

---

## Phase 4 — Sections

### Task 4.1: Navbar (persistent, with Contact)

**Files:**
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Rebuild** — minimal fixed top bar: stardust-V wordmark left; links `Games / Studio / Team / Contact` right; transparent over hero, gains `bg-deep/80 backdrop-blur` after scroll; mobile menu. Anchor links to `#games #studio #team #contact`. Acceptance: readable over hero, condenses on scroll, Contact always reachable.

- [ ] **Step 2: Typecheck + visual.** Commit.
```bash
git add components/Navbar.tsx
git commit -m "feat: cosmic persistent navbar with Contact"
```

### Task 4.2: Hero

**Files:**
- Modify: `components/Hero.tsx`

- [ ] **Step 1: Rebuild** — full-viewport; `<StardustV />` centerpiece; Fraunces wordmark "VARDERER"; tagline *"Code is our Compass. Chaos is our Map."* (static, no typing/glitch); one-line positioning; primary CTA `Explore the Worlds` (`#games`) + secondary `Work with us` (`#contact`); subtle scroll cue. Acceptance: calm, premium, gold-on-void; no glitch artifacts.

- [ ] **Step 2: Visual review. Commit.**
```bash
git add components/Hero.tsx
git commit -m "feat: cosmic hero with stardust-V centerpiece"
```

### Task 4.3: Games — hybrid expand panel + per-game theming

**Files:**
- Create: `components/games/GameCard.tsx`
- Create: `components/games/GameDetailPanel.tsx`
- Modify: `components/GameGrid.tsx`

- [ ] **Step 1: `GameDetailPanel.tsx`** — given a `Game`, renders an expanding panel (framer-motion height/opacity) with: full description, genre chips, `status`, `award` (if any, gold badge), store buttons (Steam/itch via existing link-gating modal behavior), and a **gallery slot**: if `gallery.length` map images, else a styled "Media coming soon" placeholder frame. Built so adding screenshots later needs no code change.

- [ ] **Step 2: `GameCard.tsx`** — art (with graceful `onError` placeholder), title (Fraunces), logline, genres; click toggles the panel; on hover/open calls `useTheme().setAccent(game.accent)`, on close `resetAccent()`. Card border/glow uses `var(--accent)`.

- [ ] **Step 3: `GameGrid.tsx`** — `Section id="games"` with heading "Worlds", intro line, responsive grid of `GameCard`, single open panel at a time (track `openId`), keep the existing "unavailable link" `Modal`. Remove old card markup, grayscale, "Mission Log" copy, recharts—none.

- [ ] **Step 4: Typecheck + visual** — open/close animates, theme shifts to game accent then resets, placeholder gallery looks intentional, store-gating modal still works.

- [ ] **Step 5: Commit**
```bash
git add components/games/GameCard.tsx components/games/GameDetailPanel.tsx components/GameGrid.tsx
git commit -m "feat: hybrid games section with in-place detail panel + per-game theming"
```

### Task 4.4: Studio / Vision

**Files:**
- Create: `components/Studio.tsx`

- [ ] **Step 1: Build `Studio.tsx`** (`Section id="studio"`) with drafted copy (edit live with user). Starting draft:
  - Heading: **"A studio of variables."**
  - Body: *"Varderer is Variable + Wanderer. We are the variables — makers who wandered, found each other, and chose to build together. Founded in 2023 in Thailand, we're a team of nine: a founding core and a second wave who joined as the studio grew."*
  - Belief: *"We build at the overlap of two forces — what players are hungry for, and what we can't stop making. We chase market demand and personal obsession until they meet. Our north star: given no limits, invent a genre that lives up to our name — games that bend and wander with the player."*
  - **Traction row** (gold-accented stat cards): `Rising Star — BU GAME ON · Baby May Cry`; `Semi-finalist — Thailand Game Festival · NChanter`. (No fabricated numbers.)

- [ ] **Step 2: Visual review with user; adjust prose. Commit.**
```bash
git add components/Studio.tsx
git commit -m "feat: studio/vision section with belief copy + real traction"
```

### Task 4.5: The Variables — summon cards (signature)

**Files:**
- Create: `components/team/SummonCard.tsx`
- Create: `components/team/SummonReveal.tsx`
- Modify/Replace: `components/TeamGrid.tsx`
- Delete: `components/CharacterSheetModal.tsx`, `components/ui/Tooltip.tsx` (if now unused)

- [ ] **Step 1: `SummonCard.tsx`** — scannable card face: celestial-duotone portrait (CSS filter for consistency; `onError` → generated constellation-initial avatar), name (Fraunces), real role. Hairline-gold frame; hover lifts + faint accent glow. Click → opens `SummonReveal`.

- [ ] **Step 2: `SummonReveal.tsx`** — modal/overlay: on open, a short stardust burst (lightweight canvas, reduced-motion = instant) resolves into the full portrait with an accent flash (`member.accent`), then slides in detail: `clazz` (flavor title) + `classDescription`, `specialties`, `tools`, `bio`, and a portfolio button — **enabled** linking to `portfolioUrl` when present, **disabled** "Portfolio — coming soon" when undefined. Esc/overlay closes.

- [ ] **Step 3: `TeamGrid.tsx`** → rename heading to **"The Variables"**, subhead *"Nine variables, one union."*, responsive grid of `SummonCard`, manages selected member + reveal open state (port the existing open/close pattern). Remove all radar/level/Tooltip code.

- [ ] **Step 4: Remove dead files** — delete `CharacterSheetModal.tsx`; delete `Tooltip.tsx` only if no remaining imports (grep first).

- [ ] **Step 5: Typecheck + visual** — faces scannable without clicking; summon burst + accent flash feel earned; reduced-motion shows instant reveal; disabled portfolio state reads cleanly.

- [ ] **Step 6: Commit**
```bash
git add components/team/ components/TeamGrid.tsx
git rm components/CharacterSheetModal.tsx
git commit -m "feat: The Variables summon-card team section, drop character sheet/stats"
```

### Task 4.6: Contact (Formspree + studio kit slot)

**Files:**
- Create: `components/Contact.tsx`

- [ ] **Step 1: Build `Contact.tsx`** (`Section id="contact"`, heading *"Chart a course with us."*): visible `vardererstudio@gmail.com`, and a form (name, studio, message) POSTing to a Formspree endpoint read from `import.meta.env.VITE_FORMSPREE_ID` (fallback: form disabled with a note if unset). Success/error states inline. Plus a **"Download studio kit"** button rendered disabled with "coming soon" (slot for the future PDF). Note in code comment: set `VITE_FORMSPREE_ID` in Vercel env + `.env.local`.

- [ ] **Step 2: Typecheck + visual** — submitting (once `VITE_FORMSPREE_ID` set) lands in inbox; without it, the form shows the disabled note, email still visible.

- [ ] **Step 3: Commit**
```bash
git add components/Contact.tsx
git commit -m "feat: contact section with Formspree form + studio-kit slot"
```

### Task 4.7: Footer + SystemTicker removal

**Files:**
- Modify: `components/Footer.tsx`
- Delete: `components/SystemTicker.tsx`, `components/Preloader.tsx` (decide in step)

- [ ] **Step 1: Rebuild `Footer.tsx`** — wordmark, one-line studio descriptor, nav anchors, socials + itch/Steam links, `© 2026 Varderer Game Studio · Thailand`. Cosmic minimal.

- [ ] **Step 2: Remove `SystemTicker`** (ticker is old-aesthetic). Decide on `Preloader`: keep only if reworked to a cosmic fade (otherwise delete). Default: delete both; if kept, rework Preloader to a simple gold starburst fade.

- [ ] **Step 3: Commit**
```bash
git add components/Footer.tsx
git rm components/SystemTicker.tsx
git commit -m "feat: cosmic footer; remove SystemTicker"
```

---

## Phase 5 — Assembly, theming polish, accessibility, responsive

### Task 5.1: Wire `App.tsx`

**Files:**
- Modify: `App.tsx`

- [ ] **Step 1: Replace `App.tsx`** — remove smooth-scroll JS (CSS `scroll-behavior` handles it) and old preloader logic; compose:
```tsx
import './index.css';
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

const App: React.FC = () => (
  <ThemeProvider>
    <Starfield />
    <Navbar />
    <main>
      <Hero />
      <GameGrid />
      <Studio />
      <TeamGrid />
      <Contact />
    </main>
    <Footer />
  </ThemeProvider>
);
export default App;
```

- [ ] **Step 2: Full build + run** — `npm run build` passes; `npm run dev` shows the full page top-to-bottom with no console errors.

- [ ] **Step 3: Commit**
```bash
git add App.tsx
git commit -m "feat: assemble cosmic single-page app"
```

### Task 5.2: Responsive + accessibility pass

**Files:** any section needing fixes (modify in place)

- [ ] **Step 1: Mobile sweep** at 375/768/1280px — starfield density drops, hero V scales, games grid stacks, summon reveal fits, nav menu works.
- [ ] **Step 2: A11y** — toggle OS reduced motion → no heavy animation anywhere (3D fallback, instant summon, static starfield); keyboard-tab through nav/cards/form; focus-visible rings in gold; images have `alt`; form inputs have labels; color contrast of `--text-dim` on `--bg` ≥ 4.5:1 (adjust token if not).
- [ ] **Step 3: Commit** `git commit -am "fix: responsive + accessibility pass"`

### Task 5.3: Per-game theming polish

- [ ] **Step 1:** Confirm opening each game shifts `--accent` (border/glow/buttons/selection) and closing resets to gold; transitions are smooth (CSS transition on accent-driven properties). Tune transition timing with user. Commit any tweaks.

---

## Phase 6 — Verification & deploy

### Task 6.1: Final verification gates

- [ ] **Step 1:** `npx tsc --noEmit` → clean.
- [ ] **Step 2:** `npm run build` → succeeds; check bundle: three/fiber chunk is lazy-loadable (consider `React.lazy` for `StardustV` if hero bundle is heavy — implement only if build flags it large).
- [ ] **Step 3:** `npm run preview` → click every CTA, open/close each game, summon each member, submit the contact form (with `VITE_FORMSPREE_ID` set), confirm reduced-motion mode. No console errors.

### Task 6.2: Deploy

- [ ] **Step 1:** Confirm Vercel build settings (Vite preset, `npm run build`, output `dist`). Add `VITE_FORMSPREE_ID` to Vercel env.
- [ ] **Step 2:** Merge the feature branch and let Vercel deploy; smoke-test the production URL.

---

## Open inputs the user still owes (slot now, fill later)
- Per-member `portfolioUrl` values (documented spot in `data/team.ts`).
- Game `gallery` screenshots / `trailerUrl` (slots built; placeholders until provided).
- Final logo from their team (animated placeholder ships meanwhile).
- `VITE_FORMSPREE_ID` (form gracefully disabled until set).
- The actual studio-kit PDF (button ships as "coming soon").

## Self-review notes (coverage vs brief)
- Cosmic dark + gold + compass/V ✓ (Phase 0 tokens, 2.2, fallback SVG). Serif+sans ✓ (0.2/0.1). Per-game theming ✓ (1.2, 4.3, 5.3). Concentrated motion + reduced-motion ✓ (2.1, 2.2, 5.2). Summon signature, scannable face, no fake stats ✓ (4.5, 3.2). Hybrid games ✓ (4.3). Home order Hero→Games→Studio→Team→Contact→Footer ✓ (5.1). Vision + real traction, no fabrication ✓ (4.4). Contact email+Formspree+kit slot ✓ (4.6). Drop recharts/CDN/router, Vercel ✓ (0.1/0.2, no router added). Section name "The Variables" ✓ (4.5).
