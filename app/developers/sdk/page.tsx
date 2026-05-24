"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Layers, Terminal, Copy, Check,
  Code, FolderOpen, GitBranch, Palette, Zap, BookOpen, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative rounded-xl overflow-hidden border border-white/[0.08] my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/80 border-b border-white/[0.06]">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{lang}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? "Disalin!" : "Salin"}
        </button>
      </div>
      <pre className="bg-zinc-900/90 px-5 py-4 text-xs text-zinc-300 overflow-x-auto leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Step({ num, icon, title, children }: { num: string; icon: React.ReactNode; title: string; id?: string; children: React.ReactNode }) {
  return (
    <div className="relative flex gap-5 sm:gap-6">
      {/* Line connector */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          {icon}
        </div>
        <div className="w-px flex-1 bg-white/[0.06] mt-3" />
      </div>
      <div className="pb-10 flex-1 min-w-0">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md tracking-widest">
            {num}
          </span>
          <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">{title}</h3>
        </div>
        <div className="text-zinc-400 text-sm leading-relaxed font-medium space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { id: "persiapan", label: "Persiapan" },
  { id: "struktur-file", label: "Struktur File" },
  { id: "buat-komponen", label: "Buat Komponen" },
  { id: "standar-kode", label: "Standar Kode" },
  { id: "daftarkan", label: "Daftarkan Simulasi" },
  { id: "submit", label: "Submit PR" },
];

export default function SDKPage() {
  const [activeSection, setActiveSection] = useState("persiapan");

  return (
    <div className="flex flex-col w-full bg-[#060608] min-h-screen text-white">
      {/* Aura */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-teal-700/7 blur-[160px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full px-5 sm:px-6 pt-24 pb-20 flex gap-10">

        {/* ── SIDEBAR ── */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 sticky top-24 self-start gap-1">
          <Link
            href="/developers"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Developer Hub</span>
          </Link>

          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-3">Isi Panduan</p>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeSection === item.id
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <ChevronRight className="w-3 h-3 shrink-0" />
              {item.label}
            </a>
          ))}

          <div className="mt-6 p-3 rounded-xl bg-zinc-900/50 border border-white/[0.07] space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Tautan Cepat</p>
            <Link
              href="https://github.com/HaqiKuy470/Arshaka_Edu"
              target="_blank"
              className="flex items-center gap-1.5 text-[10px] text-teal-400 hover:text-white transition-colors font-semibold"
            >
              <Code className="w-3 h-3" /> GitHub Repo
            </Link>
            <Link
              href="/developers/docs"
              className="flex items-center gap-1.5 text-[10px] text-teal-400 hover:text-white transition-colors font-semibold"
            >
              <BookOpen className="w-3 h-3" /> Baca Docs Penuh
            </Link>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 min-w-0 space-y-14"
        >
          {/* Mobile back */}
          <Link
            href="/developers"
            className="inline-flex lg:hidden items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Developer Hub</span>
          </Link>

          {/* Page header */}
          <div className="space-y-3 pb-8 border-b border-white/[0.06]">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/10 rounded-full border border-teal-500/20 text-teal-400 text-[10px] font-black uppercase tracking-[0.18em]">
              <Layers className="w-3 h-3" /> Panduan Kontribusi Simulasi
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight uppercase">
              Buat Simulasi Baru
            </h1>
            <p className="text-zinc-500 text-sm font-medium max-w-xl">
              Panduan lengkap membuat modul simulasi interaktif baru dan menambahkannya ke katalog Arshaka Edu — mulai dari setup hingga Pull Request.
            </p>
          </div>

          {/* ── STEPS ── */}
          <div className="space-y-0">

            {/* STEP 1 */}
            <Step num="01" icon={<Terminal className="w-4 h-4" />} title="Persiapan Lingkungan" id="persiapan">
              <div id="persiapan">
                <p>Fork dan kloning repositori, lalu instal dependensi:</p>
                <CodeBlock lang="bash" code={`git clone https://github.com/USERNAME-ANDA/Arshaka_Edu.git\ncd Arshaka_Edu\nnpm install\nnpm run dev`} />
                <p>Buat branch baru yang deskriptif sebelum menulis kode:</p>
                <CodeBlock lang="bash" code={`git checkout -b feature/simulasi-[nama-topik]\n# contoh:\ngit checkout -b feature/simulasi-hukum-hooke`} />
              </div>
            </Step>

            {/* STEP 2 */}
            <Step num="02" icon={<FolderOpen className="w-4 h-4" />} title="Struktur File" id="struktur-file">
              <div id="struktur-file">
                <p>Letakkan file simulasi baru di dalam folder kategori yang sesuai:</p>
                <CodeBlock lang="text" code={`app/\n└── simulasi/\n    └── [slug]/\n        └── page.tsx          ← halaman wrapper\n\nsimulations/                   ← logika simulasi utama\n└── [kategori]/\n    └── NamaSimulasi.tsx       ← komponen interaktif`} />
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-300/80 text-xs">
                  💡 Slug harus cocok dengan ID yang didaftarkan di <code className="text-amber-300">app/simulasi/page.tsx</code> — gunakan huruf kecil dengan tanda hubung, contoh: <code className="text-amber-300">hukum-hooke</code>
                </div>
              </div>
            </Step>

            {/* STEP 3 */}
            <Step num="03" icon={<Code className="w-4 h-4" />} title="Buat Komponen Simulasi" id="buat-komponen">
              <div id="buat-komponen">
                <p>Gunakan template berikut sebagai titik awal komponen simulasi:</p>
                <CodeBlock lang="tsx" code={`"use client";\nimport React, { useRef, useEffect, useState } from "react";\n\nexport default function NamaSimulasi() {\n  const canvasRef = useRef<HTMLCanvasElement>(null);\n  const [playing, setPlaying] = useState(false);\n\n  useEffect(() => {\n    const canvas = canvasRef.current;\n    if (!canvas) return;\n    const ctx = canvas.getContext("2d")!;\n    let animId: number;\n\n    const draw = () => {\n      ctx.clearRect(0, 0, canvas.width, canvas.height);\n      // ✏️ Tulis logika render di sini\n      animId = requestAnimationFrame(draw);\n    };\n\n    if (playing) draw();\n    return () => cancelAnimationFrame(animId);\n  }, [playing]);\n\n  return (\n    <div className="flex flex-col items-center gap-4 p-6">\n      <canvas\n        ref={canvasRef}\n        width={800}\n        height={500}\n        className="w-full rounded-2xl bg-zinc-950 border border-white/10"\n      />\n      <button\n        onClick={() => setPlaying(p => !p)}\n        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors"\n      >\n        {playing ? "Pause" : "Mulai"}\n      </button>\n    </div>\n  );\n}`} />
                <p>Untuk simulasi dengan grafis berat, selalu gunakan <code className="text-teal-400 bg-white/5 px-1.5 py-0.5 rounded text-xs">&lt;canvas&gt;</code> dan <code className="text-teal-400 bg-white/5 px-1.5 py-0.5 rounded text-xs">requestAnimationFrame</code> agar tidak memblokir thread utama.</p>
              </div>
            </Step>

            {/* STEP 4 */}
            <Step num="04" icon={<Palette className="w-4 h-4" />} title="Standar Kode & Estetika" id="standar-kode">
              <div id="standar-kode" className="space-y-3">
                {[
                  { badge: "Wajib", title: "TypeScript", desc: "Semua file komponen harus .tsx atau .ts. Hindari any — gunakan tipe eksplisit." },
                  { badge: "Wajib", title: "Dark Mode", desc: "Desain simulasi harus nyaman di latar gelap (#060608) — warna teks minimal text-zinc-300." },
                  { badge: "Dianjurkan", title: "Tailwind CSS", desc: "Gunakan kelas Tailwind untuk layout dan kontrol UI. Hindari inline style sebisa mungkin." },
                  { badge: "Dianjurkan", title: "Kontrol Interaktif", desc: "Sediakan slider, tombol, atau input agar pengguna bisa mengubah parameter simulasi secara real-time." },
                  { badge: "Opsional", title: "Animasi Framer Motion", desc: "Gunakan motion.div untuk transisi halaman masuk/keluar agar konsisten dengan desain platform." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/50 border border-white/[0.06]">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-white">{item.title}</span>
                        <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                          item.badge === "Wajib"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : item.badge === "Dianjurkan"
                            ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                            : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                        }`}>{item.badge}</span>
                      </div>
                      <p className="text-xs text-zinc-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Step>

            {/* STEP 5 */}
            <Step num="05" icon={<Zap className="w-4 h-4" />} title="Daftarkan Simulasi ke Katalog" id="daftarkan">
              <div id="daftarkan">
                <p>
                  Buka <code className="text-teal-400 bg-white/5 px-1.5 py-0.5 rounded text-xs">app/simulasi/page.tsx</code> dan tambahkan entri baru ke dalam array <code className="text-teal-400 bg-white/5 px-1.5 py-0.5 rounded text-xs">SIMULATIONS</code>:
                </p>
                <CodeBlock lang="tsx" code={`// Di dalam array SIMULATIONS di app/simulasi/page.tsx\n{ id: "hukum-hooke", title: "Pegas & Hukum Hooke", cat: "Fisika", color: "from-sky-600 to-blue-400" },`} />
                <p>Lalu buat halaman wrapper di <code className="text-teal-400 bg-white/5 px-1.5 py-0.5 rounded text-xs">app/simulasi/hukum-hooke/page.tsx</code> yang mengimpor komponen simulasi Anda:</p>
                <CodeBlock lang="tsx" code={`import HukumHooke from "@/simulations/fisika/HukumHooke";\n\nexport const metadata = {\n  title: "Pegas & Hukum Hooke | Arshaka Edu",\n  description: "Simulasi regangan pegas dan konstanta pegas",\n};\n\nexport default function Page() {\n  return <HukumHooke />;\n}`} />
              </div>
            </Step>

            {/* STEP 6 */}
            <Step num="06" icon={<GitBranch className="w-4 h-4" />} title="Commit & Submit Pull Request" id="submit">
              <div id="submit">
                <p>Tulis pesan commit yang jelas:</p>
                <CodeBlock lang="bash" code={`git add .\ngit commit -m "feat: tambah simulasi pegas dan hukum hooke"\ngit push origin feature/simulasi-hukum-hooke`} />
                <p>Buka GitHub dan ajukan Pull Request ke branch <code className="text-teal-400 bg-white/5 px-1.5 py-0.5 rounded text-xs">main</code>. Sertakan:</p>
                <ul className="space-y-1.5 pl-1">
                  {[
                    "Screenshot atau rekaman simulasi yang sudah berjalan",
                    "Penjelasan singkat logika fisika/kimia/matematika yang diimplementasikan",
                    "Daftar kontrol interaktif yang tersedia untuk pengguna",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <span className="text-teal-400 shrink-0 mt-0.5">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex mt-4">
                  <Link
                    href="https://github.com/HaqiKuy470/Arshaka_Edu/pulls"
                    target="_blank"
                    className="inline-flex items-center gap-2 h-9 px-5 rounded-lg bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-colors"
                  >
                    Buat Pull Request <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </Step>

          </div>

          {/* CTA Bottom */}
          <div className="rounded-2xl p-8 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent border border-teal-500/20 text-center space-y-4 mt-4">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Ada Pertanyaan?</h2>
            <p className="text-zinc-500 text-sm max-w-md mx-auto">
              Buka Issues di GitHub atau baca panduan kontribusi lengkap untuk detail lebih lanjut.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <Link
                href="/developers/docs"
                className="h-10 px-5 rounded-xl bg-teal-600 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-teal-500 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" /> Baca Dokumentasi
              </Link>
              <Link
                href="https://github.com/HaqiKuy470/Arshaka_Edu/issues"
                target="_blank"
                className="h-10 px-5 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-700 transition-colors"
              >
                <Code className="w-3.5 h-3.5" /> Buka Issue di GitHub
              </Link>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
