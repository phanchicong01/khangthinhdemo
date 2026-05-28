// SEO-05 — 32×32 favicon emitted at build time.
//
// Per CONTEXT D-14..D-17 + RESEARCH Topic 4:
//   - Monogram "KT" on Burgundy #6B1F1F block, Bone #FAF8F2 text
//   - 32×32 (browser scales for 16×16 too)
//   - No custom font — basic Latin glyphs render fine via Satori system fallback at this size
//   - borderRadius ~15% for soft-rounded square
//
// Phase 5 P1 learning (05-01 SUMMARY): apply `export const dynamic = 'force-static'`
// proactively on dynamic route files under output: 'export'.
//
// Next 15 auto-wires <link rel="icon"> in <head> — no manual layout.tsx change needed.
import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const dynamic = 'force-static'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon(): ImageResponse {
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
          fontSize: 18,
          fontWeight: 900,
          borderRadius: 5,
          letterSpacing: '-1px',
        }}
      >
        KT
      </div>
    ),
    { ...size }
  )
}
