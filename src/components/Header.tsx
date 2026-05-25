"use client";
import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/dich-vu", label: "Dịch vụ" },
  { href: "/du-an", label: "Dự án" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a5276] text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f39c12] rounded-full flex items-center justify-center font-bold text-[#1a5276] text-sm">
            KT
          </div>
          <div>
            <div className="font-bold text-base leading-tight">KHANG THỊNH INV</div>
            <div className="text-xs text-blue-200 leading-tight">Hợp tác cùng phát triển</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium hover:text-[#f39c12] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="tel:0921985599"
          className="hidden md:inline-flex items-center gap-2 bg-[#f39c12] hover:bg-[#e67e22] text-[#1c2833] font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
        >
          📞 092 198 55 99
        </a>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="block w-5 h-0.5 bg-white mb-1"></span>
          <span className="block w-5 h-0.5 bg-white mb-1"></span>
          <span className="block w-5 h-0.5 bg-white"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#154360] px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm font-medium hover:text-[#f39c12] transition-colors border-b border-blue-700"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="tel:0921985599"
            className="mt-3 block text-center bg-[#f39c12] text-[#1c2833] font-semibold text-sm px-4 py-2 rounded-lg"
          >
            📞 092 198 55 99
          </a>
        </div>
      )}
    </header>
  );
}
