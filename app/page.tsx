"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Play, 
  Beaker, 
  Calculator, 
  Globe, 
  BookOpen, 
  Zap, 
  Dna, 
  Telescope,
  Sparkles,
  Cpu,
  Atom,
  ChevronRight,
  ShieldCheck,
  Users,
  Layers,
  GraduationCap,
  Presentation,
  Puzzle
} from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = [
  { name: "Fisika", icon: <Atom className="w-5 h-5 md:w-6 md:h-6" />, color: "from-blue-600 to-cyan-400", slug: "fisika", count: 12 },
  { name: "Kimia", icon: <Beaker className="w-5 h-5 md:w-6 md:h-6" />, color: "from-purple-600 to-pink-500", slug: "kimia", count: 8 },
  { name: "Matematika", icon: <Calculator className="w-5 h-5 md:w-6 md:h-6" />, color: "from-emerald-600 to-teal-400", slug: "matematika", count: 15 },
  { name: "Biologi", icon: <Dna className="w-5 h-5 md:w-6 md:h-6" />, color: "from-green-600 to-lime-400", slug: "biologi", count: 10 },
  { name: "Ilmu Bumi", icon: <Globe className="w-5 h-5 md:w-6 md:h-6" />, color: "from-amber-600 to-orange-400", slug: "bumi", count: 7 },
  { name: "Astronomi", icon: <Telescope className="w-5 h-5 md:w-6 md:h-6" />, color: "from-indigo-600 to-blue-500", slug: "astronomi", count: 6 },
  { name: "Teknologi", icon: <Cpu className="w-5 h-5 md:w-6 md:h-6" />, color: "from-rose-600 to-red-400", slug: "teknologi", count: 5 },
  { name: "Seni", icon: <Layers className="w-5 h-5 md:w-6 md:h-6" />, color: "from-fuchsia-600 to-purple-400", slug: "seni", count: 4 },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full relative overflow-hidden bg-[#050505]">
      
      {/* ── Hero Section ── */}
      <section className="relative w-full pt-32 pb-16 sm:pt-40 sm:pb-20 md:pt-52 md:pb-32 flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden">
        
        {/* Background Auras */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
           <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] bg-indigo-600/10 blur-[120px] rounded-full" />
           <div className="absolute bottom-0 right-[-20%] w-[60%] h-[60%] bg-purple-600/10 blur-[120px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 space-y-6 md:space-y-8 w-full max-w-5xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-indigo-300">
            <Sparkles className="w-3 h-3" />
            Platform Edukasi Terbuka &amp; Gratis
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9] px-2">
            BELAJAR SAINS <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">TANPA BATAS</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-xl text-zinc-500 max-w-xl md:max-w-2xl mx-auto leading-relaxed font-medium px-4 sm:px-0">
            Jelajahi dunia melalui simulasi interaktif yang mendalam. Arshaka Edu mendefinisikan ulang cara kita memahami konsep abstrak dengan visualisasi modern.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-4 md:pt-8 px-4 sm:px-0">
            <Link href="/simulasi" className="group relative w-full sm:w-auto h-12 md:h-16 px-6 md:px-10 rounded-xl md:rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-600/30 overflow-hidden">
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <Play className="w-4 h-4 fill-current relative z-10" />
              <span className="relative z-10">Mulai Eksplorasi</span>
            </Link>
            <Link href="/tentang" className="w-full sm:w-auto h-12 md:h-16 px-6 md:px-10 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95">
              Pelajari Visi Kami
              <ArrowRight className="w-4 h-4 text-zinc-500" />
            </Link>
          </div>
        </motion.div>

        {/* Floating Lab Mockup — hide on small mobile, show tablet+ */}
        <div className="relative mt-12 sm:mt-16 md:mt-24 w-full max-w-6xl aspect-video bg-zinc-900/40 rounded-[24px] sm:rounded-[36px] md:rounded-[48px] border border-white/5 shadow-2xl overflow-hidden backdrop-blur-md hidden sm:block">
           <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
           <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none opacity-20">
              {Array.from({ length: 72 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-white/5" />
              ))}
           </div>
           <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <div className="w-48 h-48 md:w-96 md:h-96 bg-indigo-500/20 blur-[80px] rounded-full" />
           </div>
           <div className="absolute top-4 sm:top-10 left-4 sm:left-10 right-4 sm:right-10 flex justify-between items-start">
              <div className="space-y-2">
                 <div className="h-3 sm:h-4 w-20 sm:w-32 bg-white/10 rounded-full" />
                 <div className="h-6 sm:h-8 w-40 sm:w-64 bg-white/5 rounded-xl sm:rounded-2xl" />
              </div>
              <div className="flex gap-2">
                 <div className="h-8 sm:h-10 w-8 sm:w-10 bg-white/10 rounded-lg sm:rounded-xl" />
                 <div className="h-8 sm:h-10 w-8 sm:w-10 bg-white/10 rounded-lg sm:rounded-xl" />
              </div>
           </div>
           <div className="absolute inset-x-4 sm:inset-x-20 bottom-0 top-20 sm:top-32 bg-zinc-950/60 border-x border-t border-white/10 rounded-t-[20px] sm:rounded-t-[32px] flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                 <Atom className="w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 text-indigo-400 opacity-50" />
                 <div className="absolute inset-0 blur-2xl bg-indigo-500/20" />
              </motion.div>
           </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-y border-white/5 bg-zinc-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-center">
            {[
              { label: "Simulasi Aktif", value: "150+", icon: <Layers className="w-4 h-4 text-indigo-400" /> },
              { label: "Siswa Belajar", value: "50K+", icon: <Users className="w-4 h-4 text-purple-400" /> },
              { label: "Open Source", value: "100%", icon: <Code2 className="w-4 h-4 text-emerald-400" /> },
              { label: "Mata Pelajaran", value: "12+", icon: <BookOpen className="w-4 h-4 text-amber-400" /> },
            ].map((stat, i) => (
              <div key={i} className="space-y-1 md:space-y-2">
                <div className="flex items-center justify-center gap-1 md:gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  {stat.icon}
                  <span className="hidden sm:inline">{stat.label}</span>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter">{stat.value}</div>
                <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest sm:hidden">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories Grid ── */}
      <section className="w-full py-16 sm:py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10 md:mb-20">
            <div className="space-y-3 md:space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white">EKSPLORASI DUNIA</h2>
              <p className="text-zinc-500 max-w-xl font-medium text-sm md:text-base">Pilih gerbang menuju pengetahuan. Setiap simulasi dirancang untuk mengubah cara Anda melihat realitas.</p>
            </div>
            <Link href="/simulasi" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all group shrink-0">
              Lihat Semua
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {CATEGORIES.map((category) => (
              <Link 
                key={category.slug} 
                href="/simulasi"
                className="group relative h-48 sm:h-56 md:h-72 lg:h-80 rounded-[24px] sm:rounded-[32px] md:rounded-[40px] bg-zinc-900/50 border border-white/5 hover:border-indigo-500/30 transition-all duration-500 overflow-hidden p-5 sm:p-6 md:p-10 flex flex-col justify-between"
              >
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="space-y-2 md:space-y-4 relative z-10">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center bg-gradient-to-br ${category.color} text-white shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-black text-white uppercase tracking-tight">{category.name}</h3>
                    <p className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{category.count} Simulasi</p>
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between">
                   <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                      <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-white" />
                   </div>
                   <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 hidden sm:block">
                      Buka Lab
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Showcase ── */}
      <section className="w-full py-16 sm:py-24 md:py-32 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 md:space-y-4 mb-10 md:mb-20">
             <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
               <ShieldCheck className="w-3 h-3" />
               Simulasi Unggulan
             </div>
             <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">Sains Populer</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10">
            {[
              { title: "Gelombang Suara", cat: "Fisika", desc: "Visualisasi osilasi udara dan bagaimana frekuensi menciptakan nada.", color: "bg-blue-600" },
              { title: "Struktur Atom", cat: "Kimia", desc: "Jelajahi inti atom dan awan elektron dalam skala sub-atomik.", color: "bg-purple-600" },
              { title: "Tata Surya 3D", cat: "Astronomi", desc: "Perjalanan melintasi kosmos dan pahami hukum Kepler secara visual.", color: "bg-indigo-600" }
            ].map((sim, i) => (
              <div key={i} className="group relative bg-zinc-900 rounded-[28px] sm:rounded-[36px] md:rounded-[48px] overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-1 md:hover:-translate-y-2">
                <div className="h-40 sm:h-48 md:h-64 relative overflow-hidden bg-black">
                  <div className={`absolute inset-0 opacity-20 ${sim.color} group-hover:opacity-40 transition-opacity`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-500 shadow-2xl">
                      <Play className="w-5 h-5 md:w-6 md:h-6 text-white ml-1 fill-current" />
                    </div>
                  </div>
                </div>
                <div className="p-5 sm:p-6 md:p-10 space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{sim.cat}</span>
                     <span className="flex items-center gap-1 text-[9px] font-bold text-zinc-500 uppercase">
                        <Users className="w-3 h-3" /> 1.2K
                     </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-none">{sim.title}</h3>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed">{sim.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform Features (Ekosistem Belajar) ── */}
      <section className="w-full py-16 sm:py-24 md:py-32 relative z-10 bg-black/40 border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 md:space-y-4 mb-16 md:mb-24">
             <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
               <Zap className="w-3 h-3" />
               Ekosistem Belajar
             </div>
             <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">Solusi Pembelajaran Interaktif</h2>
             <p className="text-zinc-500 max-w-xl mx-auto font-medium text-sm md:text-base">
               Arshaka Edu dirancang khusus untuk mendukung kolaborasi dan kemajuan di setiap jenjang pendidikan.
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
            {/* Untuk Siswa */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="group relative rounded-[32px] bg-zinc-900/40 border border-white/5 hover:border-indigo-500/20 p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-500" />
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Untuk Siswa</h3>
                  <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mt-1">Eksplorasi & Gamifikasi</p>
                </div>
                <ul className="space-y-4 text-zinc-400 text-sm font-medium">
                  <li className="flex items-start gap-3">
                    <span className="text-base">🎮</span>
                    <span>Simulasi interaktif dengan kontrol real-time yang responsif</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-base">📝</span>
                    <span>Lembar kerja digital terintegrasi untuk latihan praktis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-base">📈</span>
                    <span>Rekam hasil eksperimen otomatis <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full ml-1 whitespace-nowrap">Butuh Akun</span></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-base">🏆</span>
                    <span>Gamifikasi interaktif (poin, badge, level belajar) <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full ml-1 whitespace-nowrap">Butuh Akun</span></span>
                  </li>
                </ul>
              </div>
              <div className="pt-8 border-t border-white/5 mt-8 flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Siap Belajar?</span>
                <Link href="/login" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors group/btn">
                  Mulai Sekarang
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Untuk Guru */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="group relative rounded-[32px] bg-zinc-900/40 border border-white/5 hover:border-purple-500/20 p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-purple-500/10 transition-colors duration-500" />
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-500">
                  <Presentation className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Untuk Guru</h3>
                  <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mt-1">Manajemen & Evaluasi</p>
                </div>
                <ul className="space-y-4 text-zinc-400 text-sm font-medium">
                  <li className="flex items-start gap-3">
                    <span className="text-base">📋</span>
                    <span>Buat kelas virtual dan pantau progres belajar siswa secara real-time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-base">📌</span>
                    <span>Tambahkan modul simulasi interaktif ke dalam tugas belajar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-base">🗒️</span>
                    <span>Panduan mengajar lengkap untuk setiap simulasi yang tersedia</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-base">📊</span>
                    <span>Dashboard laporan analitis perkembangan kelas &amp; individu</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8 border-t border-white/5 mt-8 flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Portal Guru</span>
                <Link href="/login" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-purple-400 hover:text-white transition-colors group/btn">
                  Akses Portal
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Untuk Pengembang */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="group relative rounded-[32px] bg-zinc-900/40 border border-white/5 hover:border-emerald-500/20 p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-500" />
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-500">
                  <Puzzle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Untuk Pengembang</h3>
                  <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mt-1">Integrasi &amp; Ekstensi</p>
                </div>
                <ul className="space-y-4 text-zinc-400 text-sm font-medium">
                  <li className="flex items-start gap-3">
                    <span className="text-base">🔌</span>
                    <span>API terbuka untuk integrasi penuh dengan LMS internal sekolah</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-base">🧩</span>
                    <span>Plugin pendukung Google Classroom &amp; Moodle siap pakai</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-base">🛠️</span>
                    <span>Dokumentasi teknis lengkap dan SDK simulasi interaktif</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8 border-t border-white/5 mt-8 flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Developer Hub</span>
                <Link href="/login" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400 hover:text-white transition-colors group/btn">
                  Buka Docs
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}

function Code2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24" height="24"
      viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="m18 16 4-4-4-4" />
      <path d="m6 8-4 4 4 4" />
      <path d="m14.5 4-5 16" />
    </svg>
  );
}
