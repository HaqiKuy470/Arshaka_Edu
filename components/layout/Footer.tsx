"use client";

import React from "react";
import Link from "next/link";
import { 
  Atom, 
  ArrowUpRight,
  Heart,
  Zap
} from "lucide-react";

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const DiscordIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="12" r="1" />
    <circle cx="15" cy="12" r="1" />
    <path d="M7.5 7.13a11 11 0 0 1 9 0" />
    <path d="M7.5 17.13a11 11 0 0 0 9 0" />
    <path d="M2.5 10c0 4.47 3.5 8 8 8h3c4.47 0 8-3.51 8-8V8.5c0-4.47-3.51-8-8-8h-3c-4.47 0-8 3.51-8 8V10Z" />
  </svg>
);

const TelegramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-16 md:mt-20 overflow-hidden border-t border-white/5 bg-zinc-950">
      {/* Decorative Auras */}
      <div className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-20 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16 mb-12 md:mb-20">
          
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-6 md:space-y-8">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 md:p-2.5 rounded-xl md:rounded-2xl shadow-lg group-hover:scale-105 transition-transform">
                <Atom className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="font-black text-lg md:text-xl tracking-tighter text-white">
                ARSHAKA<span className="text-indigo-400">EDU</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs font-medium italic">
              "Mendefinisikan ulang cara dunia belajar melalui visualisasi interaktif yang mendalam dan imersif."
            </p>
            <div className="flex items-center gap-3">
              {[
                { name: "GitHub", icon: <GithubIcon />, href: "https://github.com" },
                { name: "Discord", icon: <DiscordIcon />, href: "https://discord.com" },
                { name: "Telegram", icon: <TelegramIcon />, href: "https://t.me" },
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href} 
                  target="_blank"
                  className="p-2.5 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-zinc-400 hover:text-white"
                  aria-label={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 sm:col-span-2 lg:col-span-2 gap-8 md:gap-8">
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Mata Pelajaran</h3>
              <ul className="space-y-3 md:space-y-4">
                {['Fisika', 'Kimia', 'Matematika', 'Biologi', 'Astronomi'].map((item) => (
                  <li key={item}>
                    <Link href="/simulasi" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group">
                      {item}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Ekosistem</h3>
              <ul className="space-y-3 md:space-y-4">
                {['Tentang Kami', 'Untuk Guru', 'Open Source', 'Kontribusi', 'Donasi'].map((item) => (
                  <li key={item}>
                    <Link href="/simulasi" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group">
                      {item}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA Column */}
          <div className="sm:col-span-2 lg:col-span-1">
             <div className="p-6 md:p-8 bg-white/5 rounded-[24px] md:rounded-[32px] border border-white/5 space-y-4 md:space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                   <Zap className="w-16 h-16 md:w-20 md:h-20 text-yellow-500" />
                </div>
                <h3 className="text-base md:text-lg font-black text-white leading-tight">Dukung Pendidikan Gratis Selamanya</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  Bantu kami menyediakan simulasi terbaik untuk jutaan siswa di Indonesia.
                </p>
                <button className="w-full py-3 md:py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                  Donasi Sekarang
                </button>
             </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 md:pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-xs font-black text-zinc-500 uppercase tracking-widest">
            <span>© {currentYear} ARSHAKA EDU</span>
            <div className="w-1 h-1 rounded-full bg-zinc-800" />
            <span>Karya Bangsa</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Made with <Heart className="w-3 h-3 text-rose-500 animate-pulse" /> for Education
            </div>
            <div className="flex gap-4">
              <Link href="/privasi" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Privacy</Link>
              <Link href="/syarat" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
