---
phase: 8
status: complete
completed_at: 2026-05-30
build: pass
---

# Phase 08 — Architecture Refactor v2.0

## Done

### Render mode: static export → Vercel SSR
- `next.config.ts`: removed `output: 'export'` + `images.unoptimized`; enabled image optimization (avif/webp); kept `trailingSlash`
- Build now emits SSR/prerendered routes (○ Static) instead of static export — unlocks middleware + API routes for later phases

### Dark mode (DARK-01..05)
- `globals.css`: added `@custom-variant dark` (Tailwind v4), dark surface tokens (ink/cream), `.dark` semantic token swap, body color transition, expanded `prefers-reduced-motion` guard
- `components/theme/ThemeProvider.tsx`: next-themes wrapper (attribute=class, system default)
- `components/theme/ThemeToggle.tsx`: animated sun/moon toggle, hydration-safe
- `layout.tsx`: wrapped in ThemeProvider, `suppressHydrationWarning` on `<html>`

### Animation primitives (ANIM-02/03/04/07/10)
- `components/animations/Reveal.tsx` — scroll fade+rise, reduced-motion aware
- `components/animations/CountUp.tsx` — number count-up on inView
- `components/animations/Parallax.tsx` — scroll-linked y transform
- `components/animations/MagneticButton.tsx` — cursor-follow spring

### Multi-level navigation (NAV-01..05, NAV-07)
- `lib/nav.ts` — single source of truth for nav structure (route links + dropdown children)
- `components/nav/Navbar.tsx` — desktop dropdown, active highlight, sticky scroll-compress, hotline + CTA + ThemeToggle
- `components/nav/MobileMenu.tsx` — hamburger + accordion sub-items, ESC/route-change close, body scroll lock
- `components/nav/Breadcrumbs.tsx` — breadcrumb UI + BreadcrumbList JSON-LD
- Old `components/layout/Nav.tsx` deleted (replaced)
- `layout.tsx` uses `<Navbar/>`
- `Footer.tsx` switched from anchor links to route links via `navItems`

## Dependencies installed
- `motion@^12.40.0`, `next-themes@^0.4.6`

## Known state after this phase
- Nav now links to routes that DON'T EXIST YET (`/ve-chung-toi`, `/dich-vu`, `/nang-luc`, `/tin-tuc`, `/lien-he`) → these 404 until built in Phases 10–15. Expected — infra-first.
- Landing `/` still uses v1.0 sections (anchor-based internal). Will be rebuilt Phase 09.
- Dark mode tokens defined but most v1.0 section components still use hardcoded `bg-bone`/`text-espresso` (not yet `var(--color-*)`); they'll get dark-aware treatment as each is rebuilt in Phases 09+.

## Build
`npm run build` → PASS. First-load JS 102KB shared (motion code-split, not global bloat).

## Deferred to later phases
- Wrapping app in `[locale]` segment → Phase 16 (i18n) — done last to avoid path churn across all phases
- API route (`app/api/quote`) → Phase 14
- MDX config in next.config → Phase 15
