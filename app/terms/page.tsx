import Link from 'next/link';
import { ArrowLeft, BookOpen, Shield, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Syarat & Ketentuan | Arshaka Edu',
  description: 'Syarat dan Ketentuan penggunaan platform simulasi interaktif edukasi Arshaka Edu.',
};

export default function TermsPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative py-20 px-4 md:py-32">
      {/* Decorative Blobs */}
      <div className="absolute top-[10%] left-[10%] w-[35%] h-[35%] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[35%] h-[35%] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none" />

      <div className="w-full max-w-3xl z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-xs uppercase tracking-widest">Kembali ke Beranda</span>
        </Link>

        {/* Content Card */}
        <div className="glass-card rounded-[32px] p-8 md:p-12 border border-white/10 shadow-2xl space-y-8">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              Legalitas Platform
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              Syarat &amp; Ketentuan Penggunaan
            </h1>
            <p className="text-xs text-zinc-500 mt-2 font-bold uppercase tracking-wider">
              Terakhir diperbarui: 19 Mei 2026
            </p>
          </div>

          <div className="prose prose-invert max-w-none text-zinc-400 text-sm leading-relaxed space-y-6 font-medium">
            
            <p>
              Selamat datang di **Arshaka Edu** (selanjutnya disebut "Platform", "Kami"). Platform ini dikembangkan sebagai sarana pembelajaran interaktif nirlaba yang gratis dan dapat diakses oleh semua kalangan. Dengan mengakses atau menggunakan platform kami, Anda ("Pengguna", "Siswa", "Guru") menyetujui untuk terikat secara hukum oleh syarat dan ketentuan penggunaan di bawah ini.
            </p>

            <div className="space-y-3">
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                1. Penggunaan Platform &amp; Lisensi Layanan
              </h2>
              <p className="pl-4">
                Platform simulasi pembelajaran ini disediakan **100% gratis** untuk tujuan akademis, pengajaran sekolah, pembelajaran mandiri, dan kegiatan edukatif non-komersial lainnya. Anda dilarang keras menjual kembali, mengemas ulang, atau menyalahgunakan API simulasi kami untuk tujuan komersial sepihak tanpa izin tertulis dari Arshaka Team.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                2. Kepemilikan Akun &amp; Privasi Data
              </h2>
              <p className="pl-4">
                Sebagian besar fitur simulasi interaktif kami dapat diakses penuh tanpa perlu mendaftarkan akun (Mode Tamu). Pendaftaran akun (opsional) disarankan bagi Siswa dan Guru untuk menyimpan riwayat eksperimen, badge, tugas, dan pembuatan ruang kelas. Anda bertanggung jawab penuh untuk menjaga keamanan akses kredensial akun OAuth (Google/GitHub) Anda.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                3. Hak Kekayaan Intelektual (HAKI)
              </h2>
              <p className="pl-4">
                Seluruh kode sumber simulasi, aset visual, logo, animasi, dan skema matematika yang diterbitkan di platform ini dilindungi di bawah hak cipta terbuka. Lisensi kode sumber terbuka (open source) tunduk pada lisensi repositori resmi di GitHub Arshaka Edu.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                4. Batasan Tanggung Jawab
              </h2>
              <p className="pl-4">
                Simulasi sains, fisika, kimia, dan matematika yang kami sajikan adalah model pendekatan visual teoritis yang bertujuan mempermudah pemahaman abstrak. Kami berusaha sebaik mungkin menyajikan akurasi data sains, namun kami tidak bertanggung jawab atas kerugian fisik, materiil, atau akademis yang diakibatkan oleh perbedaan nilai teoritis simulasi dengan eksperimen fisik nyata di laboratorium sekolah Anda.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                5. Perubahan Ketentuan Layanan
              </h2>
              <p className="pl-4">
                Kami berhak untuk mengubah, memodifikasi, atau memperbarui Syarat &amp; Ketentuan ini sewaktu-waktu demi peningkatan layanan pendidikan kami. Perubahan akan berlaku segera setelah dipublikasikan di halaman ini.
              </p>
            </div>

          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-zinc-500">
            <span>© 2026 Arshaka Edu • Hak Cipta Dilindungi</span>
            <Link href="/privacy" className="text-indigo-400 hover:text-white transition-colors underline underline-offset-4">Lihat Kebijakan Privasi</Link>
          </div>

        </div>
      </div>
    </div>
  );
}
