"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, LayoutDashboard, Search, Globe,
  ArrowRight, Sparkles, Sun, Moon, Atom
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

const NAV_LINKS = [
  { label: "Eksplorasi", href: "/simulasi", icon: <Globe className="w-3.5 h-3.5" /> },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [logoError, setLogoError] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === "k") || e.key === "/") { e.preventDefault(); setIsSearchOpen(true); }
      if (e.key === "Escape") { setIsSearchOpen(false); setIsOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onKey); };
  }, []);

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
    document.body.style.overflow = isSearchOpen || isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isSearchOpen, isOpen]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/simulasi?search=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const iconBtnCls = "flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/[0.08] text-zinc-400 hover:text-white transition-all duration-200 shrink-0";

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${
          isScrolled ? "pt-3 pb-2" : "pt-5 pb-0"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-5">
          <div
            className={`flex items-center justify-between h-14 px-4 sm:px-5 rounded-2xl border transition-all duration-500 ${
              isScrolled
                ? "bg-zinc-950/85 border-white/10 shadow-2xl shadow-black/40 backdrop-blur-2xl"
                : "bg-white/[0.04] border-white/[0.07] backdrop-blur-xl"
            }`}
          >
            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
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
              <div className="flex flex-col leading-none">
                <span className="font-black text-[15px] tracking-tighter text-white">
                  ARSHAKA<span className="text-indigo-400">EDU</span>
                </span>
                <span className="hidden sm:block text-[7px] font-black uppercase tracking-[0.28em] text-zinc-600 mt-0.5">
                  Practice &amp; Learning
                </span>
              </div>
            </Link>

            {/* ── Desktop Center Links ── */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/8 border border-transparent hover:border-white/8 transition-all duration-200"
                >
                  {l.icon}
                  {l.label}
                </Link>
              ))}
            </div>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button onClick={() => setIsSearchOpen(true)} className={iconBtnCls} aria-label="Cari">
                <Search className="w-4 h-4" />
              </button>

              {/* Dashboard — desktop */}
              <Link
                href="/dashboard"
                className="hidden md:flex items-center gap-2 h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20"
              >
                <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden lg:inline">Dashboard</span>
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setIsOpen((v) => !v)}
                className={`${iconBtnCls} lg:hidden`}
                aria-label="Menu"
              >
                {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="max-w-6xl mx-auto px-4 sm:px-5 pt-2 lg:hidden"
            >
              <div className="bg-zinc-950/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 shadow-2xl space-y-2">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3.5 bg-white/5 hover:bg-white/8 rounded-xl border border-white/[0.06] transition-all group"
                  >
                    <span className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:scale-110 transition-transform">
                      {l.icon}
                    </span>
                    <span className="font-black text-[11px] uppercase tracking-widest text-white">{l.label}</span>
                  </Link>
                ))}
                <button
                  onClick={() => { toggleTheme(); }}
                  className="flex items-center gap-3 w-full p-3.5 bg-white/5 hover:bg-white/8 rounded-xl border border-white/[0.06] transition-all group"
                >
                  <span className="p-2 bg-white/5 rounded-lg text-zinc-400 group-hover:scale-110 transition-transform">
                    {!mounted ? <div className="w-3.5 h-3.5" /> : theme === "dark"
                      ? <Sun className="w-3.5 h-3.5 text-amber-400" />
                      : <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    }
                  </span>
                  <span className="font-black text-[11px] uppercase tracking-widest text-white">
                    {!mounted ? "Ubah Tema" : `Mode ${theme === "dark" ? "Terang" : "Gelap"}`}
                  </span>
                </button>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-colors active:scale-95"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Akses Dashboard
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Search Overlay ── */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-xl flex items-start justify-center pt-20 sm:pt-28 px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSearch} className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-indigo-400">
                    <Sparkles className="w-3 h-3" />
                    Cari Laboratorium
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors"
                    aria-label="Tutup"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Cari simulasi, topik, atau mata pelajaran..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:text-zinc-600"
                  />
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Populer:</span>
                  {["Hukum Newton", "Atom", "Kalkulus", "Sel", "DNA"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-bold text-zinc-400 border border-white/[0.06] transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </form>

              <div className="bg-black/20 px-5 py-3 border-t border-white/[0.06] flex items-center justify-between">
                <div className="hidden sm:flex gap-4 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                  <span><kbd className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-zinc-500 text-[8px] mr-1">ENTER</kbd>Cari</span>
                  <span><kbd className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-zinc-500 text-[8px] mr-1">ESC</kbd>Tutup</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSearch()}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors"
                >
                  Cari Sekarang <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}