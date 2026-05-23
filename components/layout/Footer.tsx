"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Heart, Zap, Atom } from "lucide-react";

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const DiscordIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" />
    <path d="M7.5 7.13a11 11 0 0 1 9 0" /><path d="M7.5 17.13a11 11 0 0 0 9 0" />
    <path d="M2.5 10c0 4.47 3.5 8 8 8h3c4.47 0 8-3.51 8-8V8.5c0-4.47-3.51-8-8-8h-3c-4.47 0-8 3.51-8 8V10Z" />
  </svg>
);

const TelegramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
  </svg>
);

const SOCIALS = [
  { name: "GitHub", icon: <GithubIcon />, href: "https://github.com/HaqiKuy470" },
  { name: "Discord", icon: <DiscordIcon />, href: "#" },
  { name: "Telegram", icon: <TelegramIcon />, href: "https://t.me/+AbXUSinrWzFhMmVl" },
];

const SUBJECTS = ["Fisika", "Kimia", "Matematika", "Biologi", "Astronomi"];

const ECOSYSTEM = [
  { name: "Tentang Kami", href: "#" },
  { name: "Untuk Guru", href: "/dashboard" },
  { name: "Open Source", href: "https://github.com/HaqiKuy470/Arshaka_Edu", external: true },
  { name: "Kontribusi", href: "https://github.com/HaqiKuy470/Arshaka_Edu/blob/main/CONTRIBUTING.md", external: true },
  { name: "Donasi", href: "/donasi" },
];

function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <li>
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-white transition-colors duration-200 group"
      >
        {children}
        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
      </Link>
    </li>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="relative border-t border-white/[0.06] bg-zinc-950 overflow-hidden">
      {/* Ambient auras */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-indigo-700/8 blur-[130px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-700/8 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 pt-12 sm:pt-16 pb-8">

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] gap-10 sm:gap-12 mb-10 sm:mb-14">

          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center group-hover:scale-105 transition-transform duration-400 shrink-0">
                {logoError ? (
                  <Atom className="w-4 h-4 text-indigo-400" />
                ) : (
                  <img
                    src="/logo.png"
                    alt="Arshaka Edu"
                    className="w-full h-full object-contain p-1"
                    onError={() => setLogoError(true)}
                  />
                )}
              </div>
              <span className="font-black text-base tracking-tighter text-white">
                ARSHAKA<span className="text-indigo-400">EDU</span>
              </span>
            </Link>

            <p className="text-xs text-zinc-500 leading-relaxed font-medium max-w-[240px] italic">
              "Mendefinisikan ulang cara dunia belajar melalui visualisasi interaktif yang mendalam."
            </p>

            <div className="flex items-center gap-2">
              {SOCIALS.map((s, i) => (
                <Link
                  key={i}
                  href={s.href}
                  aria-label={s.name}
                  className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/[0.07] text-zinc-500 hover:text-white transition-all duration-200"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Mata Pelajaran */}
          <div className="space-y-4">
            <h3 className="text-[9px] font-black uppercase tracking-[0.22em] text-zinc-600">Mata Pelajaran</h3>
            <ul className="space-y-2.5">
              {SUBJECTS.map((s) => (
                <FooterLink key={s} href="/simulasi">{s}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Ekosistem */}
          <div className="space-y-4">
            <h3 className="text-[9px] font-black uppercase tracking-[0.22em] text-zinc-600">Ekosistem</h3>
            <ul className="space-y-2.5">
              {ECOSYSTEM.map((item) => (
                <FooterLink key={item.name} href={item.href} external={item.external}>
                  {item.name}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Donation CTA */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="relative group p-5 bg-white/[0.04] rounded-2xl border border-white/[0.07] space-y-3.5 overflow-hidden hover:border-indigo-500/20 transition-all duration-400">
              {/* Decorative zap */}
              <div className="absolute -top-2 -right-2 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-400 pointer-events-none">
                <Zap className="w-20 h-20 text-yellow-400" />
              </div>

              <h3 className="text-sm font-black text-white leading-snug max-w-[180px]">
                Dukung Pendidikan Gratis Selamanya
              </h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                Bantu kami menyediakan simulasi terbaik untuk jutaan siswa di Indonesia.
              </p>
              <Link
                href="/donasi"
                className="flex items-center justify-center w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20"
              >
                Donasi Sekarang
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-600">
            <span>© {year} Arshaka Edu</span>
            <span className="w-1 h-1 rounded-full bg-zinc-800" />
            <span>Karya Bangsa</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-5">
            <span className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
              Made with <Heart className="w-2.5 h-2.5 text-rose-500 animate-pulse" /> for Education
            </span>
            <div className="flex gap-3">
              <Link href="/privacy" className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}