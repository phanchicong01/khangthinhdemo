// SEC-05 BigStats — 4 honest tiles. NO count-up animation per D-22 + FEATURES.md.
// Server component. No state, no client.
// No anchor id of its own — BigStats lives inside the #nang-luc section wrapper
// in page.tsx alongside Capabilities (see Plan 03-02 Task 3 composition note).

type Stat = {
  number: string
  label: string
}

const STATS: readonly Stat[] = [
  { number: '3,900', label: 'Tấn — Tải trọng đội tàu' },
  { number: '4',     label: 'Dự án tiêu biểu' },
  { number: '2025',  label: 'Năm thành lập' },
  { number: '3',     label: 'Đối tác Quốc phòng' },
] as const

export default function BigStats() {
  return (
    <section
      aria-label="Số liệu nổi bật"
      className="bg-bone-dark py-20 md:py-24"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-bone-dark border-l-4 border-burgundy pl-4 md:pl-6 py-4"
            >
              <div className="font-black text-5xl md:text-6xl text-burgundy leading-none">
                {s.number}
              </div>
              <div className="mt-3 text-xs md:text-sm uppercase tracking-widest text-espresso">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
