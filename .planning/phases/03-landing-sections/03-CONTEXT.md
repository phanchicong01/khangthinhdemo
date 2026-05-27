# Phase 3: Landing Sections - Context

**Gathered:** 2026-05-27
**Status:** Ready for planning

<domain>
## Phase Boundary

All 8 landing sections render on `/` in this exact order: **Hero → PartnersMarquee → Services → Projects → BigStats → Capabilities → CtaQuote → Contact**, with hardcoded Vietnamese copy from the design spec, reusable tokens from Phase 1, and proper anchor wiring to the existing Nav (Phase 2).

**In scope:**
- 8 new section components in `src/components/sections/`
- Replace the 5 placeholder `<section>` blocks in `src/app/page.tsx` with real composed sections
- Delete the Phase 1 sentinel debug card inside `#nang-luc`
- Honest Vietnamese B2B copy (no fake "20 năm kinh nghiệm")
- Industrial design language using Burgundy/Bone palette + Be Vietnam Pro
- CSS-only PartnersMarquee with `prefers-reduced-motion` guard
- Lucide-react icons for Services + Projects + Capabilities
- 5 anchor IDs (`#dich-vu`, `#du-an`, `#nang-luc`, `#doi-tac`, `#lien-he`) map to the section components per existing comments in `page.tsx`

**Out of scope (other phases):**
- `lib/projects.ts` typed data module + `/du-an` list route (Phase 4)
- SEO metadata, sitemap, JSON-LD GeneralContractor (Phase 5)
- Static OG image (Phase 5)
- Real project photos / drone footage / illustration images (out per FEATURES.md anti-features)
- Active section highlight in Nav (deferred per Phase 2 CONTEXT)
- Lighthouse perf audit (Phase 6)

</domain>

<decisions>
## Implementation Decisions

### Hero (SEC-01)
- **D-01:** Headline = **"CÔNG TRÌNH BỀN VỮNG · ĐỐI TÁC TIN CẬY"** rendered in Be Vietnam Pro `font-black uppercase tracking-wide` (weights 800-900). Trust-first B2B messaging — no over-claiming.
- **D-02:** Sub-text = **"Cung ứng VLXD · Xây dựng · Vận chuyển đường thủy. Đối tác Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn."** — places the strongest trust signal (military/government partners) in the first viewport.
- **D-03:** Background = **Blueprint grid CSS pattern**. Approach: `linear-gradient` lines (1px @ 30% opacity espresso on bone) at 40×40px tile. CSS-only, no images. Tone: construction/engineering, not photographic.
- **D-04:** CTAs (2 buttons, in this order):
  - **CTA1 (primary, solid burgundy):** label "Gọi 092 198 55 99", href = `telHref()` from `@/lib/site`.
  - **CTA2 (secondary, outline burgundy):** label "Báo giá", href = `#lien-he`.
  - Tap targets ≥44×44px (carry forward from Phase 2 D-21).
- **D-05:** Hero layout: text-left desktop / centered mobile. No carousel, no hero video (per FEATURES.md anti-features). Hero is single static composition.

### PartnersMarquee (SEC-02)
- **D-06:** Marquee text content = **"BỘ QUỐC PHÒNG · BINH ĐOÀN 12 · TRƯỜNG SƠN · CÀ MAU"** (4 tokens). Separator = `·` (middle dot, `\u00B7`). The token list repeats 2–3× within a single track span so the track length comfortably exceeds the viewport.
- **D-07:** Animation = CSS `@keyframes` translating `transform: translateX` only (no JS, no `left/right` properties). `will-change: transform` on the moving track. Duration = **40s per full cycle**. Direction left-to-right or right-to-left — planner picks for visual cohesion with rest of page.
- **D-08:** Fade edges on both sides via `mask-image: linear-gradient(...)` (≈8% of width fade-in/out). Keeps text from cutting in/out abruptly.
- **D-09:** `prefers-reduced-motion: reduce` MUST pause the marquee (`animation-play-state: paused` or `animation: none`). Mandatory per roadmap SC3 and PITFALLS #12.
- **D-10:** Section background = `bg-espresso text-bone` (dark band, sits between Hero bone bg and Services). Provides visual breathing between bone-heavy sections.

### Services (SEC-03)
- **D-11:** Three cards in this exact order with these Lucide icons:
  - **Cung ứng VLXD (Cát · Đá · San lấp)** — icon `Truck`
  - **Xây dựng dân dụng** — icon `HardHat`
  - **Vận chuyển đường thủy** — icon `Ship`
- **D-12:** Card layout = **icon-top vertical**. Structure per card: icon (size 48, color `text-burgundy`) → title (Be Vietnam Pro font-bold uppercase 2xl) → 1–2 line description in `text-espresso`. Grid: 3-col desktop (md:grid-cols-3) / 1-col mobile.
- **D-13:** Card visual = `bg-bone-dark` with `border border-taupe`, hover lift `hover:shadow-md transition` (no transform that triggers layout shift).
- **D-14:** **NO** per-card "Tìm hiểu thêm" link in Phase 3 — keep cards informational only. Future phase can add detail routes if scope expands.

### Projects (SEC-04)
- **D-15:** Layout = **Grid 2×2 desktop, 1-col mobile** (`grid-cols-1 md:grid-cols-2`). All 4 projects treated as equal-weight tiles — no hero-featured asymmetry.
- **D-16:** Project data (hardcoded in Phase 3 as a plain `const` inside the component — Phase 4 will extract to `lib/projects.ts`):

  | Field | Project 1 | Project 2 | Project 3 | Project 4 |
  |-------|-----------|-----------|-----------|-----------|
  | name | "Cao tốc Cái Nước — Đất Mũi Cà Mau" | "Cầu Cửa Lớn — Đất Mũi Cà Mau" | "Đường giao thông ra đảo Hòn Khoai" | "Nhà phố tiêu biểu" |
  | client | "Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn" | "Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn" | "Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn" | "Cô Thúy (Thạnh Hóa) · Anh Bình (Mỹ Yên) · Chị Ngọc (Long An)" |
  | year | "2024" | "2024" | "2024" | "2025" |
  | role | "Cung ứng VLXD + vận chuyển" | "Cung ứng VLXD + vận chuyển" | "Cung ứng VLXD + vận chuyển" | "Thi công xây dựng" |
  | icon | `Construction` (highway) or `MapPinned` — planner picks single best Lucide name | `GitBranch` (bridge) or `Waypoints` — planner picks | `Anchor` (island/sea) | `Home` |

  **Note:** Exact icon choice is Claude's discretion within the listed candidates — pick the one that reads cleanest at 48px. Years are best-guess for the construction projects; if exact years are unverified, the executor MUST flag this in the SUMMARY and the user clarifies before Phase 4.
- **D-17:** Card structure: top color block (200px tall, alternating `bg-burgundy` / `bg-espresso` for visual variety) with the icon centered + project icon, followed by name (font-bold), client (smaller text-taupe), year + role on a single bottom row.
- **D-18:** Card content order: **Name (largest) → Client (named — front-and-center per FEATURES.md) → Year + Role (smallest, bottom row)**.
- **D-19:** CTA "Xem tất cả dự án →" = **outline burgundy button** centered **below the 4-card grid** (no duplicate in section header). Links to `/du-an` (Phase 4 will populate that route).

### BigStats (SEC-05)
- **D-20:** Four stats in this order:

  | # | Number | Label |
  |---|--------|-------|
  | 1 | **3,900** | "Tấn — Tải trọng đội tàu" |
  | 2 | **4** | "Dự án tiêu biểu" |
  | 3 | **2025** | "Năm thành lập" |
  | 4 | **3** | "Đối tác Quốc phòng" |
- **D-21:** Layout = **4-col tiles desktop / 2×2 mobile**. Each tile: big number `font-black text-5xl md:text-6xl text-burgundy` on top, small uppercase label `text-sm tracking-widest text-espresso` below. Background `bg-bone-dark` with `border-l-4 border-burgundy`.
- **D-22:** **NO count-up animation** — static numbers only. Per FEATURES.md anti-features: "Counter animations distract, VN older audience finds annoying". Improves Lighthouse Performance.

### Capabilities (SEC-06)
- **D-23:** Three capability groups (3-col desktop / stacked mobile):
  - **Đội tàu** — icon `Ship`
  - **Cơ giới** — icon `Truck` (or `Wrench` — planner picks)
  - **Đội xây lắp** — icon `HardHat`
- **D-24:** Each capability group structure:
  - Icon (48px, `text-burgundy`)
  - Title (font-bold uppercase, 2xl)
  - 3–4 bullet points (`<ul>` with hyphen markers or Lucide `Check` icon prefix) describing concrete capabilities. Examples (planner refines exact wording, keep B2B register):
    - **Đội tàu:** "Tải trọng tối đa 3,900 tấn", "Hoạt động vùng Đồng bằng Sông Cửu Long", "Đăng kiểm + giấy phép đầy đủ", "Vận chuyển VLXD + thiết bị công trình"
    - **Cơ giới:** "Đội xe vận tải + máy san lấp", "Trang thiết bị thi công công trình", "Bảo dưỡng định kỳ", "Sẵn sàng huy động 24/7"
    - **Đội xây lắp:** "Đội ngũ có kinh nghiệm dự án quốc gia", "Thi công nhà phố + công trình dân dụng", "Phối hợp đa lĩnh vực: cung ứng + thi công + vận chuyển", "Tuân thủ tiêu chuẩn an toàn xây dựng"
- **D-25:** Background = `bg-bone` (light), so it visually balances the dark espresso bands above (PartnersMarquee, CtaQuote).

### CtaQuote (SEC-07)
- **D-26:** Layout = **full-width banner** with `bg-espresso text-bone`. Per roadmap SC7 (espresso, not burgundy).
- **D-27:** Banner copy:
  - Headline: **"YÊU CẦU BÁO GIÁ NGAY HÔM NAY"** (font-black uppercase, text-3xl md:text-4xl/5xl)
  - Sub-text: **"Tư vấn miễn phí · Phản hồi trong 24 giờ · Báo giá theo khối lượng + điểm giao"**
- **D-28:** Single CTA button: **"Gọi 092 198 55 99"** = solid burgundy on bone band over espresso. href = `telHref()`. Tap target ≥44×44px.
- **D-29:** Banner has no anchor ID (it's a CTA strip between Capabilities and Contact, not a Nav target). However, Nav CTA "Báo giá" still scrolls to `#lien-he` (Contact) per Phase 2 D-07.

### Contact (SEC-08)
- **D-30:** Layout = **2-col desktop / 1-col mobile**. Left column = company info; right column = 3 CTA buttons.
- **D-31:** Left column content (sourced from `lib/site.ts`):
  - Section heading: **"Liên hệ"** (font-black uppercase, text-3xl)
  - Tagline: **"Hợp tác cùng phát triển"** (italic, smaller)
  - Legal block (one item per line): `company.legalName`, `MST: {company.taxIdDisplay}`, `ĐDPL: {company.legalRep}`, `Địa chỉ: {company.address.full}`
  - Optional: `"Giờ làm việc: 7:30 – 17:30 (T2 – T7)"` — Claude's Discretion based on whether user wants to commit to those hours.
- **D-32:** Right column = **3 large CTA buttons** stacked vertically:
  - **"Gọi 092 198 55 99"** — solid burgundy, icon `Phone`, href = `telHref()`
  - **"Chat Zalo"** — solid burgundy, icon `MessageCircle`, href = `zaloHref()`
  - **"Gửi email"** — outline burgundy, icon `Mail`, href = `mailtoHref()` PLUS plain-text email `{company.email}` visible next to the button (PITFALLS #7 email plain-text fallback).
  - Each CTA `min-h-[44px]`, full-width within the column.

### Cross-cutting (locked across all sections)
- **D-33:** **Vertical rhythm** between sections = `py-20 md:py-24` (8rem desktop, 5rem mobile). Sections alternate background (bone / bone-dark / espresso / bone) for visual rhythm — planner finalizes the exact alternation pattern.
- **D-34:** **All section components live in `src/components/sections/`** (Phase 2 D established `src/components/layout/` for shell; sections get their own folder per the clean-boundary anticipation in Phase 2 CONTEXT q1).
- **D-35:** **All sections are server components by default**. Only mark `'use client'` if a section truly needs state — none of the 8 sections require state in Phase 3 (no count-up, no carousel, no nav, no modal). Marquee is CSS-only so no client component.
- **D-36:** **All CTA hrefs MUST use `telHref()`, `zaloHref()`, `mailtoHref()` from `@/lib/site`** — never hardcode phone/email/zalo URLs. (Carry forward D-22 from Phase 2.)
- **D-37:** **B2B trust copy register** per PITFALLS #8 and FEATURES.md: short verb-led Vietnamese ("Gọi ngay để tư vấn", "Báo giá VLXD"), no translated-Apple cadence, no fake testimonials, MST + named clients prominent.
- **D-38:** **No real photographs** in Phase 3 — CSS color blocks + Lucide icons only. Photos can be added in a later phase once the company provides asset library.
- **D-39:** **`scroll-margin-top: 4.5rem`** rule from Phase 1 globals.css applies — section headings under sticky nav remain visible after anchor click (carry forward Phase 2 D-20).
- **D-40:** **Delete the Phase 1 sentinel `<details>` debug card** currently inside `#nang-luc` in `app/page.tsx` as part of this phase.

### Claude's Discretion
- Exact Tailwind class composition (shadow values, transition durations, exact px sizes within stated ranges).
- Lucide icon variants when D-16/D-23 list candidates — pick the cleanest at 48px.
- Whether Hero is split-layout (text-left, decorative-right) or centered single-column — try both at 1280px and 375px, pick whichever respects the blueprint pattern best.
- Exact bullet wording for Capabilities (D-24 lists examples; refine for B2B Vietnamese register).
- Whether "Giờ làm việc" appears in Contact left column (D-31) — include only if it's a confirmed commitment.
- Exact alternation pattern of background colors across the 8 sections (D-33) — must avoid two `bg-espresso` sections adjacent.
- Whether the Hero CTA1 displays "Gọi" + phone in two lines on mobile (when 092 198 55 99 makes the button too wide) — planner decides via Tailwind responsive classes.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-level
- `.planning/PROJECT.md` — Core value, requirements, out-of-scope list (no contact form, no fake "20 năm", no photo placeholders that lie about scale)
- `.planning/REQUIREMENTS.md` — SEC-01..08 acceptance criteria
- `.planning/ROADMAP.md` §Phase 3 — Success criteria SC1-SC7, risk callouts (Pitfalls #5/#8/#12)
- `/Users/congphan/Workspace/my-projects/khang-thing-group/CLAUDE.md` — Company facts canonical (MST, ĐDPL, phone, email, address, projects)
- `/Users/congphan/Workspace/my-projects/khang-thing-group/website/CLAUDE.md` — Project conventions (Vietnamese user-facing, English code, concise)

### Prior phase outputs (consumed by Phase 3)
- `src/lib/site.ts` — Single source of truth for company facts + CTA helpers (`telHref`, `zaloHref`, `mailtoHref`)
- `src/components/layout/Nav.tsx` — Existing anchor link targets (5 hash IDs)
- `src/components/layout/Footer.tsx` — Reuse legal block pattern if needed
- `src/components/layout/FloatingZalo.tsx` — Reference for icon/CTA component patterns
- `src/app/page.tsx` — File to be rewritten with composed real sections
- `src/app/layout.tsx` — Root layout (do NOT modify in Phase 3 — Nav/Footer/FloatingZalo wiring already done)
- `src/app/globals.css` — Existing scroll-margin-top + smooth scroll rule (do NOT remove)
- `.planning/phases/02-layout-shell/02-CONTEXT.md` — Layout shell decisions, especially anchor IDs and `scroll-margin-top`
- `.planning/phases/02-layout-shell/02-01-shell-components-SUMMARY.md` — Established `src/components/layout/` pattern
- `.planning/phases/01-foundation-lock-in/01-01-config-tokens-fonts-SUMMARY.md` — Available Tailwind tokens (`bg-burgundy`, `bg-bone-dark`, `bg-espresso`, `text-bone`, `text-espresso`, `border-burgundy`, `text-taupe`, etc.) and font weights

### Research / pitfalls
- `.planning/research/PITFALLS.md` §"Pitfall #5: Hero LCP fail" — keep CSS pattern; never load heavy image as LCP
- `.planning/research/PITFALLS.md` §"Pitfall #8: B2B trust copy" — Vietnamese B2B register, MST visible, no translated-Apple cadence
- `.planning/research/PITFALLS.md` §"Pitfall #12: Marquee jank" — `transform: translateX` only, `will-change: transform`, `prefers-reduced-motion` guard
- `.planning/research/FEATURES.md` §"Table Stakes" + §"Differentiators" + §"Anti-Features" — what to ship + what to consciously exclude
- `.planning/research/SUMMARY.md` — Phase 3 marked "no research needed" — presentational only

### External (no external specs required)
No external ADRs/specs for Phase 3 — content + presentation are derived from above docs.

</canonical_refs>

<deferred>
## Deferred Ideas

Captured to avoid losing them.

- **Real project photographs** — when company supplies asset library, swap CSS color blocks for photos. Out of Phase 3 scope.
- **Drone footage Hero video** — explicitly anti-feature per FEATURES.md.
- **Per-service "Tìm hiểu thêm" detail pages** — Phase 3 keeps Services informational; can add detail routes later.
- **Stat count-up animation** — explicitly anti-feature per FEATURES.md and D-22.
- **`#bao-gia` dedicated anchor for CtaQuote** — Phase 2 D-07 already decided CTA "Báo giá" targets `#lien-he`. CtaQuote stays anchor-less per D-29.
- **Google Maps embed in Contact** — out of scope per PROJECT.md.
- **Customer testimonials** — anti-feature for B2B VLXD per FEATURES.md.
- **Active section highlight in Nav while scrolling** — deferred from Phase 2.
- **Per-project detail routes (`/du-an/[slug]`)** — out of scope per PROJECT.md.
- **Hero "split layout" with illustration on right** — possible if `Illustration.png` from parent dir is brought in; revisit after Phase 3 once layout proven.
- **Carousel/slider on Hero or anywhere** — anti-feature per FEATURES.md.

</deferred>

<open_questions>
## Open Questions for Planning

Planner derives from codebase + this CONTEXT.md — do NOT re-ask user:

1. **File structure** — Confirm: `src/components/sections/{Hero,PartnersMarquee,Services,Projects,BigStats,Capabilities,CtaQuote,Contact}.tsx` (8 files), one per section. Index file `src/components/sections/index.ts` optional. Recommended yes for clean imports from `page.tsx`.
2. **Project years** — D-16 assumes 2024 for the 3 construction projects and 2025 for nhà phố. Years should be verifiable; if executor cannot confirm, flag as a Phase 4 follow-up (the `lib/projects.ts` extraction phase) and use "—" temporarily.
3. **Plan partition** — Recommend planner break into **2 or 3 plans**:
   - **Option A (2 plans):** Plan 03-01 = sections 1-4 (Hero, PartnersMarquee, Services, Projects) + page.tsx wiring; Plan 03-02 = sections 5-8 (BigStats, Capabilities, CtaQuote, Contact) + final compose + sentinel deletion.
   - **Option B (3 plans):** Plan 03-01 = Hero + PartnersMarquee + Services; Plan 03-02 = Projects + BigStats + Capabilities; Plan 03-03 = CtaQuote + Contact + final compose + sentinel cleanup.
   - Option A reduces orchestrator overhead; Option B keeps individual plan scope smaller (recommended if any one section is unexpectedly heavy). Planner picks.
4. **Hero split vs centered** — D-05 says text-left desktop. Planner verifies in build whether right-side stays empty (acceptable with blueprint pattern) or needs decorative element (avoid adding decoration that competes with CTAs).
5. **Card icon final picks** — D-16 lists multiple candidates; D-23 lists Truck vs Wrench. Planner commits to specific Lucide names in `acceptance_criteria` so executor doesn't guess.
6. **Background alternation pattern** — D-33 says "alternate bone/bone-dark/espresso/bone". Planner produces the exact 8-section sequence; suggested baseline: Hero(bone) · Partners(espresso) · Services(bone-dark) · Projects(bone) · BigStats(bone-dark) · Capabilities(bone) · CtaQuote(espresso) · Contact(bone-dark).

</open_questions>

<next_steps>
## Next Steps

1. (Optional) `/gsd:research-phase 3` — but per ROADMAP "Research needed: NO" and `.planning/research/SUMMARY.md`, skip.
2. (Optional) `/gsd:ui-phase 3` — generate UI-SPEC.md. Skip for Phase 3 if CONTEXT decisions are sufficient (recommended skip — design language already locked from Phases 1–2).
3. **Run `/gsd:plan-phase 3`** — Planner produces 2 or 3 PLAN.md files (see Open Question #3).
4. After `/gsd:plan-phase 3` passes the plan-checker, run `/gsd:execute-phase 3`.

</next_steps>
