import Link from 'next/link';
import { ArrowLeft, Heart, Sparkles, ShieldCheck, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Donasi | Arshaka Edu',
  description: 'Dukung Arshaka Edu untuk menyediakan media simulasi pendidikan gratis selamanya bagi jutaan anak bangsa.',
};

export default function DonasiPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative py-20 px-4 md:py-32">
      {/* Background blobs */}
      <div className="absolute top-[10%] left-[10%] w-[35%] h-[35%] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[35%] h-[35%] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none" />

      <div className="w-full max-w-4xl z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-xs uppercase tracking-widest">Kembali ke Beranda</span>
        </Link>

        {/* Hero Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            Dukung Pendidikan Gratis Selamanya
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            Investasi untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Masa Depan</span> Sains Indonesia
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium">
            Arshaka Edu adalah platform nirlaba terbuka. Dukungan Anda membantu kami membiayai server database, dan mengembangkan simulasi sains baru untuk jutaan murid & guru secara gratis.
          </p>
        </div>

        {/* Main Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          
          {/* QRIS Card */}
          <div className="glass-card rounded-[32px] p-6 md:p-8 border border-white/10 shadow-2xl relative group overflow-hidden flex flex-col items-center">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-purple-500/5 pointer-events-none" />
            
            {/* Glossy Border Aura */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-50" />

            <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Pindai / Scan QRIS
            </span>

            {/* QR Code Container */}
            <div className="relative bg-white p-4 rounded-3xl shadow-2xl max-w-[280px] w-full aspect-square flex items-center justify-center border border-zinc-200">
              <img 
                src="/qris.jpeg" 
                alt="Arshaka Edu QRIS Donation" 
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>

            <div className="text-center mt-6 space-y-2">
              <p className="font-black text-sm text-zinc-300">ARSHAKA EDU SUPPORT</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">GPN • QRIS • Seluruh Dompet Digital</p>
            </div>
          </div>

          {/* Guide Card */}
          <div className="space-y-6 md:space-y-8">
            <div className="glass-card rounded-[28px] p-6 border border-white/5 space-y-6">
              <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                Cara Berdonasi
              </h3>

              <ol className="space-y-4 text-sm font-medium text-zinc-400">
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black shrink-0">1</span>
                  <span>Buka aplikasi dompet digital pilihanmu (GoPay, OVO, Dana, LinkAja) atau Mobile Banking (BCA Mobile, Livin, dll).</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black shrink-0">2</span>
                  <span>Pilih opsi **Scan / QRIS Pay** pada aplikasi keuanganmu.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black shrink-0">3</span>
                  <span>Arahkan kamera ke **QR Code** di samping atau unggah screenshot QRIS ini.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black shrink-0">4</span>
                  <span>Masukkan jumlah dukungan nominal yang ingin kamu dedikasikan, lalu selesaikan transaksi.</span>
                </li>
              </ol>
            </div>

            {/* Transparency Trust Badge */}
            <div className="glass-card rounded-[24px] p-5 border border-white/5 flex gap-4 items-start">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">Keamanan &amp; Transparansi</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                  100% donasi dialokasikan langsung untuk biaya infrastruktur database server, pemeliharaan domain, dan penelitian modul interaktif sains gratis untuk semua jenjang sekolah.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
