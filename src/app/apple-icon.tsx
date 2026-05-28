// SEO-05 — 180×180 apple-touch-icon emitted at build time.
//
// Per CONTEXT D-14..D-16 + RESEARCH Topic 4:
//   - Monogram "KT" on Burgundy #6B1F1F block, Bone #FAF8F2 text
//   - 180×180 (iOS home-screen size)
//   - DOES fetch Be Vietnam Pro 900 — at 110px font size, brand font readability matters
//     (vs icon.tsx 32×32 which uses system fallback)
//   - borderRadius 28 (~15% of 180)
//
// Phase 5 P1 learning (05-01 SUMMARY): apply `export const dynamic = 'force-static'`
// proactively on dynamic route files under output: 'export'.
//
// Next 15 auto-wires <link rel="apple-touch-icon"> in <head>.
//
// Note: loadFont helper duplicated from opengraph-image.tsx — each Next 15 route
// handler is bundled separately, so sharing via @/lib is unnecessary overhead.
import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const dynamic = 'force-static'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// NOTE: Satori (next/og) parses TTF/OTF only — it does NOT support woff2.
// Bare 'Mozilla/5.0' UA makes Google Fonts CSS2 serve a .ttf URL we can use directly.
async function loadFont(weight: 900): Promise<ArrayBuffer> {
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

export default async function AppleIcon(): Promise<ImageResponse> {
  const black = await loadFont(900)
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#6B1F1F',
          color: '#FAF8F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 110,
          fontWeight: 900,
          borderRadius: 28,
          letterSpacing: '-4px',
          fontFamily: 'Be Vietnam Pro',
        }}
      >
        KT
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Be Vietnam Pro', data: black, weight: 900, style: 'normal' },
      ],
    }
  )
}
