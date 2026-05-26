// ⚠️ Phase 1 sentinel — placeholder until real Hero arrives in Phase 3.
// Purpose:
//   1. Prove lib/site.ts → siteUrl wiring works (FND-05).
//   2. Prove Burgundy/Bone palette utilities render (FND-03).
//   3. Prove Be Vietnam Pro Vietnamese diacritics render correctly across weights (FND-04).
// DELETE this entire file body in Phase 3 (replaced by composed sections).
import { company, siteUrl, telHref, zaloHref, mailtoHref } from '@/lib/site'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bone text-espresso p-8">
      <section className="max-w-3xl mx-auto space-y-6">
        <header className="border-b-4 border-burgundy pb-4">
          <p className="font-sans text-sm uppercase tracking-widest text-taupe">
            Phase 1 — Foundation Lock-In · Sentinel
          </p>
          <h1 className="font-sans font-black uppercase tracking-wide text-4xl md:text-5xl text-burgundy mt-2">
            {company.shortName} — Đội tàu 3,900 tấn
          </h1>
          <p className="font-sans italic text-burgundy-dark mt-2">
            &quot;{company.tagline}&quot;
          </p>
        </header>

        {/* Vietnamese diacritic stress test — all weights 400→900 */}
        <div className="bg-bone-dark p-4 space-y-1 border border-taupe">
          <p className="font-sans font-normal">400 — Cao tốc Cái Nước · Đất Mũi Cà Mau · Hợp tác cùng phát triển</p>
          <p className="font-sans font-medium">500 — Cầu Cửa Lớn · Đường ra đảo Hòn Khoai</p>
          <p className="font-sans font-semibold">600 — Cung ứng cát, đá, san lấp · Xây dựng dân dụng</p>
          <p className="font-sans font-bold">700 — Vận chuyển đường thủy · Trường Sơn · Binh đoàn 12</p>
          <p className="font-sans font-extrabold uppercase">800 — KHANG THỊNH ĐẦU TƯ — TÂY NINH</p>
          <p className="font-sans font-black uppercase tracking-wide">900 — KHANG THỊNH ĐỘI TÀU 3,900 TẤN — BỘ QUỐC PHÒNG</p>
        </div>

        {/* Palette swatch — proves all 8 @theme tokens generate utilities */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-burgundy text-bone p-3 text-xs">burgundy</div>
          <div className="bg-burgundy-dark text-bone p-3 text-xs">burgundy-dark</div>
          <div className="bg-terracotta text-bone p-3 text-xs">terracotta</div>
          <div className="bg-coffee text-bone p-3 text-xs">coffee</div>
          <div className="bg-bone text-espresso p-3 text-xs border border-taupe">bone</div>
          <div className="bg-bone-dark text-espresso p-3 text-xs border border-taupe">bone-dark</div>
          <div className="bg-espresso text-bone p-3 text-xs">espresso</div>
          <div className="bg-taupe text-bone p-3 text-xs">taupe</div>
        </div>

        {/* Env-var sanity — proves NEXT_PUBLIC_SITE_URL propagates (FND-05) */}
        <div className="bg-espresso text-bone p-4 font-mono text-sm space-y-1">
          <p>siteUrl = {siteUrl}</p>
          <p>tel = {telHref()}</p>
          <p>zalo = {zaloHref()}</p>
          <p>mail = {mailtoHref()}</p>
          <p>mst = {company.taxIdDisplay}</p>
          <p>address = {company.address.full}</p>
        </div>

        <p className="font-sans text-sm text-taupe italic">
          Phase 1 only — real Hero, Services, Projects, Contact sections arrive in Phase 3.
        </p>
      </section>
    </main>
  )
}
