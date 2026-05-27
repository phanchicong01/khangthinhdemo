// SEC-08 Contact — company info (left) + 3 channel CTAs (right).
// Server component. Anchor id="lien-he" (Nav "Báo giá" + Hero CTA2 target).
// All CTA hrefs flow through @/lib/site helpers — never hardcoded.
// Plain-text email is rendered next to the mailto button per PITFALLS #7.
import { Phone, MessageCircle, Mail } from 'lucide-react'
import { company, telHref, zaloHref, mailtoHref } from '@/lib/site'

export default function Contact() {
  return (
    <section
      id="lien-he"
      aria-label="Liên hệ Khang Thịnh"
      className="bg-bone-dark py-20 md:py-24"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Left column — info + legal block */}
          <div>
            <h2 className="font-black uppercase tracking-wide text-3xl md:text-4xl text-burgundy">
              Liên hệ
            </h2>
            <p className="mt-2 italic text-burgundy-dark">
              &quot;{company.tagline}&quot;
            </p>
            <dl className="mt-8 space-y-3 text-espresso">
              <div>
                <dt className="sr-only">Tên công ty</dt>
                <dd className="font-bold">{company.legalName}</dd>
              </div>
              <div>
                <dt className="sr-only">Mã số thuế</dt>
                <dd>MST: {company.taxIdDisplay}</dd>
              </div>
              <div>
                <dt className="sr-only">Đại diện pháp luật</dt>
                <dd>ĐDPL: {company.legalRep}</dd>
              </div>
              <div>
                <dt className="sr-only">Địa chỉ</dt>
                <dd>Địa chỉ: {company.address.full}</dd>
              </div>
            </dl>
          </div>

          {/* Right column — 3 stacked CTAs */}
          <div className="flex flex-col gap-4">
            <a
              href={telHref()}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] w-full bg-burgundy text-bone px-6 py-4 rounded-sm text-base font-bold uppercase tracking-wide hover:bg-burgundy-dark transition-colors"
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
              <span>Gọi 092 198 55 99</span>
            </a>
            <a
              href={zaloHref()}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] w-full bg-burgundy text-bone px-6 py-4 rounded-sm text-base font-bold uppercase tracking-wide hover:bg-burgundy-dark transition-colors"
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              <span>Chat Zalo</span>
            </a>
            <a
              href={mailtoHref()}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] w-full border-2 border-burgundy text-burgundy px-6 py-4 rounded-sm text-base font-bold uppercase tracking-wide hover:bg-burgundy hover:text-bone transition-colors"
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
              <span>Gửi email</span>
            </a>
            {/* Plain-text email fallback per PITFALLS #7 — visible even if */}
            {/* the mailto handler is missing on the user's device.        */}
            <p className="text-center text-sm text-espresso">
              Hoặc gửi trực tiếp đến: <span className="font-semibold">{company.email}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
