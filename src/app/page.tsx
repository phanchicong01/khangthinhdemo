// Phase 3 + Phase 5 — composed landing page with embedded JSON-LD @graph.
//
// Phase 3 (locked): 8 sections rendered in order under <main>.
//   Hero → PartnersMarquee → Services → Projects → (BigStats + Capabilities, wrapped #nang-luc) → CtaQuote → Contact
//
// Phase 5 SEO-04 (D-01..D-06):
//   @graph JSON-LD with TWO nodes — Organization + GeneralContractor — linked via @id.
//   Injected as inline <script type="application/ld+json"> BEFORE <main> (D-03 — NOT next/script).
//   All NAP fields sourced from @/lib/site (Pitfall #6 phone E.164, Pitfall #10 URLs from siteUrl).
//
// Anchor coverage (matches Nav at src/components/layout/Nav.tsx):
//   #dich-vu → Services    #du-an → Projects    #nang-luc → BigStats+Capabilities wrapper
//   #doi-tac → PartnersMarquee    #lien-he → Contact
import Hero from '@/components/sections/Hero'
import PartnersMarquee from '@/components/sections/PartnersMarquee'
import Services from '@/components/sections/Services'
import Projects from '@/components/sections/Projects'
import BigStats from '@/components/sections/BigStats'
import Capabilities from '@/components/sections/Capabilities'
import CtaQuote from '@/components/sections/CtaQuote'
import Contact from '@/components/sections/Contact'
import { siteUrl, company } from '@/lib/site'

export default function HomePage() {
  // Per D-04: @graph with Organization + GeneralContractor.
  // Skipped per D-05: founder, openingHours, social sameAs (no profiles yet).
  // Pitfall #6: telephone MUST be E.164 (+84826553599) — uses company.phoneE164.
  // Pitfall #10: every URL built from siteUrl — never hardcode the domain.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}#organization`,
        name: company.legalName,
        alternateName: company.shortName,
        url: siteUrl,
        taxID: company.taxId,
        foundingDate: String(company.founded),
        sameAs: [siteUrl],
      },
      {
        '@type': 'GeneralContractor',
        '@id': `${siteUrl}#business`,
        name: company.legalName,
        image: `${siteUrl}/og.png`,
        url: siteUrl,
        telephone: company.phoneE164,
        email: company.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: company.address.street,
          addressLocality: 'Bến Lức',
          addressRegion: company.address.region,
          addressCountry: company.address.country,
        },
        taxID: company.taxId,
        parentOrganization: { '@id': `${siteUrl}#organization` },
        areaServed: [
          { '@type': 'AdministrativeArea', name: 'Tây Ninh' },
          { '@type': 'AdministrativeArea', name: 'Long An' },
          { '@type': 'AdministrativeArea', name: 'Cà Mau' },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Cung ứng cát, đá, vật liệu san lấp',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Xây dựng nhà phố và công trình dân dụng',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Vận chuyển đường thủy',
              },
            },
          ],
        },
      },
    ],
  }

  return (
    <>
      {/* JSON-LD @graph — D-03: inline <script>, NOT next/script (parsed at HTML-parse time). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
    </>
  )
}
