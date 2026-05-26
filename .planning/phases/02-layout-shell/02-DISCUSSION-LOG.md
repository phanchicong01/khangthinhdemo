# Phase 2: Layout Shell — Discussion Log

**Session date:** 2026-05-26
**Mode:** discuss (interactive, no advisor)
**Audit scope:** Full Q&A trail for human review (not consumed by downstream agents)

---

## Pre-Discussion Analysis

**Domain:** Persistent shell (Nav + Footer + FloatingZalo) on every route, exposing hotline + Zalo + email CTAs, real-device smoke-tested.

**Prior decisions carried forward (no re-asking):**
- Palette Burgundy + Bone (light mode)
- Be Vietnam Pro single font
- `tel:+84921985599` E.164, `https://zalo.me/0921985599` HTTPS (PITFALLS #7)
- Tap target ≥44×44px, FloatingZalo ≥56×56px
- `scroll-margin-top: 4.5rem` on anchor targets
- 3 CTA channels (tel/Zalo/mailto), no contact form
- Static export, no server actions
- All shell data sourced from `src/lib/site.ts`

**Gray areas identified:**
1. Nav visual & mobile menu (logo, mobile pattern, hotline placement, CTA style)
2. Footer layout & content (columns, quick links, copyright, socials)
3. FloatingZalo visual style (icon, bg color, label, animation)
4. Nav anchors & labels (slug language, order/labels, CTA target, active state)

User selected: **all 4 areas**.

---

## Area 1: Nav visual & mobile menu

### Q1.1: Logo style
- **Options presented:**
  - Text-only wordmark (Recommended) — "KHANG THỊNH INV" font-black uppercase burgundy
  - Wordmark + tagline below
  - Logo image (PNG/SVG from PDF)
- **User chose:** Text-only wordmark

### Q1.2: Mobile menu pattern (<768px)
- **Options presented:**
  - Slide-down accordion (Recommended) — hamburger drops menu under nav
  - Fullscreen overlay — needs scroll-lock
  - Off-canvas drawer (slide from right) — needs state + backdrop
- **User chose:** Slide-down accordion

### Q1.3: Hotline placement
- **Options presented:**
  - Desktop visible + Mobile in menu (Recommended)
  - Both mobile + desktop (mobile shows phone icon next to hamburger)
  - Desktop only (mobile relies on FloatingZalo)
- **User chose:** Desktop visible + Mobile in menu

### Q1.4: CTA "Báo giá" style
- **Options presented:**
  - Solid burgundy button (Recommended) — bg-burgundy text-bone
  - Outline burgundy button
  - Text link with underline animation
- **User chose:** Solid burgundy button

---

## Area 2: Footer layout & content

### Q2.1: Footer column structure
- **Options presented:**
  - 3 cols desktop / 1 col mobile (Recommended) — Company info | Quick links | Contact
  - 2 cols (Info | Contact)
  - Single column centered
- **User chose:** 3 cols desktop / 1 col mobile

### Q2.2: Quick links in footer
- **Options presented:**
  - Yes — same 5 anchors as nav + /du-an (Recommended)
  - No — footer just info + contact
- **User chose:** Yes — same 5 anchors as nav

### Q2.3: Copyright line
- **Options presented:**
  - © 2025 KHANG THỊNH INV. All rights reserved. (Recommended) — fixed year 2025
  - © {currentYear} dynamic
  - © 2025–present
- **User chose:** © 2025 KHANG THỊNH INV. All rights reserved. (fixed)

### Q2.4: Social/external links
- **Options presented:**
  - None (Recommended) — no Facebook/LinkedIn yet
  - Phone + Zalo + Email icon row (repeat CTAs)
- **User chose:** None

---

## Area 3: FloatingZalo visual style

### Q3.1: Icon
- **Options presented:**
  - Zalo official logo (SVG/PNG) — legal risk
  - Generic chat bubble (Lucide MessageCircle) (Recommended) — safe, consistent sizing
  - Custom "Z" stylized
- **User chose:** Generic chat bubble (Lucide MessageCircle)

### Q3.2: Background color
- **Options presented:**
  - Burgundy (brand) (Recommended) — bg-burgundy, icon bone
  - Zalo blue official (#0068FF)
  - White with burgundy border
- **User chose:** Burgundy

### Q3.3: Label
- **Options presented:**
  - Icon-only + aria-label (Recommended)
  - Pill: icon + "Chat Zalo" text
  - Icon + tooltip on hover
- **User chose:** Icon-only + aria-label

### Q3.4: Animation
- **Options presented:**
  - Static, hover/active only (Recommended)
  - Pulse ring continuous
  - Initial bounce after 3s
- **User chose:** Static, hover/active only

---

## Area 4: Nav anchors & labels

### Q4.1: Anchor slug language
- **Options presented:**
  - Vietnamese slug (Recommended): #dich-vu, #du-an, #nang-luc, #lien-he, +1
  - English slug: #services, #projects, #capabilities, #contact, #quote
  - Mixed (English anchors, VN labels)
- **User chose:** Vietnamese slug

### Q4.2: Anchor order + labels
- **Options presented:**
  - Dịch vụ → Dự án → Năng lực → Đối tác → Liên hệ (Recommended) — 5 anchors
  - Giới thiệu → Dịch vụ → Dự án → Năng lực → Liên hệ
  - 4 only (drops one to simplify)
- **User chose:** Dịch vụ → Dự án → Năng lực → Đối tác → Liên hệ

### Q4.3: CTA "Báo giá" target
- **Options presented:**
  - Link to #lien-he (Recommended)
  - Link to #bao-gia (Phase 3 dedicated CtaQuote)
  - Direct tel: link
- **User chose:** Link to #lien-he

### Q4.4: Active section highlight
- **Options presented:**
  - No — hover only (Recommended) — keep Nav server component
  - Yes — IntersectionObserver client component
- **User chose:** No — hover only (deferred to backlog)

---

## Closeout

- **All 4 selected areas covered**
- **No follow-up gray areas requested**
- **No scope creep attempts during session**
- **Deferred ideas captured:** Active section highlight, map embed, scroll-to-top, page transitions, logo image swap, Nav services dropdown

## Decisions count
- 22 locked decisions (D-01 through D-22)
- 5 items under Claude's discretion
- 4 open questions for planner to resolve from codebase
- 6 deferred ideas
