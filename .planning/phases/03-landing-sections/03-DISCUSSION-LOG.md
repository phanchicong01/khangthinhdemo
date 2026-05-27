# Phase 3: Landing Sections — Discussion Log

**Session date:** 2026-05-27
**Mode:** discuss (interactive, no advisor)
**Audit scope:** Full Q&A trail for human review (not consumed by downstream agents)

---

## Pre-Discussion Analysis

**Domain:** 8 landing sections (Hero → PartnersMarquee → Services → Projects → BigStats → Capabilities → CtaQuote → Contact) rendering on `/` with hardcoded Vietnamese copy, Burgundy/Bone palette, Be Vietnam Pro tokens.

**Prior decisions carried forward:**
- Palette Burgundy + Bone, Be Vietnam Pro single font, tap targets ≥44/56px
- `tel:+84921985599` E.164, `https://zalo.me/0921985599`, `mailto:` + plain-text fallback
- `lib/site.ts` single source of truth
- `scroll-margin-top: 4.5rem` already in globals.css
- 5 anchor IDs (`#dich-vu`, `#du-an`, `#nang-luc`, `#doi-tac`, `#lien-he`) from Phase 2
- 3 CTA channels, no contact form, named clients front-and-center, no fake "20 năm"
- Lucide icons (lucide-react installed in Phase 2)
- CSS-only marquee, prefers-reduced-motion support
- Static export, server components by default

**Gray areas identified (grouped into 4 multi-section discussions to fit AskUserQuestion max-4-options constraint):**
1. Hero + Services (headline, CSS pattern, CTAs, icon picks, card layout)
2. Projects (layout, info per card, visual, CTA placement)
3. BigStats + Capabilities (which 4 numbers, stat layout, capability structure, animation)
4. PartnersMarquee + CtaQuote + Contact (marquee content/speed, banner copy/bg, contact layout)

User selected: **all 4 area groups**.

---

## Area 1: Hero + Services

### Q1.1: Hero headline
- **Options:** "CÔNG TRÌNH BỀN VỮNG · ĐỐI TÁC TIN CẬY" (Recommended) / brand+tagline / "ĐỐI TÁC QUỐC PHÒNG · DỰ ÁN QUỐC GIA"
- **User chose:** CÔNG TRÌNH BỀN VỮNG · ĐỐI TÁC TIN CẬY

### Q1.2: Hero CSS pattern
- **Options:** Blueprint grid (Recommended) / Diagonal stripes / Topographic contour / Solid bone + border accent
- **User chose:** Blueprint grid

### Q1.3: Hero CTAs
- **Options:** [Gọi 092 198 55 99] [Báo giá] (Recommended) / [Gọi ngay] [Chat Zalo] / [Báo giá miễn phí] [Xem dự án]
- **User chose:** [Gọi 092 198 55 99] [Báo giá]

### Q1.4: Service icons
- **Options:** Truck/HardHat/Ship (Recommended) / Mountain/Building2/Anchor / Package/Hammer/Sailboat
- **User chose:** Truck / HardHat / Ship

---

## Area 2: Projects

### Q2.1: Projects layout
- **Options:** Grid 2×2 (Recommended) / 1 large + 3 small / Horizontal scroll
- **User chose:** Grid 2×2

### Q2.2: Card info
- **Options:** Name + Client + Year + 1-line role (Recommended) / minimal Name+Client+Year / Name+Client+Year+Role+Scope (with volume/value)
- **User chose:** Name + Client + Year + 1-line role

### Q2.3: Card visual
- **Options:** CSS color block + project icon (Recommended) / unique CSS pattern per project / placeholder PNG image
- **User chose:** CSS color block + project icon

### Q2.4: "Xem tất cả" CTA placement
- **Options:** Centered button below grid (Recommended) / Section header text-link / Both
- **User chose:** Centered button below grid

---

## Area 3: BigStats + Capabilities

### Q3.1: BigStats numbers
- **Options:** 3,900 tấn · 4 dự án · 2025 · 3 đối tác QP (Recommended) / 700–3,900 tấn · 4 dự án · 3 lĩnh vực · 2025 / 3,900 tấn · 4 dự án · 3 tỉnh · 24/7
- **User chose:** 3,900 tấn · 4 dự án · 2025 · 3 đối tác QP

### Q3.2: BigStats layout
- **Options:** 4-col tiles desktop / 2×2 mobile (Recommended) / Horizontal banner inline / 2-col with narrative
- **User chose:** 4-col tiles desktop / 2×2 mobile

### Q3.3: Capabilities content structure
- **Options:** 3 groups (Đội tàu/Cơ giới/Xây lắp) with bullets (Recommended) / Single full-text with sub-headings / 4-cell capability grid (added permits + process)
- **User chose:** 3 groups with bullets

### Q3.4: Stat count-up animation
- **Options:** No — static (Recommended, per FEATURES.md anti-feature) / Subtle fade-in on viewport
- **User chose:** No — static numbers

---

## Area 4: PartnersMarquee + CtaQuote + Contact

### Q4.1: Marquee text content
- **Options:** "BỘ QUỐC PHÒNG · BINH ĐOÀN 12 · TRƯỜNG SƠN · CÀ MAU" (Recommended) / 3 names only / extended 6-item list with provinces
- **User chose:** BỘ QUỐC PHÒNG · BINH ĐOÀN 12 · TRƯỜNG SƠN · CÀ MAU

### Q4.2: Marquee speed + edges
- **Options:** 40s/cycle + fade edges (Recommended) / 60s no fade / 30s + pause-on-hover
- **User chose:** 40s/cycle + fade edges

### Q4.3: CtaQuote banner
- **Options:** Espresso bg + "YÊU CẦU BÁO GIÁ NGAY HÔM NAY" + 1 CTA Gọi (Recommended) / Burgundy bg + 2 CTAs (Gọi+Zalo) / Split 50/50 espresso+bone card
- **User chose:** Espresso bg + headline + 1 CTA Gọi

### Q4.4: Contact section layout
- **Options:** 2-col Info+3 CTAs (Recommended) / 3-col stack / Single col centered
- **User chose:** 2-col Info left + 3 CTAs right

---

## Closeout

- **All 4 selected areas covered**
- **No additional gray areas requested**
- **No scope creep attempts during session**
- **Deferred ideas captured:** real photos, drone video, per-service detail pages, count-up animation, #bao-gia dedicated anchor, Google Maps embed, testimonials, active section highlight, /du-an/[slug] detail, Hero split with illustration, carousels

## Decisions count
- 40 locked decisions (D-01 through D-40)
- 7 items under Claude's discretion
- 6 open questions for planner to resolve from codebase
- 11 deferred ideas
