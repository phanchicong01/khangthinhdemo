// SEC-07 CtaQuote — full-width espresso banner with a single tel: CTA.
// Server component. NO anchor id per D-29 (Nav "Báo giá" CTA targets #lien-he).
// Banner is a conversion strip between Capabilities and Contact.
import { Phone } from 'lucide-react'
import { telHref } from '@/lib/site'

export default function CtaQuote() {
  return (
    <section
      aria-label="Yêu cầu báo giá"
      className="bg-espresso text-bone py-20 md:py-24"
    >
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="font-black uppercase tracking-wide text-3xl md:text-5xl text-bone">
          YÊU CẦU BÁO GIÁ NGAY HÔM NAY
        </h2>
        <p className="mt-5 text-base md:text-lg text-bone-dark max-w-3xl mx-auto leading-relaxed">
          Tư vấn miễn phí · Phản hồi trong 24 giờ · Báo giá theo khối lượng + điểm giao
        </p>
        <div className="mt-8 flex justify-center">
          <a
            href={telHref()}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] bg-burgundy text-bone px-8 py-4 rounded-sm text-base md:text-lg font-bold uppercase tracking-wide hover:bg-burgundy-dark transition-colors"
          >
            <Phone className="w-5 h-5" aria-hidden="true" />
            <span>Gọi 092 198 55 99</span>
          </a>
        </div>
      </div>
    </section>
  )
}
