import Link from 'next/link';
import { ArrowLeft, Heart, Sparkles, ShieldCheck, HelpCircle, Zap, Users, Server } from 'lucide-react';

export const metadata = {
  title: 'Donasi | Arshaka Edu',
  description: 'Dukung Arshaka Edu untuk menyediakan media simulasi pendidikan gratis selamanya bagi jutaan anak bangsa.',
};

const STEPS = [
  { n: 1, text: "Buka aplikasi dompet digital (GoPay, OVO, Dana, LinkAja) atau Mobile Banking (BCA Mobile, Livin, dll)." },
  { n: 2, text: "Pilih opsi Scan / QRIS Pay pada aplikasi keuanganmu." },
  { n: 3, text: "Arahkan kamera ke QR Code di atas atau unggah screenshot QRIS ini dari galeri." },
  { n: 4, text: "Masukkan nominal dukungan yang ingin kamu dedikasikan, lalu selesaikan transaksi." },
];

const ALLOCATIONS = [
  { icon: <Server className="w-4 h-4" />, label: "Infrastruktur Server", pct: "60%" },
  { icon: <Zap className="w-4 h-4" />, label: "Modul Simulasi Baru", pct: "30%" },
  { icon: <Users className="w-4 h-4" />, label: "Operasional & Domain", pct: "10%" },
];

export default function DonasiPage() {
  return (
    <div className="min-h-screen bg-[#060608] text-white flex flex-col">
      <div className="relative flex-1 flex flex-col items-center px-5 sm:px-6 pt-28 sm:pt-32 pb-20">

        {/* Ambient auras */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-indigo-700/8 blur-[150px] rounded-full" />
          <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-purple-700/8 blur-[150px] rounded-full" />
        </div>

        <div className="relative z-10 w-full max-w-4xl">

          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-10 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-bold text-[10px] uppercase tracking-widest">Kembali ke Beranda</span>
          </Link>

          {/* ── Hero ── */}
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-500/10 rounded-full border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-[0.18em]">
              <Heart className="w-3 h-3 fill-rose-500 animate-pulse" />
              Dukung Pendidikan Gratis Selamanya
            </span>

            <h1 className="text-[clamp(1.8rem,6vw,3.5rem)] font-black tracking-tighter leading-[1.05] text-white">
              Investasi untuk{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Masa Depan
              </span>{" "}
              Pelajar Indonesia
            </h1>

            <p className="text-zinc-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-medium">
              Arshaka Edu adalah platform nirlaba terbuka. Dukungan Anda membantu membiayai server, dan mengembangkan simulasi sains baru untuk jutaan murid dan guru secara gratis.
            </p>
          </div>

          {/* ── Main Content ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">

            {/* QRIS Card */}
            <div className="relative flex flex-col items-center bg-zinc-900/50 rounded-2xl sm:rounded-[28px] border border-white/[0.08] p-6 sm:p-8 overflow-hidden">
              {/* Top accent line */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                Pindai / Scan QRIS
              </span>

              {/* QR container */}
              <div className="relative w-full max-w-[260px] aspect-square bg-white rounded-2xl p-3.5 shadow-2xl border border-zinc-200/50">
                <img
                  src="/qris.jpeg"
                  alt="Arshaka Edu QRIS Donation"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              <div className="text-center mt-6 space-y-1.5">
                <p className="font-black text-sm text-zinc-200 tracking-tight">ARSHAKA EDU SUPPORT</p>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">GPN • QRIS • Semua Dompet Digital</p>
              </div>

              {/* Wallet logos hint */}
              <div className="flex gap-2 mt-4 flex-wrap justify-center">
                {["GoPay", "OVO", "Dana", "LinkAja", "BCA"].map((w) => (
                  <span
                    key={w}
                    className="px-2.5 py-1 bg-white/5 rounded-lg border border-white/[0.06] text-[9px] font-black uppercase tracking-widest text-zinc-600"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4 sm:space-y-5">

              {/* How to donate */}
              <div className="bg-zinc-900/50 rounded-2xl border border-white/[0.08] p-5 sm:p-6 space-y-5">
                <h3 className="flex items-center gap-2.5 text-xs font-black text-white uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                  Cara Berdonasi
                </h3>

                <ol className="space-y-4">
                  {STEPS.map((s) => (
                    <li key={s.n} className="flex gap-3 items-start">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-[10px] font-black shrink-0 mt-0.5">
                        {s.n}
                      </span>
                      <span className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed">{s.text}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Transparency */}
              <div className="bg-zinc-900/50 rounded-2xl border border-white/[0.08] p-5 sm:p-6 space-y-4">
                <h4 className="flex items-center gap-2.5 text-xs font-black text-white uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  Transparansi Penggunaan Dana
                </h4>

                <div className="space-y-3">
                  {ALLOCATIONS.map((a) => (
                    <div key={a.label} className="flex items-center gap-3">
                      <span className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0">{a.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-zinc-300">{a.label}</span>
                          <span className="text-[11px] font-black text-emerald-400">{a.pct}</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                            style={{ width: a.pct }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-zinc-600 leading-relaxed font-medium pt-1 border-t border-white/[0.05]">
                  100% donasi dialokasikan langsung untuk infrastruktur, pemeliharaan domain, dan riset modul interaktif gratis untuk semua jenjang.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}