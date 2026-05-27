// Phase 3 — composed landing page. Renders 8 sections in locked order:
//   Hero → PartnersMarquee → Services → Projects → (BigStats + Capabilities, wrapped #nang-luc) → CtaQuote → Contact
// Anchor coverage (matches Nav at src/components/layout/Nav.tsx):
//   #dich-vu  → Services
//   #du-an    → Projects
//   #nang-luc → wrapping section around BigStats + Capabilities (set here)
//   #doi-tac  → PartnersMarquee
//   #lien-he  → Contact
// All sections are server components and run under the Nav/Footer/FloatingZalo
// shell wired in src/app/layout.tsx.
import Hero from '@/components/sections/Hero'
import PartnersMarquee from '@/components/sections/PartnersMarquee'
import Services from '@/components/sections/Services'
import Projects from '@/components/sections/Projects'
import BigStats from '@/components/sections/BigStats'
import Capabilities from '@/components/sections/Capabilities'
import CtaQuote from '@/components/sections/CtaQuote'
import Contact from '@/components/sections/Contact'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <PartnersMarquee />
      <Services />
      <Projects />
      {/* #nang-luc wraps BigStats + Capabilities so the Nav "Năng lực" link */}
      {/* lands on the combined capability block. Neither child carries an id. */}
      <section id="nang-luc" aria-label="Năng lực">
        <BigStats />
        <Capabilities />
      </section>
      <CtaQuote />
      <Contact />
    </main>
  )
}
