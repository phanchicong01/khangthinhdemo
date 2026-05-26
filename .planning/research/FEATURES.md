# Feature Research

**Domain:** Vietnamese B2B + B2C corporate website (construction materials supply, civil construction, waterway logistics)
**Researched:** 2026-05-26
**Confidence:** MEDIUM-HIGH (Vietnamese construction website conventions verified across multiple agencies/templates; specific Khang Thịnh competitor comparison: MEDIUM)

## Domain Context (Why These Features Matter)

Khang Thịnh Investment is a **new (2025) company** in a **trust-driven industry** where:
- Average deal size is high (truckload of cát-đá ~ tens of millions VND; nhà phố ~ hundreds of millions to billions VND)
- Buyers verify credibility before contacting (Vietnamese B2B is cautious about scams/fly-by-night operators)
- Vietnamese mobile penetration is ~85%+ and **Zalo is used by 85% of Vietnamese** — surpassing WhatsApp/Messenger ([VietnamNet](https://vietnamnet.vn/en/zalo-used-by-85-of-vietnamese-surpassing-global-apps-2406688.html))
- Construction industry buyers skew older male (40-60+), with lower digital fluency; prefer phone/Zalo over forms ([Subiz](https://subiz.com.vn/blog/cach-su-dung-zalo-oa.html))
- 60%+ of Vietnamese searches contain location terms like "gần tôi" — Local SEO matters heavily ([AppLabX](https://blog.applabx.com/the-state-of-seo-in-vietnam-for-2025/))

The Core Value from PROJECT.md is **"trust enough to call/Zalo"** — every feature decision below maps back to this single conversion goal.

## Feature Landscape

### Table Stakes (Vietnamese Buyers Expect These)

Missing any of these = website "feels fake / không uy tín" and bounce rate spikes.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Hotline phone number visible in sticky nav** | Standard Vietnamese B2B convention — phone in top-right of header is universal pattern. Older buyers scan for it within 2-3 seconds. | LOW | `tel:0921985599`, large bold, with phone icon. Already in spec. |
| **Floating Zalo button (bottom-right, always visible)** | 85% of Vietnamese use Zalo; expected on every Vietnamese commercial website in 2026 | LOW | Already specified in design. Should be ~56px touch target, never overlap content. |
| **Company legal info in footer** (Tên đầy đủ, MST, ĐDPL, Địa chỉ, SĐT, Email) | Vietnamese B2B buyers verify MST on dangkykinhdoanh.gov.vn before transacting; visible MST signals legitimacy ([Thư Viện Pháp Luật](https://thuvienphapluat.vn/hoi-dap-phap-luat/huong-dan-02-cach-tra-cuu-giay-phep-kinh-doanh-bang-ma-so-thue-doanh-nghiep-online-moi-nhat-nam-202-138026533.html)) | LOW | Show: "MST: 1102 107 064 — ĐDPL: Tô Thị Bích Ngọc — Địa chỉ: A3-02 KDC Long Phú, Bến Lức, Tây Ninh" |
| **Project portfolio with named clients** | "Case studies are the heavy artillery of B2B trust signals" ([Trajectory](https://www.trajectorywebdesign.com/blog/b2b-website-trust-signals)). For Khang Thịnh: Bộ Quốc phòng / Binh đoàn 12 / Trường Sơn = strongest possible credential in VN — must headline this. | LOW | Already in spec: 4 dự án + named client. |
| **Capabilities / Năng lực section** (đội tàu, cơ giới, đội xây lắp) | Construction buyers need concrete numbers: tonnage capacity, fleet size, year founded. Differentiates from "công ty ma" (shell companies). | LOW | BigStats + Capabilities sections handle this. |
| **Big numbers / Stats** (Tấn vận chuyển, số dự án, năm hoạt động) | Vietnamese construction sites uniformly use "con số biết nói" pattern — visible quantitative signals of capability | LOW | Already in spec as BigStats. Be honest — company founded 2025, so use lifetime project tonnage instead of "years experience". |
| **Mobile-first responsive (375px → 1440px)** | Vietnam smartphone penetration 80%+; Vietnamese mobile-first browsing is dominant ([Statista](https://www.statista.com/topics/9168/smartphone-market-in-vietnam/)). | LOW | Already in spec. |
| **Tap-to-call buttons on all CTA** | Vietnamese B2B prefers direct phone over form ([UX Movement](https://uxmovement.com/mobile/5-techniques-to-make-mobile-call-to-action-buttons-intuitive/)). `tel:` link must open dialer directly, not show modal. | LOW | Already in spec. |
| **OpenGraph + favicon + sitemap.xml + robots.txt** | Standard SEO hygiene. Zalo/Facebook link previews use OG tags — broken OG = looks unprofessional when shared. | LOW | Already in spec. |
| **Vietnamese-only content with diacritics** | Vietnamese readers need diacritics for credibility. SEO: optimize for both diacritic and non-diacritic queries ([Ranktracker](https://www.ranktracker.com/blog/a-complete-guide-for-doing-seo-in-vietnam/)). | LOW | Be Vietnam Pro font already in spec. |
| **Body font ≥ 16px on mobile, ≥ 18px ideal for older audience** | Audience skews 40-60+; WCAG + Health Literacy Online recommends ≥19px for older adults ([A11Y Collective](https://www.a11y-collective.com/blog/wcag-minimum-font-size/)) | LOW | Already targeted by Lighthouse A11y ≥90. Verify in build. |
| **HTTPS (SSL)** | Lock icon = baseline trust; absence breaks all credibility | LOW | Free via Vercel/Netlify/GitHub Pages. |
| **Page load < 3s on 3G** | Vietnamese mobile networks vary; slow loading directly impacts bounce | LOW | Static export + image optimization already addressed. |
| **3-channel contact** (Phone / Zalo / Email) | Phone for old-school B2B, Zalo for everyone else, Email for formal RFQs from corporates | LOW | Already in spec. |

### Differentiators (Competitive Advantage for Khang Thịnh)

Features that give edge over generic VN construction sites (most of which are template-based on PHP CMS).

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Partners marquee highlighting "BỘ QUỐC PHÒNG · BINH ĐOÀN 12 · TRƯỜNG SƠN"** | This is Khang Thịnh's **single strongest trust signal**. In VN construction, "đã làm cho Bộ Quốc phòng" carries enormous weight — competitors can't fake this. Text-only avoids logo copyright risk. | LOW | Already in spec. Keep front and center, not buried. |
| **Speed/Performance (Lighthouse ≥90)** | Most VN construction sites are slow (legacy WordPress/CMS, 5-15s loads). Fast site = immediate quality signal vs competitors. | MEDIUM | Static export + Next.js 15 + Tailwind already deliver this. |
| **Modern industrial design (Burgundy/Bone palette)** | Most VN construction templates use generic blue/yellow or red/black. Burgundy/Bone reads as "premium / có gu" — separates from template farm sites. | LOW | Already approved in design spec. |
| **CTA-driven layout (8 sections converge on call/Zalo)** | Most VN sites bury contact behind menus. Single-page with multiple CTA touchpoints = higher conversion. | LOW | Already in spec. |
| **Honest positioning as new company** (founded 2025) with strong references | Don't fake "20+ năm kinh nghiệm" — Vietnamese buyers detect this. Instead lean into: "đối tác Bộ Quốc phòng, đội ngũ có kinh nghiệm dự án quốc gia" | LOW | Copy decision. Affects Hero + About copy. |
| **Anchor-based single-page navigation** | Faster perceived UX vs multi-page; works well for company-introduction sites. Most VN competitors use 5-8 page sprawl. | LOW | Already in spec. |
| **`/du-an` list page with named clients + scope** | Many VN competitors just show photo grids without context. Named clients + Cà Mau locations + scope = higher trust per listing. | LOW | Already in spec. |
| **Google Business Profile + Maps location (deferred but plan for it)** | "60% of Vietnamese searches include 'gần tôi'" — local SEO via verified GBP listing drives discovery in Tây Ninh/Long An region ([VLink](https://www.vlink.asia/seo-google-maps/)). | LOW (GBP listing only); MEDIUM (Maps embed on site) | Phase 2: register GBP. Maps embed currently deferred per spec; reconsider in phase 2. |

### Anti-Features (Commonly Built, But Wrong for Khang Thịnh)

Features that template farms always include but actively hurt Khang Thịnh's positioning.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Contact form (with name/email/phone/message fields)** | "Industry standard" / template default | B2B VLXD buyers don't fill forms — they call. Form creates extra step, increases drop-off. Also: spam magnet without server-side validation (impossible on static export anyway). | 3 direct CTAs: tel/Zalo/mailto (already in spec) |
| **Live chat widget (non-Zalo, e.g., Tawk/Crisp)** | Common Western pattern | Vietnamese users distrust non-Zalo chat widgets ("ai trả lời? có phải bot không?"). Zalo is the trusted channel. | FloatingZalo only (already in spec) |
| **Bảng giá VLXD chi tiết / Price list page** | "Transparency" | Cát-đá-san lấp prices vary by km transport, volume, delivery point, season. Public fixed prices = either over-promise or lose negotiating room. Buyers expect "liên hệ báo giá". | "Yêu cầu báo giá" CTA banner (already in spec) |
| **Live order/cart/e-commerce for materials** | "Modern e-commerce" | B2B construction materials transactions involve negotiation, credit terms, delivery scheduling, sample inspection — not impulse-buy. Cart UX is hostile to this. | Quote request via call/Zalo |
| **Blog/News with weekly posts** | "Content marketing best practice" | Most VN construction blogs are abandoned after 3 posts. Better to have 0 blog posts than a dead blog showing "Last post: March 2024". | Skip until there's actual content cadence commitment |
| **Customer testimonials with photos** | "Social proof" | For B2B VLXD, fake-sounding testimonials hurt more than help. Named project clients (Bộ Quốc phòng, Binh đoàn 12) are infinitely stronger than generic "Anh Tuấn — Khách hàng hài lòng". | Project portfolio with real client names (already in spec) |
| **Logo image of partners (Bộ Quốc phòng, Binh đoàn 12, Trường Sơn)** | "Trust badges" | Copyright/usage rights risk — military/government logos require explicit permission ([Krazy Egg trust signals study](https://www.crazyegg.com/blog/trust-signals/) notes badge-conversion lift, but legal risk overrides) | Text-only marquee (already in spec) |
| **"Counter animations" on stats that animate on every scroll** | "Engaging interaction" | Performance cost, distracts; Vietnamese older audience finds movement annoying. | Static numbers with subtle CSS reveal once, or no animation |
| **Hero video background (drone footage of construction)** | "Premium feel" | Heavy bandwidth, slow on 3G/4G, often broken on iOS Safari with autoplay restrictions. Khang Thịnh doesn't have drone footage anyway. | CSS pattern / static photo (already in spec) |
| **English version / i18n switcher** | "International reach" | 100% domestic customer base. Adds bundle weight, complexity. | Vietnamese only (already in spec) |
| **CMS / admin panel for content edits** | "Non-technical user friendly" | Content changes are infrequent (quarterly). Adds attack surface, hosting cost, complexity. | Edit code directly (already in spec) |
| **Newsletter signup form** | "Lead nurturing" | B2B VLXD/xây dựng audience doesn't do email newsletters. Adds form to maintain with no payoff. | Direct contact via Zalo broadcast (if Zalo OA used) |
| **Carousel / slider on Hero** | "Show multiple messages" | Universally lower conversion than static hero; users don't wait for slides. Accessibility issues. | Single strong hero with clear CTA (already in spec) |
| **Hamburger menu on desktop** | "Trendy minimalism" | Hides navigation; older users don't recognize the icon. | Visible nav links on desktop (already in spec) |
| **Cookie consent banner (Western GDPR-style)** | "Compliance" | Vietnam doesn't require EU-style cookie consent. Annoying banner with no legal need. Only needed if doing remarketing/analytics with PII. | Skip unless adding analytics/remarketing later |
| **AI chatbot (non-Zalo)** | "Modern tech" | Vietnamese users distrust generic chatbots; Zalo bot is the trusted path. Static export can't host it anyway. | If automation needed later: Zalo OA chatbot |
| **Trending: 3D / WebGL hero scenes** | "Wow factor" | Slow, heavy, breaks on older devices common in older buyer demographic. | Skip |

## Feature Dependencies

```
Hotline-in-Nav ──visible always──> Tap-to-call CTA (Hero, Contact)
                                         │
FloatingZalo ──always visible──> Zalo CTA in Hero + Contact
                                         │
Project portfolio (lib/projects.ts) ──feeds──> Projects section (landing)
                                          │
                                          └──> /du-an list page
                                                     │
                                                     └──future──> /du-an/[slug] detail (DEFERRED)

PartnersMarquee (text) ──depends on──> NO logo images (legal decision)

BigStats numbers ──must be honest about──> Company founded 2025 (no "20 years")

SEO foundation (sitemap, OG, robots) ──requires──> Domain decision
                                                       │
                                                       └──blocker──> Currently uses placeholder khangthinhinv.vn

Local SEO (Google Business Profile) ──enhances──> Contact section + Footer (deferred to phase 2)

Maps embed ──depends on──> Google Maps API decision (DEFERRED in phase 1)

Mobile-first responsive ──prerequisite for──> All CTA features (since 80%+ traffic is mobile)
```

### Dependency Notes

- **Project portfolio → /du-an list:** Both pull from same `lib/projects.ts`. Single source of truth.
- **PartnersMarquee text-only → no logos:** Hard legal constraint; not a design preference.
- **BigStats numbers → honest baseline:** Avoid "kinh nghiệm 20 năm" — use tangible metrics (tons hauled, named projects, fleet size).
- **All CTAs → mobile-first:** Touch targets minimum 44×44px ([NN/g](https://www.a11y-collective.com/blog/wcag-minimum-font-size/)); ideally 48-56px for older audience.
- **SEO → domain decision pending:** Sitemap + OG image baseUrl needs real domain before launch. Currently `khangthinhinv.vn` is a placeholder.

## MVP Definition

### Launch With (v1 — current spec scope)

The current design spec already maps cleanly to MVP. All P1 items below correspond to what's in `2026-05-26-khangthinh-theme-migration-design.md`.

- [x] **Single-page landing with 8 sections** (Hero/Partners/Services/Projects/Stats/Capabilities/CtaQuote/Contact) — already specified
- [x] **`/du-an` list page** — already specified
- [x] **Sticky Nav with hotline + "Báo giá" CTA** — already specified
- [x] **FloatingZalo button (fixed bottom-right, all pages)** — already specified
- [x] **3 contact CTAs** (tel: / zalo.me/ / mailto:) — already specified
- [x] **Company legal info in Footer** (MST, ĐDPL, địa chỉ, SĐT, email) — already specified
- [x] **SEO foundation** (metadata, OG, sitemap.xml, robots.txt, favicon) — already specified
- [x] **Responsive 375 → 1440px** — already specified
- [x] **Burgundy/Bone palette + Be Vietnam Pro font** — already specified
- [x] **Static export, ≥90 Lighthouse Perf/A11y, ≥95 SEO** — already specified

### Add After Validation (v1.x — within 1-2 months post-launch)

Trigger: First phone/Zalo inquiries arrive; we know what visitors actually ask about.

- [ ] **Google Business Profile (GBP) verified listing** — biggest local SEO lever for Tây Ninh/Bến Lức discovery. No site code change; just register GBP. ([Cyno](https://cyno.com.vn/local-seo-google-business-profile/))
- [ ] **Google Maps embed in Contact section** — Adds visual location confirmation. Defer until domain + GBP done; consider lazy-loaded iframe to preserve perf.
- [ ] **Real project photos** (replace CSS pattern placeholders) — Once user provides image assets. Use `next/image` (static export compatible with `unoptimized: true`).
- [ ] **Zalo OA registration + pixel** — If we want to remarket to Zalo users who visit site ([Prodima](https://prodima.vn/en/what-is-zalo/)). Phase 2 if marketing budget allocated.
- [ ] **Trang `/ve-chung-toi` (About)** — Only if hero + footer info proves insufficient based on visitor questions.
- [ ] **Schema.org structured data** (LocalBusiness, Organization) — Helps Google rich results. Easy add with JSON-LD. ([SEONGON](https://seongon.com/blog/seo/cau-truc-website-nganh-vat-lieu-xay-dung.html))
- [ ] **404 page (custom)** — Polish; current default acceptable.

### Future Consideration (v2+ — needs validation first)

Defer until product-market fit signals justify the work.

- [ ] **`/du-an/[slug]` detail pages** — Wait until 8-12 projects accumulated and user supplies real content (photos, scope details, role of company). Per PROJECT.md, deferred.
- [ ] **News/Blog (`/tin-tuc`)** — Only if a content calendar is committed to (≥1 post/month). Otherwise stale blog is worse than no blog.
- [ ] **Project filtering by category** (VLXD / Xây dựng / Vận chuyển) — Useful once portfolio > 10 entries.
- [ ] **English version (`/en`)** — Only if foreign clients (e.g., LEGO, Samsung industrial parks) start inquiring.
- [ ] **CMS integration** (Sanity, Strapi headless) — Only if content updates become weekly+.
- [ ] **Live "Yêu cầu báo giá" RFQ form with serverless function** — If Zalo channel proves insufficient for capturing corporate RFQs. Requires moving off pure static export or adding Formspree/Web3Forms.
- [ ] **Multi-page sitemap expansion** (`/dich-vu/vlxd`, `/dich-vu/xay-dung`, `/dich-vu/van-chuyen`) — Per-service landing pages for SEO long-tail. Only if Search Console shows demand.
- [ ] **Analytics** (GA4 or Plausible) — Add when there's bandwidth to act on data. Defer until past launch chaos.
- [ ] **Customer reviews integration (Google Reviews embed)** — Once GBP accumulates reviews. Strong trust signal.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Hotline in Nav (sticky) | HIGH | LOW | **P1** |
| FloatingZalo button | HIGH | LOW | **P1** |
| Hero with 2 CTA (Gọi/Báo giá) | HIGH | LOW | **P1** |
| Partners marquee (text) | HIGH | LOW | **P1** |
| Project portfolio (4 dự án + named clients) | HIGH | LOW | **P1** |
| 3 contact CTAs (Gọi/Zalo/Email) | HIGH | LOW | **P1** |
| Footer with MST + legal info | HIGH | LOW | **P1** |
| SEO foundation (metadata/OG/sitemap/robots) | MEDIUM | LOW | **P1** |
| Mobile responsive | HIGH | LOW | **P1** (table stakes) |
| Lighthouse perf ≥90 | MEDIUM | LOW | **P1** |
| BigStats with honest numbers | MEDIUM | LOW | **P1** |
| Capabilities section | MEDIUM | LOW | **P1** |
| CtaQuote banner | HIGH | LOW | **P1** |
| `/du-an` list page | MEDIUM | LOW | **P1** |
| Google Business Profile | HIGH | LOW (off-site) | **P2** |
| Maps embed in Contact | MEDIUM | LOW | **P2** |
| Schema.org JSON-LD | MEDIUM | LOW | **P2** |
| Real project photos | MEDIUM | LOW (when assets ready) | **P2** |
| `/du-an/[slug]` detail | LOW (until content ready) | MEDIUM | **P3** |
| Blog / Tin tức | LOW | MEDIUM (ongoing) | **P3** |
| Contact form | NEGATIVE (anti-feature) | MEDIUM | **DO NOT BUILD** |
| Pricing page | NEGATIVE | LOW | **DO NOT BUILD** |
| Live chat (non-Zalo) | NEGATIVE | MEDIUM | **DO NOT BUILD** |
| English / i18n | LOW | HIGH | **P3 or never** |
| CMS / admin | LOW | HIGH | **P3 or never** |

**Priority key:**
- **P1:** Must have for launch (already in approved design spec — confirmed correct)
- **P2:** Should add within 1-2 months post-launch (easy wins, await validation signal)
- **P3:** Defer until clear product-market-fit signal demands it
- **DO NOT BUILD:** Anti-features — actively harmful for this audience/positioning

## Competitor Feature Analysis

Comparing what other Vietnam construction sites do vs Khang Thịnh's planned approach.

| Feature | Coteccons (tier-1 GC) | Vinaconex (tier-1 GC) | Typical VN VLXD SME templates | Khang Thịnh Approach |
|---------|----------------------|----------------------|-------------------------------|----------------------|
| Hero | Static, project image, tagline | Slider/carousel | Slider with 5+ slides, often stretched | Static hero, CSS pattern + clear 2-CTA |
| Contact channel | Form + phone + email | Form + phone + email + branch addresses | Form (often broken) + hotline | Phone + Zalo + email (NO form) |
| Project showcase | Filterable grid, detail pages, photos | Categorized lists, financial reports | Photo gallery without context | Named clients + scope + location |
| Trust signals | Stock listing, decades of history, ISO certs | State-owned heritage, govt projects | Generic certifications page | Bộ Quốc phòng / Binh đoàn 12 / Trường Sơn marquee |
| Sticky hotline | Yes | Yes | Sometimes | Yes |
| FloatingZalo | Yes | Yes | Yes (sometimes paid widget) | Yes (custom, lightweight) |
| Language | VN + EN | VN + EN | VN only | VN only (correct choice) |
| Tech | WordPress / custom CMS | Drupal / legacy CMS | WordPress template | Next.js 15 static export |
| Load time (typical) | 3-6s | 5-10s | 5-15s | <2s target |
| Blog/News | Active (corp comms team) | Active (corp comms team) | Abandoned blog | None (correct choice for SME) |
| Pricing | None (RFQ-based) | None (RFQ-based) | Sometimes (often outdated) | None — CtaQuote (correct) |

**Key insight:** Khang Thịnh's spec smartly avoids the bloat patterns of both tier-1 GCs (over-built, slow) and template SMEs (fake testimonials, broken forms). The lean, fast, conversion-focused approach is a competitive advantage in this segment.

## Vietnam-Specific Conversion Psychology Notes

For roadmap reference — why specific features convert in this market:

1. **Phone-first is cultural.** Older male decision-makers (40-60+ in construction) are not "form fillers". They scan for hotline within seconds and call. This is why the design spec correctly omits contact forms.

2. **Zalo > Messenger > WhatsApp.** 85% Vietnam Zalo penetration means a Zalo button has near-100% recognition. Users tap Zalo expecting <2hr response in business hours.

3. **MST = legitimacy proof.** Visible MST in footer signals "we are a real company you can verify on dangkykinhdoanh.gov.vn." Absence = "công ty ma" suspicion.

4. **Named clients > testimonials.** Generic "Anh Tuấn rất hài lòng" reads as fake. "Cao tốc Cái Nước — Đất Mũi (Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn)" is unfalsifiable and weighty.

5. **Speed = quality signal.** Most VN construction sites load 5-15s. A <2s load establishes "đầu tư nghiêm túc" instantly.

6. **Diacritics required, but optimize for non-diacritic search.** Body content in proper Vietnamese with dấu; SEO must cover both "cat da" and "cát đá" variants.

7. **Local SEO matters.** "Cát đá Bến Lức", "VLXD Tây Ninh", "vận chuyển đường thủy Cà Mau" are realistic queries. GBP registration is highest-ROI local marketing action.

8. **CTA copy specificity.** "Yêu cầu báo giá" / "Gọi tư vấn miễn phí" / "Chat Zalo ngay" outperforms generic "Liên hệ" or "Tìm hiểu thêm" in VN B2B.

## Sources

### Vietnamese Market & Vietnamese B2B Conventions
- [Zalo used by 85% of Vietnamese — VietnamNet](https://vietnamnet.vn/en/zalo-used-by-85-of-vietnamese-surpassing-global-apps-2406688.html) — HIGH confidence (statistical reporting)
- [Cách sử dụng Zalo OA — Subiz](https://subiz.com.vn/blog/cach-su-dung-zalo-oa.html) — MEDIUM confidence (vendor blog)
- [What is Zalo (2026 update) — Prodima](https://prodima.vn/en/what-is-zalo/) — MEDIUM confidence
- [Key solutions for businesses on Zalo in 2026](https://www.vietnam.vn/en/cac-giai-phap-trong-tam-cho-doanh-nghiep-tren-zalo-trong-2026) — MEDIUM confidence
- [Smartphone market in Vietnam — Statista](https://www.statista.com/topics/9168/smartphone-market-in-vietnam/) — HIGH confidence

### Vietnamese Construction Website Patterns
- [Thiết kế website xây dựng — VDesign](https://websitetheoyeucau.com/thiet-ke-website-cong-ty-xay-dung-theo-yeu-cau) — MEDIUM (vendor)
- [Thiết kế website VLXD chuẩn SEO — HomeNest](https://homenest.com.vn/thiet-ke-website-vat-lieu-xay-dung-uy-tin-chuyen-nghiep-chuan-seo/) — MEDIUM
- [Top 16 Mẫu Website Xây Dựng 2026 — K-Tech](https://k-tech.net.vn/mau-thiet-ke-website-xay-dung/) — MEDIUM
- [Cấu trúc website VLXD — SEONGON](https://seongon.com/blog/seo/cau-truc-website-nganh-vat-lieu-xay-dung.html) — MEDIUM

### Local SEO Vietnam
- [Dịch vụ SEO Google Maps — VLink Asia (covers Tây Ninh)](https://www.vlink.asia/seo-google-maps/) — MEDIUM
- [Local SEO Vietnam — Cyno](https://cyno.com.vn/local-seo-google-business-profile/) — MEDIUM
- [SEO in Vietnam 2025 — AppLabX](https://blog.applabx.com/the-state-of-seo-in-vietnam-for-2025/) — MEDIUM-HIGH
- [SEO Vietnam guide — Ranktracker](https://www.ranktracker.com/blog/a-complete-guide-for-doing-seo-in-vietnam/) — MEDIUM-HIGH

### Trust Signals & B2B Conversion
- [B2B Website Trust Signals — Trajectory](https://www.trajectorywebdesign.com/blog/b2b-website-trust-signals) — MEDIUM
- [Construction Website Design Essentials — ProjectMark](https://www.projectmark.com/blog/construction-website-design) — MEDIUM
- [5 Trust Signals That Boost Conversion — Crazy Egg](https://www.crazyegg.com/blog/trust-signals/) — MEDIUM
- [Construction Portfolio Website Designs — Huemor](https://huemor.rocks/blog/the-best-construction-portfolio-website-designs-what-works-and-why/) — MEDIUM

### Mobile UX & Accessibility
- [Mobile UX Best Practices 2026 — Brand Vision](https://www.brandvm.com/post/mobile-ux-best-practices) — MEDIUM
- [Mobile CTA buttons — UX Movement](https://uxmovement.com/mobile/5-techniques-to-make-mobile-call-to-action-buttons-intuitive/) — HIGH (established UX source)
- [WCAG font size guide — A11Y Collective](https://www.a11y-collective.com/blog/wcag-minimum-font-size/) — HIGH (W3C-aligned)
- [W3C WCAG 2.1](https://www.w3.org/TR/WCAG21/) — HIGH (authoritative)

### Vietnamese Competitors
- [Coteccons](https://www.coteccons.vn/en/) — HIGH (direct)
- [Vinaconex](https://vinaconex.com.vn/en/gioi-thieu) — HIGH (direct)
- [Top VN Construction Companies — Mordor Intelligence](https://www.mordorintelligence.com/industry-reports/vietnam-construction-market/companies) — MEDIUM

### Legal / MST Verification
- [Tra cứu giấy phép kinh doanh — Thư Viện Pháp Luật](https://thuvienphapluat.vn/hoi-dap-phap-luat/huong-dan-02-cach-tra-cuu-giay-phep-kinh-doanh-bang-ma-so-thue-doanh-nghiep-online-moi-nhat-nam-202-138026533.html) — HIGH

---
*Feature research for: Vietnamese B2B construction/materials/logistics corporate website*
*Researched: 2026-05-26*
*Note: Khang Thịnh's already-approved design spec (`docs/superpowers/specs/2026-05-26-khangthinh-theme-migration-design.md`) closely matches the table-stakes + differentiator profile this research recommends. The spec is well-aligned with market conventions; this research validates rather than challenges it, and primarily contributes: (1) explicit anti-feature rationale, (2) post-launch P2/P3 roadmap, (3) Vietnamese-specific conversion psychology notes.*
