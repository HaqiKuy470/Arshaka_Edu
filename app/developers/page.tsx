"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Code, Terminal, Puzzle, BookOpen, Layers, Zap, ArrowRight, Plug, Box } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
} as const;

export default function DevelopersPage() {
  return (
    <div className="flex flex-col w-full bg-[#060608] min-h-screen text-white overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center text-center px-5 pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
        {/* Aura blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-700/8 blur-[140px] rounded-full" />
          <div className="absolute top-40 -right-32 w-[400px] h-[400px] bg-teal-700/8 blur-[120px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center gap-5"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-4 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Kembali ke Beranda</span>
          </Link>

          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">
            <Code className="w-3 h-3 shrink-0" />
            Developer Hub
          </span>

          {/* Headline */}
          <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-black tracking-tighter leading-[1] text-white">
            BANGUN & INTEGRASIKAN<br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              TANPA BATAS
            </span>
          </h1>

          {/* Sub */}
          <p className="text-sm sm:text-base text-zinc-500 max-w-lg leading-relaxed font-medium">
            Dokumentasi lengkap, panduan membuat simulasi baru, dan API untuk mengintegrasikan Arshaka Edu ke dalam platform belajar Anda.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-4">
            <Link
              href="/developers/docs"
              className="group relative w-full sm:w-auto h-12 sm:h-13 px-8 rounded-xl bg-emerald-600 text-white font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2.5 hover:bg-emerald-500 active:scale-95 transition-all shadow-lg shadow-emerald-600/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 -translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <Terminal className="w-4 h-4 relative z-10 shrink-0" />
              <span className="relative z-10">Baca Dokumentasi</span>
            </Link>
            <Link
              href="/developers/sdk"
              className="w-full sm:w-auto h-12 sm:h-13 px-8 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all"
            >
              <Box className="w-4 h-4 text-zinc-400 shrink-0" />
              Panduan Simulasi
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="w-full py-16 sm:py-24 bg-white/[0.02] border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: "RESTful API",
                desc: "Akses data hasil simulasi, autentikasi SSO, dan sinkronisasi data kelas secara real-time via REST API.",
                color: "text-blue-400",
                bg: "bg-blue-500/10",
                border: "border-blue-500/20"
              },
              {
                icon: <Puzzle className="w-6 h-6" />,
                title: "Plugin LMS",
                desc: "Integrasi out-of-the-box untuk Moodle, Canvas, dan Google Classroom dengan standar LTI 1.3.",
                color: "text-purple-400",
                bg: "bg-purple-500/10",
                border: "border-purple-500/20"
              },
              {
                icon: <Layers className="w-6 h-6" />,
                title: "Panduan Simulasi",
                desc: "Tutorial step-by-step membuat modul simulasi baru dengan React, Canvas, dan TypeScript — dari setup hingga Pull Request.",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/20"
              },
              {
                icon: <Plug className="w-6 h-6" />,
                title: "Webhooks",
                desc: "Dengarkan event simulasi secara real-time. Pemicu instan saat siswa menyelesaikan tugas atau meraih pencapaian.",
                color: "text-amber-400",
                bg: "bg-amber-500/10",
                border: "border-amber-500/20"
              },
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: "Open Source",
                desc: "Arshaka Edu dibangun dengan prinsip terbuka. Pelajari, modifikasi, dan kontribusi ke repositori utama kami.",
                color: "text-rose-400",
                bg: "bg-rose-500/10",
                border: "border-rose-500/20"
              },
              {
                icon: <Terminal className="w-6 h-6" />,
                title: "CLI Tools",
                desc: "Alat baris perintah (CLI) untuk menginisiasi proyek simulasi baru dengan template bawaan dalam hitungan detik.",
                color: "text-cyan-400",
                bg: "bg-cyan-500/10",
                border: "border-cyan-500/20"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group p-6 sm:p-8 rounded-2xl bg-zinc-900/50 border border-white/[0.06] hover:border-white/[0.15] hover:bg-zinc-900 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl mb-5 flex items-center justify-center border ${feature.bg} ${feature.border} ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2.5">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BOTTOM ── */}
      <section className="w-full py-16 sm:py-24 border-t border-white/[0.06] bg-black/40">
        <div className="max-w-3xl mx-auto px-5 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Siap Mengembangkan Sesuatu?
          </h2>
          <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xl mx-auto">
            Bergabunglah dengan komunitas pengembang kami di GitHub atau pelajari dokumentasi untuk mulai membangun integrasi pendidikan masa depan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button className="h-11 px-6 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-200 transition-colors">
              Mulai Coding <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <Link
              href="https://github.com/HaqiKuy470/Arshaka_Edu"
              target="_blank"
              className="h-11 px-6 rounded-lg bg-zinc-800 text-white border border-zinc-700 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-700 transition-colors"
            >
              Lihat Repositori
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
