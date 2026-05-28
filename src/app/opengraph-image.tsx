// SEO-03 — Open Graph 1200×630 image generated at build time.
//
// Per CONTEXT D-07..D-13b:
//   - Next 15 file convention: app/opengraph-image.tsx → ImageResponse from 'next/og'
//   - Static export safe: runtime 'nodejs', no Request-time APIs, emits PNG at build
//   - Burgundy #6B1F1F bg, Bone #FAF8F2 text — palette matches viewport.themeColor
//   - Brand name (font-weight 900) + service line (400) + italic tagline + footer URL
//   - Fonts fetched from Google Fonts CSS2 API with subset=vietnamese (Pitfall: Satori
//     won't render Vietnamese diacritics without the proper subset). Both 400 + 900
//     weights loaded — tagline 400 italic, brand name 900.
//
// Satori CSS subset gotchas (RESEARCH Topic 3 + Pitfall #14):
//   - ONLY display: 'flex' or 'none' — no 'block' / 'inline-block'
//   - Every multi-child element MUST set display: 'flex' explicitly
//   - NO 'gap' in flex — use marginTop/marginBottom
//   - NO className / NO Tailwind — inline style={{ }} only
//
// Phase 5 P1 learning (05-01 SUMMARY): Next 15.5.18 under output: 'export' may require
// `export const dynamic = 'force-static'` on dynamic route files. Applied proactively.
//
// Vietnamese diacritic gate (D-13b): MANDATORY visual probe of out/opengraph-image.png
// post-build. If diacritics broken in 'Hợp tác cùng phát triển', trigger fallback:
//   Option A: drop tagline, use ASCII-only mid row ('Supply · Building · Logistics' or similar)
//   Option B: commit static PNG to public/og-image.png + delete this .tsx + update layout.tsx metadata
//   Document choice in .planning/phases/05-seo-schema-polish/05-02-VERIFICATION.md
import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const dynamic = 'force-static'
export const alt = 'Khang Thịnh Investment — Cung ứng VLXD, Xây dựng, Vận chuyển'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// NOTE: Satori (next/og) parses TTF/OTF only — it does NOT support woff2.
// Google Fonts CSS2 returns .ttf when the User-Agent does NOT signal woff2 support
// (a bare 'Mozilla/5.0' is sufficient). A modern Chrome UA returns .woff2 which would
// fail Satori with "Unsupported OpenType signature wOF2".
async function loadFont(weight: 400 | 900): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@${weight}&subset=vietnamese`,
    { headers: { 'User-Agent': 'Mozilla/5.0' } }
  ).then((r) => r.text())
  const url = css.match(/url\((https:\/\/[^)]+\.ttf)\)/)?.[1]
  if (!url) {
    throw new Error(`Be Vietnam Pro ${weight} TTF URL not found in Google CSS response`)
  }
  return fetch(url).then((r) => r.arrayBuffer())
}

export default async function OGImage(): Promise<ImageResponse> {
  const [regular, black] = await Promise.all([loadFont(400), loadFont(900)])
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#6B1F1F',
          color: '#FAF8F2',
          display: 'flex',
          flexDirection: 'column',
          padding: '80px',
          justifyContent: 'space-between',
          fontFamily: 'Be Vietnam Pro',
        }}
      >
        {/* Top block — brand wordmark + rule */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              letterSpacing: '-2px',
            }}
          >
            KHANG THỊNH INV
          </div>
          <div
            style={{
              width: 60,
              height: 4,
              background: '#FAF8F2',
              opacity: 0.9,
              marginTop: 24,
            }}
          />
        </div>

        {/* Mid block — services + italic tagline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 48, fontWeight: 400, opacity: 0.95 }}>
            Cung ứng VLXD · Xây dựng · Vận chuyển
          </div>
          <div
            style={{
              fontSize: 36,
              fontStyle: 'italic',
              opacity: 0.8,
              marginTop: 16,
            }}
          >
            Hợp tác cùng phát triển
          </div>
        </div>

        {/* Bottom-right — URL */}
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            opacity: 0.6,
            alignSelf: 'flex-end',
          }}
        >
          khangthinhinv.vn
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Be Vietnam Pro', data: regular, weight: 400, style: 'normal' },
        { name: 'Be Vietnam Pro', data: black, weight: 900, style: 'normal' },
      ],
    }
  )
}
