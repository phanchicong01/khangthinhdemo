// SEC-01 Hero — first-viewport trust messaging.
// Server component. Blueprint-grid CSS pattern background (no images per PITFALLS #5).
// CTAs MUST use telHref() — D-04 / D-36. Never hardcode phone or zalo URLs.
import { Phone } from 'lucide-react'
import { telHref } from '@/lib/site'

export default function Hero() {
  return (
    <section
      aria-label="Giới thiệu Khang Thịnh Investment"
      className="relative bg-bone py-20 md:py-24 overflow-hidden"
      style={{
        // Blueprint grid — D-03: linear-gradient lines 1px @ ~30% opacity espresso on bone, 40×40px tile.
        // CSS-only, no <img>; safe for LCP.
        backgroundImage:
          'linear-gradient(to right, rgba(26,20,16,0.30) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,20,16,0.30) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    >
      <div className="relative max-w-6xl mx-auto px-4 text-center md:text-left">
        <h1 className="font-black uppercase tracking-wide text-burgundy text-4xl md:text-6xl leading-tight">
          CÔNG TRÌNH BỀN VỮNG · ĐỐI TÁC TIN CẬY
        </h1>
        <p className="mt-6 text-base md:text-xl text-espresso max-w-3xl mx-auto md:mx-0 leading-relaxed">
          Cung ứng VLXD · Xây dựng · Vận chuyển đường thủy. Đối tác Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center md:items-start gap-3 justify-center md:justify-start">
          {/* CTA1 — solid burgundy, primary. D-04. */}
          <a
            href={telHref()}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] bg-burgundy text-bone px-6 py-3 rounded-sm text-sm md:text-base font-bold uppercase tracking-wide hover:bg-burgundy-dark transition-colors"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span>Gọi 092 198 55 99</span>
          </a>
          {/* CTA2 — outline burgundy, secondary. D-04. Target #lien-he. */}
          <a
            href="#lien-he"
            className="inline-flex items-center justify-center min-h-[44px] border-2 border-burgundy text-burgundy px-6 py-3 rounded-sm text-sm md:text-base font-bold uppercase tracking-wide hover:bg-burgundy hover:text-bone transition-colors"
          >
            Báo giá
          </a>
        </div>
      </div>
    </section>
  )
}
