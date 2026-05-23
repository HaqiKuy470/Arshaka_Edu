"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, Play, Beaker, Calculator, Globe, BookOpen,
  Zap, Dna, Telescope, Sparkles, Cpu, Atom, ChevronRight,
  ShieldCheck, Users, Layers, GraduationCap, Presentation, Puzzle
} from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = [
  { name: "Fisika", icon: <Atom className="w-5 h-5" />, color: "from-blue-600 to-cyan-400", bg: "bg-blue-600/10 border-blue-500/20 group-hover:border-blue-500/40", slug: "fisika", count: 12 },
  { name: "Kimia", icon: <Beaker className="w-5 h-5" />, color: "from-purple-600 to-pink-500", bg: "bg-purple-600/10 border-purple-500/20 group-hover:border-purple-500/40", slug: "kimia", count: 8 },
  { name: "Matematika", icon: <Calculator className="w-5 h-5" />, color: "from-emerald-600 to-teal-400", bg: "bg-emerald-600/10 border-emerald-500/20 group-hover:border-emerald-500/40", slug: "matematika", count: 15 },
  { name: "Biologi", icon: <Dna className="w-5 h-5" />, color: "from-green-600 to-lime-400", bg: "bg-green-600/10 border-green-500/20 group-hover:border-green-500/40", slug: "biologi", count: 10 },
  { name: "Ilmu Bumi", icon: <Globe className="w-5 h-5" />, color: "from-amber-600 to-orange-400", bg: "bg-amber-600/10 border-amber-500/20 group-hover:border-amber-500/40", slug: "bumi", count: 7 },
  { name: "Astronomi", icon: <Telescope className="w-5 h-5" />, color: "from-indigo-600 to-blue-500", bg: "bg-indigo-600/10 border-indigo-500/20 group-hover:border-indigo-500/40", slug: "astronomi", count: 6 },
  { name: "Teknologi", icon: <Cpu className="w-5 h-5" />, color: "from-rose-600 to-red-400", bg: "bg-rose-600/10 border-rose-500/20 group-hover:border-rose-500/40", slug: "teknologi", count: 5 },
  { name: "Seni", icon: <Layers className="w-5 h-5" />, color: "from-fuchsia-600 to-purple-400", bg: "bg-fuchsia-600/10 border-fuchsia-500/20 group-hover:border-fuchsia-500/40", slug: "seni", count: 4 },
];

const FEATURED = [
  { title: "Gelombang Suara", cat: "Fisika", desc: "Visualisasi osilasi udara dan bagaimana frekuensi menciptakan nada.", accent: "from-blue-600/30 to-cyan-600/10" },
  { title: "Struktur Atom", cat: "Kimia", desc: "Jelajahi inti atom dan awan elektron dalam skala sub-atomik.", accent: "from-purple-600/30 to-pink-600/10" },
  { title: "Tata Surya 3D", cat: "Astronomi", desc: "Perjalanan melintasi kosmos dan pahami hukum Kepler secara visual.", accent: "from-indigo-600/30 to-blue-600/10" },
];

const STATS = [
  { label: "Simulasi Aktif", value: "150+", color: "text-indigo-400" },
  { label: "Gratis", value: "100%", color: "text-purple-400" },
  { label: "Open Source", value: "100%", color: "text-emerald-400" },
  { label: "Mata Pelajaran", value: "10+", color: "text-amber-400" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
} as const;
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
} as const;

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-[#060608] min-h-screen text-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center text-center px-5 pt-24 pb-14 sm:pt-32 sm:pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Aura blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-700/8 blur-[140px] rounded-full" />
          <div className="absolute top-40 -right-32 w-[400px] h-[400px] bg-purple-700/8 blur-[120px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center gap-5"
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-300">
            <Sparkles className="w-3 h-3 shrink-0" />
            Platform Edukasi Terbuka &amp; Gratis
          </span>

          {/* Headline */}
          <h1 className="text-[clamp(2rem,7vw,4rem)] font-black tracking-tighter leading-[1] text-white">
            BELAJAR DAN PRAKTIK<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              TANPA BATAS
            </span>
          </h1>

          {/* Sub */}
          <p className="text-sm sm:text-base text-zinc-500 max-w-lg leading-relaxed font-medium">
            Jelajahi dunia melalui simulasi interaktif yang mendalam. Arshaka Edu mendefinisikan ulang cara kita memahami konsep abstrak dengan visualisasi modern.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-1">
            <Link
              href="/simulasi"
              className="group relative w-full sm:w-auto h-12 sm:h-13 px-8 rounded-xl bg-indigo-600 text-white font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2.5 hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-600/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 -translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <Play className="w-4 h-4 fill-current relative z-10 shrink-0" />
              <span className="relative z-10">Mulai Eksplorasi</span>
            </Link>
            <Link
              href="/tentang"
              className="w-full sm:w-auto h-12 sm:h-13 px-8 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all"
            >
              Pelajari Visi Kami
              <ArrowRight className="w-4 h-4 text-zinc-500 shrink-0" />
            </Link>
          </div>
        </motion.div>

        {/* Hero mockup */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="relative mt-12 sm:mt-16 w-full max-w-4xl mx-auto"
        >
          {/* Glow under mockup */}
          <div className="absolute inset-x-8 -bottom-6 h-16 bg-indigo-600/20 blur-2xl rounded-full" />

          <div className="relative w-full aspect-[16/9] bg-zinc-900/50 rounded-2xl sm:rounded-[28px] border border-white/[0.07] shadow-2xl overflow-hidden backdrop-blur-md">
            {/* Grid overlay */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-5 pointer-events-none opacity-[0.06]">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-white" />
              ))}
            </div>

            {/* Top bar simulation */}
            <div className="absolute top-4 sm:top-6 left-5 sm:left-8 right-5 sm:right-8 flex justify-between items-center">
              <div className="flex flex-col gap-1.5">
                <div className="h-2.5 w-20 sm:w-28 bg-white/10 rounded-full" />
                <div className="h-5 sm:h-7 w-36 sm:w-52 bg-white/5 rounded-lg" />
              </div>
              <div className="flex gap-2">
                <div className="h-7 sm:h-9 w-7 sm:w-9 bg-white/10 rounded-lg" />
                <div className="h-7 sm:h-9 w-7 sm:w-9 bg-white/10 rounded-lg" />
              </div>
            </div>

            {/* Center content area */}
            <div className="absolute inset-x-5 sm:inset-x-10 bottom-0 top-16 sm:top-20 bg-zinc-950/60 border-x border-t border-white/[0.08] rounded-t-xl sm:rounded-t-2xl flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-24 sm:w-36 h-24 sm:h-36 bg-indigo-500/15 blur-3xl rounded-full" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                >
                  <Atom className="w-14 h-14 sm:w-24 sm:h-24 text-indigo-400/60" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-white/[0.06] bg-zinc-950/60 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-5 py-6 sm:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 text-center">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className={`text-2xl sm:text-3xl font-black tracking-tighter ${s.color}`}>{s.value}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="w-full py-14 sm:py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-white uppercase">Eksplorasi Dunia</h2>
              <p className="text-zinc-500 text-xs sm:text-sm font-medium mt-1.5 max-w-sm">
                Pilih gerbang menuju pengetahuan. Setiap simulasi dirancang untuk mengubah cara Anda melihat realitas.
              </p>
            </div>
            <Link href="/simulasi" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors group shrink-0">
              Lihat Semua
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Grid — 2 col mobile, 4 col md+ */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
          >
            {CATEGORIES.map((cat) => (
              <motion.div key={cat.slug} variants={itemVariants}>
                <Link
                  href="/simulasi"
                  className={`group relative flex flex-col justify-between h-36 sm:h-44 md:h-52 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/50 border transition-all duration-500 overflow-hidden ${cat.bg}`}
                >
                  {/* Hover glow */}
                  <div className={`absolute -top-4 -right-4 w-28 h-28 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-15 blur-2xl rounded-full transition-opacity duration-500 pointer-events-none`} />

                  <div className="space-y-2.5 relative z-10">
                    <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${cat.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-400`}>
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight leading-tight">{cat.name}</h3>
                      <p className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{cat.count} Simulasi</p>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between mt-2">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
                      <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                    </div>
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-3 group-hover:translate-x-0 hidden sm:block">
                      Buka Lab
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="w-full py-14 sm:py-20 bg-white/[0.02] border-y border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-10 sm:mb-14 space-y-2">
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              Simulasi Unggulan
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-white uppercase">Sains Populer</h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
          >
            {FEATURED.map((sim, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="group bg-zinc-900 rounded-2xl sm:rounded-[24px] overflow-hidden border border-white/[0.06] hover:border-white/15 transition-all duration-500"
              >
                {/* Thumbnail */}
                <div className={`relative h-36 sm:h-40 bg-gradient-to-br ${sim.accent} flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/30" />
                  <button className="relative w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-400 shadow-xl">
                    <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4 sm:p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">{sim.cat}</span>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-zinc-600 uppercase">
                      <Users className="w-2.5 h-2.5" />1.2K
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight leading-tight">{sim.title}</h3>
                  <p className="text-zinc-500 text-xs sm:text-sm font-medium leading-relaxed">{sim.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ECOSYSTEM ── */}
      <section className="w-full py-14 sm:py-20 bg-black/30 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-10 sm:mb-14 space-y-2">
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-indigo-400">
              <Zap className="w-3 h-3" />
              Ekosistem Belajar
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-white uppercase">Solusi Pembelajaran Interaktif</h2>
            <p className="text-zinc-500 max-w-lg mx-auto font-medium text-xs sm:text-sm">
              Arshaka Edu dirancang khusus untuk mendukung kolaborasi dan kemajuan di setiap jenjang pendidikan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Card helper */}
            {[
              {
                icon: <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />,
                iconBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
                glow: "bg-indigo-500/8 group-hover:bg-indigo-500/14",
                hoverBorder: "hover:border-indigo-500/25",
                label: "Untuk Siswa",
                sub: "Eksplorasi & Gamifikasi",
                linkColor: "text-indigo-400",
                linkLabel: "Mulai Sekarang",
                footerLabel: "Siap Belajar?",
                items: [
                  { e: "🎮", t: "Simulasi interaktif dengan kontrol real-time yang responsif" },
                  { e: "📝", t: "Lembar kerja digital terintegrasi untuk latihan praktis" },
                  { e: "📈", t: <>Rekam hasil eksperimen otomatis <Badge>Butuh Akun</Badge></> },
                  { e: "🏆", t: <>Gamifikasi interaktif (poin, badge, level belajar) <Badge>Butuh Akun</Badge></> },
                ],
              },
              {
                icon: <Presentation className="w-5 h-5 sm:w-6 sm:h-6" />,
                iconBg: "bg-purple-500/10 border-purple-500/20 text-purple-400",
                glow: "bg-purple-500/8 group-hover:bg-purple-500/14",
                hoverBorder: "hover:border-purple-500/25",
                label: "Untuk Guru",
                sub: "Manajemen & Evaluasi",
                linkColor: "text-purple-400",
                linkLabel: "Akses Portal",
                footerLabel: "Portal Guru",
                items: [
                  { e: "📋", t: "Buat kelas virtual dan pantau progres belajar siswa secara real-time" },
                  { e: "📌", t: "Tambahkan modul simulasi interaktif ke dalam tugas belajar" },
                  { e: "🗒️", t: "Panduan mengajar lengkap untuk setiap simulasi yang tersedia" },
                  { e: "📊", t: "Dashboard laporan analitis perkembangan kelas & individu" },
                ],
              },
              {
                icon: <Puzzle className="w-5 h-5 sm:w-6 sm:h-6" />,
                iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                glow: "bg-emerald-500/8 group-hover:bg-emerald-500/14",
                hoverBorder: "hover:border-emerald-500/25",
                label: "Untuk Pengembang",
                sub: "Integrasi & Ekstensi",
                linkColor: "text-emerald-400",
                linkLabel: "Buka Docs",
                footerLabel: "Developer Hub",
                items: [
                  { e: "🔌", t: "API terbuka untuk integrasi penuh dengan LMS internal sekolah" },
                  { e: "🧩", t: "Plugin pendukung Google Classroom & Moodle siap pakai" },
                  { e: "🛠️", t: "Dokumentasi teknis lengkap dan SDK simulasi interaktif" },
                ],
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className={`group relative flex flex-col justify-between rounded-2xl sm:rounded-[22px] bg-zinc-900/40 border border-white/[0.07] ${card.hoverBorder} p-5 sm:p-6 overflow-hidden transition-all duration-500`}
              >
                {/* Top glow */}
                <div className={`absolute top-0 right-0 w-40 h-40 ${card.glow} blur-3xl rounded-full pointer-events-none transition-colors duration-500`} />

                <div className="space-y-4 relative z-10">
                  {/* Icon */}
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center ${card.iconBg} group-hover:scale-105 transition-transform duration-400`}>
                    {card.icon}
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">{card.label}</h3>
                    <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest mt-0.5">{card.sub}</p>
                  </div>

                  {/* List */}
                  <ul className="space-y-2.5">
                    {card.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-zinc-400 text-xs sm:text-sm font-medium leading-relaxed">
                        <span className="text-sm mt-0.5 shrink-0">{item.e}</span>
                        <span>{item.t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div className="relative z-10 pt-4 mt-5 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{card.footerLabel}</span>
                  <Link href="/login" className={`flex items-center gap-1 text-[10px] sm:text-xs font-black uppercase tracking-widest ${card.linkColor} hover:text-white transition-colors group/btn`}>
                    {card.linkLabel}
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

/* ── helpers ── */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center text-[8px] sm:text-[9px] font-bold text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded-full whitespace-nowrap ml-1">
      {children}
    </span>
  );
}