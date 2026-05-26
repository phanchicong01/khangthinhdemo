# Phase 2: Layout Shell - Context

**Gathered:** 2026-05-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Persistent shell (Nav + Footer + FloatingZalo) renders on every route, exposes the hotline + Zalo + email CTAs, and is real-device smoke-tested before any section work begins.

**In scope:**
- `Nav` component (sticky, logo + 5 anchors + CTA "Báo giá" + hotline)
- `Footer` component (3-column desktop / 1-column mobile with legal info, quick links, contact)
- `FloatingZalo` button (fixed bottom-right, ≥56×56px, deep-link `https://zalo.me/0921985599`)
- Root `layout.tsx` wiring: default metadata, viewport, `lang="vi"`, Nav/Footer/FloatingZalo around `{children}`
- Smooth-scroll behavior + `scroll-margin-top` for anchor targets
- Real-device CTA smoke test (iOS Safari + Android Chrome)

**Out of scope (other phases):**
- Section components inside the page (Phase 3)
- Projects list `/du-an` page content (Phase 4)
- SEO sitemap/robots/JSON-LD (Phase 5)
- Active section highlight via IntersectionObserver (deferred — see Deferred Ideas)

</domain>

<decisions>
## Implementation Decisions

### Nav (visual + structure)
- **D-01:** Logo = **text-only wordmark** — "KHANG THỊNH INV" in `font-black uppercase` burgundy. No image asset needed at this phase; can swap to logo SVG/PNG later without breaking layout.
- **D-02:** Mobile menu (<768px) pattern = **slide-down accordion** triggered by hamburger. Menu drops from under the nav containing 5 anchor links + CTA + hotline. CSS-only (`peer-checked`) or minimal `useState` — no overlay, no scroll-lock complexity.
- **D-03:** Hotline visibility = **Desktop visible + Mobile in menu**. Desktop ≥768px shows hotline icon+text inline in nav bar. Mobile shows hotline only inside the expanded menu drawer (keeps mobile nav uncluttered).
- **D-04:** CTA "Báo giá" style = **solid burgundy button**. `bg-burgundy text-bone px-5 py-3 rounded-sm`, hover → `bg-burgundy-dark`. Industrial, conversion-focused.

### Nav anchors & labels
- **D-05:** Anchor slugs = **Vietnamese**: `#dich-vu`, `#du-an`, `#nang-luc`, `#doi-tac`, `#lien-he`. Aligns with `/du-an` route convention and Vietnamese-only audience.
- **D-06:** Anchor labels (Vietnamese, in order): **"Dịch vụ" → "Dự án" → "Năng lực" → "Đối tác" → "Liên hệ"**. 5 links matches roadmap SC1.
- **D-07:** CTA "Báo giá" target = **`#lien-he`** (smooth-scroll to Contact section). Phase 3 can retarget to a dedicated `#bao-gia` CtaQuote section if needed; for now `#lien-he` is the safe default.
- **D-08:** Active section highlight on scroll = **NOT implemented in Phase 2**. Hover state only. Keeps Nav as pure server component; avoids IntersectionObserver client-side complexity. (Deferred — see Deferred Ideas.)

### Footer (layout + content)
- **D-09:** Footer grid = **3 columns desktop / 1 column mobile stacked**.
  - Col 1: Company info — wordmark + legal block (MST 1102 107 064, ĐDPL Tô Thị Bích Ngọc, full address) sourced from `lib/site.ts`.
  - Col 2: Quick links — same 5 anchor links as Nav + `/du-an` route link.
  - Col 3: Contact — 3 CTA channels (`tel:+84921985599`, `https://zalo.me/0921985599`, `mailto:khangthinhinv2025@gmail.com`) with display text next to each link.
- **D-10:** Quick links in footer = **YES, same 5 anchors as Nav** + `/du-an` route. Helps users navigate from page bottom without scrolling back up.
- **D-11:** Copyright line = **`© 2025 KHANG THỊNH INV. All rights reserved.`** (fixed year 2025 — founding year, simple).
- **D-12:** Social/external links = **NONE**. No Facebook/LinkedIn page exists yet. Zalo CTA already in contact column covers messaging.

### FloatingZalo (visual + behavior)
- **D-13:** Icon = **Lucide `MessageCircle` (inline SVG)**. Legal-safe (no Zalo brand assets needed), consistent sizing with other icons. Accept that brand recognition is slightly lower than official Zalo logo — mitigated by aria-label + position familiarity.
- **D-14:** Background color = **burgundy** (`bg-burgundy`), icon = bone (`text-bone`). Aligns with site palette; stands out against bone page background without competing color systems.
- **D-15:** Style = **icon-only, no text label**. Round button 56×56px, `aria-label="Chat Zalo với Khang Thịnh"` for screen readers. Most Vietnamese users recognize a chat-bubble icon in bottom-right as messaging CTA.
- **D-16:** Animation = **static** — hover scale 1.05 + shadow lift, active scale 0.95. No pulse, no bounce, no continuous animation (professional tone, not casino/spammy).

### Cross-cutting (locked from prior phases / PITFALLS)
- **D-17:** Phone link = `tel:+84921985599` (E.164, no spaces) — pre-built helper `telHref()` in `lib/site.ts`.
- **D-18:** Zalo URL = `https://zalo.me/0921985599` (HTTPS only — never `zalo://`) — pre-built helper `zaloHref()`.
- **D-19:** Email link = `mailto:khangthinhinv2025@gmail.com` + plain-text email next to it (fallback if mailto fails) — pre-built helper `mailtoHref()`.
- **D-20:** All anchor target sections must have `scroll-margin-top: 4.5rem` (or equivalent Tailwind utility) — applied at section level, not nav level.
- **D-21:** Tap targets: Nav buttons ≥44×44px; FloatingZalo ≥56×56px. Hamburger icon area ≥44×44px.
- **D-22:** All Nav/Footer/FloatingZalo data sources MUST import from `src/lib/site.ts` — no hardcoded company info.

### Claude's Discretion
- Exact Tailwind class composition (shadow values, transition durations, font-weight per element) — let planner/executor decide based on Phase 1 tokens.
- Whether to add `id` anchors to sections in Phase 2 (placeholder `<section id="...">` empty divs) or defer to Phase 3 — SC4 says nav anchors must smooth-scroll; placeholders are easier to verify in Phase 2.
- Whether `Nav` mobile menu uses `useState` or CSS-only (`peer-checked`) — both acceptable; pick whichever has cleaner accessibility (focus management, ESC to close).
- Footer column alignment (top-aligned vs baseline) — planner picks.
- Whether to add `prefers-reduced-motion` guard on Nav/FloatingZalo transitions — recommended but not blocking.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-level
- `.planning/PROJECT.md` — Core value, requirements, out-of-scope list (especially "no contact form", "no social embeds")
- `.planning/REQUIREMENTS.md` — SHELL-01..05 acceptance criteria
- `.planning/ROADMAP.md` §Phase 2 — Success criteria SC1-SC6, risk callouts
- `/Users/congphan/Workspace/my-projects/khang-thing-group/CLAUDE.md` — Company facts canonical source (MST, ĐDPL, phone, email, address)

### Phase 1 outputs (consumed by Phase 2)
- `src/lib/site.ts` — Single source of truth. `siteUrl`, `company`, `telHref()`, `zaloHref()`, `mailtoHref()`
- `src/app/globals.css` — Tailwind v4 `@theme` palette tokens (`bg-burgundy`, `text-bone`, `bg-espresso`, etc.) and Be Vietnam Pro font wiring
- `src/app/layout.tsx` — Existing root layout (metadata, viewport, `lang="vi"`) — must extend with Nav/Footer/FloatingZalo
- `.planning/phases/01-foundation-lock-in/01-01-config-tokens-fonts-SUMMARY.md` — Token names + font weights available
- `.planning/phases/01-foundation-lock-in/01-02-site-constants-cleanup-SUMMARY.md` — Site constants API

### Research (relevant pitfalls)
- `.planning/research/PITFALLS.md` §"tel:/Zalo CTAs" — `tel:+84921985599` E.164 mandatory, `https://zalo.me/0921985599` (never `zalo://`), email link + plain-text fallback
- `.planning/research/PITFALLS.md` §"Sticky nav covering anchor" — `scroll-margin-top: 80px` (or 4.5rem) on anchor targets
- `.planning/research/PITFALLS.md` §"Tap targets" — ≥44×44px enforcement
- `.planning/research/SUMMARY.md` — Phase 2 marked "no research needed" — sticky nav + floating CTA is well-documented

### External (no external specs required for this phase)
No external ADRs/specs for Phase 2 — sticky nav + footer + FAB is fully covered by Next.js + Tailwind docs.

</canonical_refs>

<deferred>
## Deferred Ideas

These came up during discussion but belong outside Phase 2 scope. Captured to avoid losing them.

- **Active section highlight in Nav on scroll** — Requires IntersectionObserver client component. Defer to a polish phase or backlog (`/gsd:add-backlog`). UX nice-to-have, not on critical conversion path.
- **Map embed in Footer** (Google Maps or static iframe) — Mentioned as a possible col 2/3 alternative. Out of scope per PROJECT.md "Out of Scope: Google Maps embed".
- **Scroll-to-top button** — Common companion to FloatingZalo. Not requested in roadmap; defer.
- **Page transitions / route animations** — Single-page anchor scroll; `/du-an` is a separate route. Could add fade-in once Phase 4 ships; out of Phase 2 scope.
- **Logo image swap (PNG/SVG from PDF)** — Will become possible once an official logo asset is extracted from the company profile PDF. For now text wordmark is the contract.
- **Nav dropdown for "Dịch vụ" sub-services** (Cát/Đá/Xây dựng/Vận chuyển split) — Phase 3 Services section handles segmentation. Nav stays flat at 5 anchors.

</deferred>

<open_questions>
## Open Questions for Planning

These need answers DURING planning (not from user — planner derives them from codebase + this CONTEXT.md):

1. **Component file structure** — `src/components/Nav.tsx`, `src/components/Footer.tsx`, `src/components/FloatingZalo.tsx` directly, OR `src/components/layout/{Nav,Footer,FloatingZalo}.tsx`? Planner picks based on whether future component subgroups (sections/ vs layout/) are anticipated (Phase 3 will add `sections/`).
2. **Server vs client component split** — Nav with mobile-menu `useState` would be `'use client'`; Footer is server; FloatingZalo is server (just an `<a>`). If mobile menu uses CSS-only (`peer-checked`), Nav stays server.
3. **Anchor placeholders in Phase 2** — Should `app/page.tsx` get empty `<section id="dich-vu">…</section>` placeholders so SC4 (smooth-scroll) can be verified end-to-end? Recommended YES — keeps Phase 1 sentinel as a top section, adds 5 minimal placeholder sections below.
4. **Real-device smoke test execution** — Should be a manual user-action plan (autonomous: false) OR a checklist in SUMMARY.md the user signs off on? Recommended: dedicated smoke-test plan, autonomous: false, with checkpoint asking user to confirm iOS/Android tap behavior.

</open_questions>

<next_steps>
## Next Steps

1. Optional: `/gsd:research-phase 2` — but per ROADMAP "Research needed: NO" and `.planning/research/SUMMARY.md`, can skip.
2. **Run `/gsd:plan-phase 2`** — Planner reads this CONTEXT.md + Phase 1 SUMMARY files + `lib/site.ts` to produce 2 plans:
   - Plan 02-01: Shell components (Nav + Footer + FloatingZalo + layout wiring + anchor placeholders) — autonomous
   - Plan 02-02: Real-device CTA smoke test — autonomous: false (user-action checkpoint)
3. After plan-checker PASS, run `/gsd:execute-phase 2`.

</next_steps>
