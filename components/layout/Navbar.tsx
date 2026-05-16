"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Atom, 
  Menu, 
  X, 
  LayoutDashboard,
  Search,
  Globe,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === 'k') || e.key === '/') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    // Prevent body scroll when overlay is open
    document.body.style.overflow = isSearchOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/simulasi?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-3 md:py-4' : 'py-4 md:py-6'}`}>
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className={`relative flex items-center justify-between px-4 sm:px-6 md:px-8 h-14 md:h-16 rounded-[18px] md:rounded-[24px] border border-white/10 backdrop-blur-2xl transition-all duration-500 ${isScrolled ? 'bg-zinc-950/80 shadow-2xl' : 'bg-white/5'}`}>
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2 md:p-2.5 rounded-xl md:rounded-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-500">
                <Atom className="w-5 h-5 md:w-6 md:h-6 text-white animate-spin-slow" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-base md:text-xl tracking-tighter text-white leading-none">
                ARSHAKA<span className="text-indigo-400">EDU</span>
              </span>
              <span className="hidden sm:block text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500">Practice &amp; Learning</span>
            </div>
          </Link>

          {/* Desktop Navigation — center */}
          <div className="hidden lg:flex items-center gap-8">
            <Link 
              href="/simulasi" 
              className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 shadow-inner text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all flex items-center gap-2 group"
            >
              <Globe className="w-3 h-3 group-hover:rotate-12 transition-transform" /> 
              Eksplorasi
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search button — always visible */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex p-2 md:p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-zinc-400 hover:text-white group relative"
              aria-label="Buka pencarian"
            >
               <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
               <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
            </button>

            {/* Dashboard — hidden on mobile */}
            <Link href="/dashboard" className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 lg:px-5 py-2 md:py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden lg:inline">Dashboard</span>
            </Link>

            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 md:p-2.5 bg-white/5 rounded-xl border border-white/5 text-zinc-400 hover:text-white transition-all"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Menu className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Global Search Overlay ── */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-start justify-center pt-16 sm:pt-20 md:pt-24 px-4"
          >
             <motion.div 
               initial={{ opacity: 0, y: -20, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: -20, scale: 0.95 }}
               onClick={(e) => e.stopPropagation()}
               className="w-full max-w-xl md:max-w-2xl bg-zinc-900 border border-white/10 rounded-[24px] md:rounded-[32px] shadow-2xl overflow-hidden"
             >
                <form onSubmit={handleSearch} className="p-5 md:p-8 space-y-4 md:space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                         <Sparkles className="w-3 h-3" />
                         Cari Laboratorium
                      </div>
                      <button 
                        type="button"
                        onClick={() => setIsSearchOpen(false)}
                        className="p-2 hover:bg-white/5 rounded-xl text-zinc-500 transition-colors"
                        aria-label="Tutup pencarian"
                      >
                         <X className="w-5 h-5" />
                      </button>
                   </div>
                   
                   <div className="relative">
                      <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-zinc-500" />
                      <input 
                        ref={searchInputRef}
                        type="text" 
                        placeholder="Cari simulasi..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-4 md:py-6 pl-12 md:pl-16 pr-4 md:pr-6 text-base md:text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                      />
                   </div>

                   <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mr-1 self-center">Populer:</span>
                      {['Hukum Newton', 'Atom', 'Kalkulus', 'Sel', 'DNA'].map(tag => (
                        <button 
                          key={tag}
                          type="button"
                          onClick={() => setSearchQuery(tag)}
                          className="px-3 md:px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-bold text-zinc-400 border border-white/5 transition-all"
                        >
                           {tag}
                        </button>
                      ))}
                   </div>
                </form>

                <div className="bg-black/20 px-5 md:px-6 py-4 border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                   <div className="hidden sm:flex gap-4">
                      <span><kbd className="bg-white/5 px-2 py-1 rounded border border-white/10 mr-2 text-zinc-400 text-[8px]">ENTER</kbd> Cari</span>
                      <span><kbd className="bg-white/5 px-2 py-1 rounded border border-white/10 mr-2 text-zinc-400 text-[8px]">ESC</kbd> Tutup</span>
                   </div>
                   <button 
                     type="button"
                     onClick={handleSearch as any}
                     className="sm:hidden flex items-center gap-2 text-indigo-400 font-black"
                   >
                      Cari Sekarang <ArrowRight className="w-3 h-3" />
                   </button>
                   <div className="hidden sm:flex items-center gap-2 text-indigo-400">
                      Cari di Arshaka Edu <ArrowRight className="w-3 h-3" />
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 px-3 sm:px-4 md:px-6 pt-2 lg:hidden z-50"
          >
            <div className="bg-zinc-950/95 backdrop-blur-3xl border border-white/10 rounded-[24px] p-5 md:p-8 shadow-2xl space-y-4">
              <Link 
                href="/simulasi" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-4 md:p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group"
              >
                <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="font-black text-xs uppercase tracking-widest text-white">Eksplorasi Simulasi</span>
              </Link>
              <Link 
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-3 w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Akses Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
