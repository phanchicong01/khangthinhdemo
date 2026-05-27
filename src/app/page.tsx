// Phase 2 — anchor placeholder sections wired to Nav anchors (D-05/D-06).
// Each section will be replaced by the real Phase 3 component:
//   #dich-vu  → Services        (SEC-03)
//   #du-an    → Projects        (SEC-04)
//   #nang-luc → Capabilities    (SEC-06)
//   #doi-tac  → PartnersMarquee (SEC-02)
//   #lien-he  → Contact         (SEC-08)
// Phase 1 sentinel content is preserved inside #nang-luc as a debug card —
// safe to delete in Phase 3.
import { company, siteUrl, telHref, zaloHref, mailtoHref } from '@/lib/site'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Top hero placeholder so sticky nav has something to scroll past */}
      <section className="bg-bone px-4 py-24 text-center">
        <p className="text-sm uppercase tracking-widest text-taupe">
          Phase 2 — Layout Shell · Anchor Placeholders
        </p>
        <h1 className="font-black uppercase tracking-wide text-4xl md:text-5xl text-burgundy mt-3">
          {company.shortName}
        </h1>
        <p className="italic text-burgundy-dark mt-2">&quot;{company.tagline}&quot;</p>
      </section>

      <section id="dich-vu" className="bg-bone-dark px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-black uppercase tracking-wide text-3xl text-burgundy">
            Dịch vụ
          </h2>
          <p className="mt-3 text-espresso">
            Placeholder — Phase 3 sẽ render 3 cards Services (Cung ứng VLXD · Xây dựng dân
            dụng · Vận chuyển đường thủy).
          </p>
        </div>
      </section>

      <section id="du-an" className="bg-bone px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-black uppercase tracking-wide text-3xl text-burgundy">
            Dự án
          </h2>
          <p className="mt-3 text-espresso">
            Placeholder — Phase 3 sẽ render 4 dự án tiêu biểu (Cao tốc Cái Nước · Cầu Cửa
            Lớn · Hòn Khoai · Nhà phố).
          </p>
        </div>
      </section>

      <section id="nang-luc" className="bg-bone-dark px-4 py-20">
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="font-black uppercase tracking-wide text-3xl text-burgundy">
            Năng lực
          </h2>
          <p className="text-espresso">
            Placeholder — Phase 3 sẽ render BigStats + Capabilities (đội tàu 700–3,900
            tấn, cơ giới, đội xây lắp).
          </p>

          {/* Phase 1 sentinel debug card — DELETE in Phase 3 */}
          <details className="bg-espresso text-bone p-4 rounded-sm">
            <summary className="cursor-pointer font-mono text-sm">
              Phase 1 sentinel (debug — remove in Phase 3)
            </summary>
            <div className="mt-3 font-mono text-xs space-y-1">
              <p>siteUrl = {siteUrl}</p>
              <p>tel = {telHref()}</p>
              <p>zalo = {zaloHref()}</p>
              <p>mail = {mailtoHref()}</p>
              <p>mst = {company.taxIdDisplay}</p>
              <p>address = {company.address.full}</p>
            </div>
          </details>
        </div>
      </section>

      <section id="doi-tac" className="bg-bone px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-black uppercase tracking-wide text-3xl text-burgundy">
            Đối tác
          </h2>
          <p className="mt-3 text-espresso">
            Placeholder — Phase 3 sẽ render PartnersMarquee (BINH ĐOÀN 12 · TRƯỜNG SƠN ·
            BỘ QUỐC PHÒNG · …).
          </p>
        </div>
      </section>

      <section id="lien-he" className="bg-bone-dark px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-black uppercase tracking-wide text-3xl text-burgundy">
            Liên hệ
          </h2>
          <p className="mt-3 text-espresso">
            Placeholder — Phase 3 sẽ render Contact section với 3 CTA (Gọi · Zalo ·
            Email).
          </p>
        </div>
      </section>
    </main>
  )
}
