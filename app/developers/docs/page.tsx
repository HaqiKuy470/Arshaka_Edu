"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, BookOpen, Terminal, GitBranch, GitMerge,
  Code, Layers, Shield, ChevronRight, Copy, Check
} from "lucide-react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { id: "pengantar", label: "Pengantar" },
  { id: "cara-berkontribusi", label: "Cara Berkontribusi" },
  { id: "workflow", label: "Alur Kerja" },
  { id: "standar-kode", label: "Standar Kode" },
  { id: "pull-request", label: "Pull Request" },
  { id: "aturan-komunitas", label: "Aturan Komunitas" },
];

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-white/[0.08]">
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

function Section({ id, icon, title, children }: { id: string; icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          {icon}
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">{title}</h2>
      </div>
      <div className="text-zinc-400 text-sm leading-relaxed font-medium space-y-4">
        {children}
      </div>
    </section>
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("pengantar");

  return (
    <div className="flex flex-col w-full bg-[#060608] min-h-screen text-white">
      {/* Aura */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-700/6 blur-[160px] rounded-full" />
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

          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-3">Navigasi Docs</p>

          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeSection === item.id
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
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
              className="flex items-center gap-1.5 text-[10px] text-emerald-400 hover:text-white transition-colors font-semibold"
            >
              <Code className="w-3 h-3" /> GitHub Repo
            </Link>
            <Link
              href="/developers/sdk"
              className="flex items-center gap-1.5 text-[10px] text-emerald-400 hover:text-white transition-colors font-semibold"
            >
              <Layers className="w-3 h-3" /> Jelajahi SDK
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
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.18em]">
              <BookOpen className="w-3 h-3" /> Dokumentasi
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight uppercase">
              Panduan Kontribusi
            </h1>
            <p className="text-zinc-500 text-sm font-medium max-w-xl">
              Pelajari cara berkontribusi ke Arshaka Edu — mulai dari setup lokal, standar kode, hingga mengajukan Pull Request.
            </p>
          </div>

          {/* SECTIONS */}
          <Section id="pengantar" icon={<BookOpen className="w-4 h-4" />} title="Pengantar">
            <p>
              Terima kasih telah meluangkan waktu untuk berkontribusi di <strong className="text-white">Arshaka Edu</strong>!
              Kami menyambut pengembang, desainer, guru, dan penggiat pendidikan yang ingin bersama-sama mendemokratisasikan
              pendidikan sains interaktif berkualitas di Indonesia.
            </p>
            <p>
              Dengan berkontribusi, Anda turut membantu jutaan anak bangsa memahami konsep sains yang abstrak secara visual dan menyenangkan!
            </p>
          </Section>

          <div className="border-t border-white/[0.05]" />

          <Section id="cara-berkontribusi" icon={<GitBranch className="w-4 h-4" />} title="Cara Berkontribusi">
            <p>Kami menyambut kontribusi dalam berbagai bentuk:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {[
                { e: "🎮", title: "Simulasi Baru", desc: "Rancang modul simulasi interaktif baru menggunakan React & Canvas." },
                { e: "🐛", title: "Perbaikan Bug", desc: "Temukan dan perbaiki masalah responsivitas, formula, atau performa." },
                { e: "🎨", title: "Peningkatan UI/UX", desc: "Sempurnakan animasi, palet warna, dan aksesibilitas." },
                { e: "📝", title: "Dokumentasi", desc: "Tambahkan dokumentasi modul atau sempurnakan terjemahan sains." },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-zinc-900/50 border border-white/[0.06] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.e}</span>
                    <span className="text-sm font-black text-white uppercase tracking-tight">{item.title}</span>
                  </div>
                  <p className="text-xs text-zinc-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <div className="border-t border-white/[0.05]" />

          <Section id="workflow" icon={<Terminal className="w-4 h-4" />} title="Alur Kerja Kontribusi">
            <p><strong className="text-white">1. Fork Repositori</strong></p>
            <p>Kunjungi repositori dan klik tombol <strong className="text-white">Fork</strong>:</p>
            <div className="flex">
              <Link
                href="https://github.com/HaqiKuy470/Arshaka_Edu"
                target="_blank"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-white transition-colors text-sm font-semibold underline underline-offset-4"
              >
                github.com/HaqiKuy470/Arshaka_Edu
              </Link>
            </div>

            <p className="mt-2"><strong className="text-white">2. Kloning & Setup Lokal</strong></p>
            <CodeBlock lang="bash" code={`git clone https://github.com/USERNAME-ANDA/Arshaka_Edu.git\ncd Arshaka_Edu`} />
            <CodeBlock lang="bash" code={`npm install`} />
            <CodeBlock lang="bash" code={`npm run dev\n# Buka http://localhost:3000`} />

            <p className="mt-2"><strong className="text-white">3. Buat Branch Baru</strong></p>
            <CodeBlock lang="bash" code={`git checkout -b feature/simulasi-[nama-topik]\n# atau untuk bugfix:\ngit checkout -b bugfix/perbaikan-[deskripsi-bug]`} />

            <p className="mt-2"><strong className="text-white">5. Commit Perubahan</strong></p>
            <CodeBlock lang="bash" code={`git commit -m "feat: menambah simulasi hukum hooke untuk fisika"`} />
          </Section>

          <div className="border-t border-white/[0.05]" />

          <Section id="standar-kode" icon={<Code className="w-4 h-4" />} title="Standar Kode">
            <div className="space-y-4">
              {[
                {
                  title: "TypeScript & React",
                  desc: "Seluruh berkas komponen baru wajib menggunakan TypeScript (.tsx atau .ts).",
                  badge: "Wajib"
                },
                {
                  title: "Struktur File Simulasi",
                  desc: "Letakkan logika simulasi di @/simulations/[kategori]/[NamaSimulasi].tsx, lalu daftarkan di app/simulasi/page.tsx.",
                  badge: "Penting"
                },
                {
                  title: "Tema & Estetika",
                  desc: "Gunakan Tailwind CSS dengan tema variabel HSL dinamis. Pastikan mendukung Dark Mode & Light Mode.",
                  badge: "Standar"
                },
                {
                  title: "Performa",
                  desc: "Gunakan <canvas> dengan requestAnimationFrame secara terisolasi untuk simulasi grafis berat.",
                  badge: "Rekomendasi"
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/50 border border-white/[0.06]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-black text-white">{item.title}</span>
                      <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">{item.badge}</span>
                    </div>
                    <p className="text-xs text-zinc-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <div className="border-t border-white/[0.05]" />

          <Section id="pull-request" icon={<GitMerge className="w-4 h-4" />} title="Push & Pull Request">
            <p>Kirim branch ke fork GitHub Anda, lalu buka Pull Request:</p>
            <CodeBlock lang="bash" code={`git push origin feature/simulasi-[nama-topik]`} />
            <p>
              Buka halaman repositori asli, klik <strong className="text-white">Compare & Pull Request</strong>, dan berikan penjelasan
              detail mengenai perubahan yang Anda lakukan.
            </p>
            <div className="flex mt-2">
              <Link
                href="https://github.com/HaqiKuy470/Arshaka_Edu/pulls"
                target="_blank"
                className="inline-flex items-center gap-2 h-9 px-5 rounded-lg bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-colors"
              >
                Buat Pull Request <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Section>

          <div className="border-t border-white/[0.05]" />

          <Section id="aturan-komunitas" icon={<Shield className="w-4 h-4" />} title="Aturan Komunitas">
            <div className="space-y-3">
              {[
                "Bersikaplah ramah, menghargai masukan, dan bersedia menerima ulasan kode (code review).",
                "Dilarang keras menyalin materi atau kode yang memiliki hak cipta komersial tertutup milik platform lain.",
                "Seluruh karya kontribusi akan dilisensikan di bawah lisensi terbuka Arshaka Edu agar dapat diakses gratis selamanya oleh seluruh siswa Indonesia.",
              ].map((rule, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="text-lg shrink-0">{ ["🤝", "🚫", "🇮🇩"][i] }</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 text-center">
              <p className="text-sm font-black text-white">Terima kasih atas kontribusi Anda.</p>
              <p className="text-xs text-zinc-500 mt-1">Mari bersama-sama memajukan pendidikan Indonesia! 🇮🇩🚀🎓</p>
            </div>
          </Section>
        </motion.main>
      </div>
    </div>
  );
}
