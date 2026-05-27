// SEC-02 PartnersMarquee — infinite horizontal scroll of trust signals.
// Server component. Pure CSS animation (no JS, no client component).
// Per D-09 + PITFALLS #12 — prefers-reduced-motion handled in globals.css.
// Per D-06 — token list: BỘ QUỐC PHÒNG · BINH ĐOÀN 12 · TRƯỜNG SƠN · CÀ MAU
// Per D-08 — mask-image fades both edges (~8% width each side).

const PARTNER_TOKENS = [
  'BỘ QUỐC PHÒNG',
  'BINH ĐOÀN 12',
  'TRƯỜNG SƠN',
  'CÀ MAU',
] as const

const SEPARATOR = '·' // \u00B7 middle dot per D-06

// Repeat tokens 3× per copy → 12 items per copy → 24 items total in track
// so the visible viewport is comfortably shorter than half the track width.
const ONE_COPY = Array.from({ length: 3 }, () => PARTNER_TOKENS).flat()

export default function PartnersMarquee() {
  return (
    <section
      id="doi-tac"
      aria-label="Đối tác tiêu biểu"
      className="bg-espresso text-bone py-12 md:py-16 overflow-hidden"
      style={{
        // Fade edges per D-08 — ~8% width each side.
        maskImage:
          'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      {/* Two identical copies inside one inline-flex track → translating */}
      {/* the track by -50% creates a seamless loop. */}
      <div className="marquee-track font-black uppercase tracking-widest text-2xl md:text-4xl">
        {[0, 1].map((copyIndex) => (
          <span key={copyIndex} className="inline-flex items-center gap-8" aria-hidden={copyIndex === 1}>
            {ONE_COPY.map((token, i) => (
              <span key={`${copyIndex}-${i}`} className="inline-flex items-center gap-8">
                <span>{token}</span>
                <span className="text-burgundy" aria-hidden="true">{SEPARATOR}</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </section>
  )
}
