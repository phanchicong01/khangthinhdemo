# Phase 4: Projects Data + `/du-an` List — Discussion Log

**Session date:** 2026-05-28
**Mode:** discuss (interactive, no advisor)
**Audit scope:** Full Q&A trail for human review

---

## Pre-Discussion Analysis

**Domain:** Extract project data to `lib/projects.ts`, refactor landing `Projects.tsx` to import from it, rewrite legacy `/du-an/page.tsx` (currently blue palette + 6 entries with emoji icons) using Burgundy/Bone + 4 entries matching landing.

**Prior decisions carried forward:**
- Palette Burgundy + Bone, Be Vietnam Pro, tap targets ≥44px
- `trailingSlash: true` from Phase 1
- Static export (no server actions)
- Nav/Footer/FloatingZalo wrap every route via root layout
- Phase 3 Project[] shape: name/client/year/role/Icon/blockBg (must remap to PROJ-01 schema)
- Phase 3 year 2024/2025 was best-guess — needs confirmation
- 4 entries (3 QP + 1 grouped nhà phố) per Phase 3 D-16

**Gray areas identified (grouped into 4 sets to fit AskUserQuestion 4-option limit):**
1. Data shape + projects content
2. /du-an page layout + styling
3. Landing vs /du-an differences
4. Navigation + back link

User selected all 4 area groups.

---

## Area 1: Data shape + projects content

### Q1.1: Project count
- **Options:** 4 (keep Projects.tsx) (Recommended) / 6 (split nhà phố) / 4 landing == 4 /du-an
- **User chose:** 4 — giữ nguyên

### Q1.2: Years
- **Options:** Keep "2024"/"2025" (Recommended) / "2024–2025" range / Drop year field
- **User chose:** Keep "2024" for QP + "2025" for nhà phố

### Q1.3: `scope` field
- **Options:** scope = role verbatim (Recommended) / scope = physical scale / scope = both combined
- **User chose:** scope = role current values

### Q1.4: `summary` field
- **Options:** 1–2 sentence description (Recommended) / Skip / Achievements array
- **User chose:** 1–2 sentence description

---

## Area 2: /du-an page layout + styling

### Q2.1: Card style
- **Options:** Same as landing (color block 200px + icon) (Recommended) / Editorial list 1-col / Grid 2x2 with extra metadata
- **User chose:** Same as landing

### Q2.2: Page header
- **Options:** Simple header H1 + sub + back link (Recommended) / Espresso hero block / Compact H1 only
- **User chose:** Simple header H1 + sub + back link

### Q2.3: Filter/sort
- **Options:** No (Recommended) / Filter by type
- **User chose:** No filter

### Q2.4: Container width
- **Options:** max-w-6xl py-20 md:py-24 like landing (Recommended) / max-w-5xl narrower
- **User chose:** max-w-6xl like landing

---

## Area 3: Landing vs /du-an differences

### Q3.1: Differentiation
- **Options:** Landing compact / /du-an + summary (Recommended) / Same content both / /du-an + achievements
- **User chose:** Landing compact, /du-an adds summary

### Q3.2: Landing Projects refactor
- **Options:** Yes — import from lib/projects.ts (Recommended) / No — keep hardcoded
- **User chose:** Yes — refactor

### Q3.3: Icon + blockBg in lib
- **Options:** Yes — include in lib (Recommended) / No — keep in component / No — drop color block
- **User chose:** Yes — include in lib

---

## Area 4: Navigation + back link

### Q4.1: Back link target
- **Options:** `/#du-an` anchor (Recommended) / `/` top of homepage / `router.back()`
- **User chose:** `/#du-an`

### Q4.2: Back link style + position
- **Options:** Text link + ArrowLeft icon at header top (Recommended) / Outline button at footer / Both
- **User chose:** Text link at header top

### Q4.3: Breadcrumb
- **Options:** No (Recommended) / Yes — "Trang chủ / Dự án tiêu biểu"
- **User chose:** No

### Q4.4: /du-an metadata
- **Options:** Title "Dự án tiêu biểu | Khang Thịnh Investment" + descr (Recommended) / Custom
- **User chose:** Recommended title + description

---

## Closeout

- **All 4 selected areas covered**
- **No additional gray areas surfaced**
- **No scope creep attempts** (PROJ-DETAIL routes raised by user? No — user kept to scope)
- **Deferred captured:** /du-an/[slug] detail, image gallery, filter UI when >10, BreadcrumbList schema (Phase 5), OG image (Phase 5), more projects (content task), achievement metrics

## Decisions count
- 30 locked decisions (D-01..D-30)
- 6 Claude's discretion items
- 6 open questions for planner
- 9 deferred ideas
