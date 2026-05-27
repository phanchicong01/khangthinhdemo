// Server component — renders at build time. NO client JS.
// Per D-09: 3-col desktop / 1-col mobile.
// Per D-22: All company data MUST import from @/lib/site.
import Link from 'next/link'
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react'
import { company, telHref, mailtoHref, zaloHref } from '@/lib/site'

const navAnchors = [
  { href: '#dich-vu',  label: 'Dịch vụ' },
  { href: '#du-an',    label: 'Dự án' },
  { href: '#nang-luc', label: 'Năng lực' },
  { href: '#doi-tac',  label: 'Đối tác' },
  { href: '#lien-he',  label: 'Liên hệ' },
] as const

export default function Footer() {
  return (
    <footer className="bg-espresso text-bone mt-24">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Col 1: Company info (legal block) — per D-09 */}
        <div className="space-y-3">
          <p className="font-black uppercase tracking-wide text-xl text-bone">
            {company.shortName}
          </p>
          <p className="italic text-bone-dark text-sm">&quot;{company.tagline}&quot;</p>
          <dl className="text-sm space-y-1 mt-4">
            <div className="flex gap-2">
              <dt className="text-taupe min-w-[3.5rem]">Tên:</dt>
              <dd>{company.legalName}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-taupe min-w-[3.5rem]">MST:</dt>
              <dd>{company.taxIdDisplay}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-taupe min-w-[3.5rem]">ĐDPL:</dt>
              <dd>{company.legalRep}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-taupe min-w-[3.5rem]">
                <MapPin className="w-4 h-4 inline" aria-hidden="true" />
              </dt>
              <dd>{company.address.full}</dd>
            </div>
          </dl>
        </div>

        {/* Col 2: Quick links — per D-10 */}
        <nav aria-label="Liên kết nhanh" className="space-y-3">
          <p className="font-bold uppercase tracking-wide text-sm text-taupe">Liên kết</p>
          <ul className="space-y-2 text-sm">
            {navAnchors.map((a) => (
              <li key={a.href}>
                <a
                  href={a.href}
                  className="inline-block min-h-[44px] py-2 hover:text-terracotta"
                >
                  {a.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/du-an"
                className="inline-block min-h-[44px] py-2 hover:text-terracotta"
              >
                Tất cả dự án
              </Link>
            </li>
          </ul>
        </nav>

        {/* Col 3: Contact — per D-09 (3 CTAs) + D-19 (plain-text email fallback next to mailto) */}
        <div className="space-y-3">
          <p className="font-bold uppercase tracking-wide text-sm text-taupe">Liên hệ</p>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={telHref()}
                className="inline-flex items-center gap-2 min-h-[44px] py-2 hover:text-terracotta"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span>{company.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a
                href={zaloHref()}
                rel="noopener"
                className="inline-flex items-center gap-2 min-h-[44px] py-2 hover:text-terracotta"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Zalo: {company.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a
                href={mailtoHref()}
                className="inline-flex items-center gap-2 min-h-[44px] py-2 hover:text-terracotta"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>{company.email}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright bar — per D-11 (fixed year 2025) */}
      <div className="border-t border-bone-dark/10">
        <p className="max-w-6xl mx-auto px-4 py-4 text-xs text-taupe text-center">
          © 2025 KHANG THỊNH INV. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
