import Link from 'next/link';
import { ArrowLeft, Shield, Lock, EyeOff } from 'lucide-react';

export const metadata = {
  title: 'Kebijakan Privasi | Arshaka Edu',
  description: 'Kebijakan Privasi dan keamanan data bagi pengguna platform simulasi interaktif edukasi Arshaka Edu.',
};

export default function PrivacyPage() {
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
              <Shield className="w-3.5 h-3.5" />
              Keamanan Data
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              Kebijakan Privasi
            </h1>
            <p className="text-xs text-zinc-500 mt-2 font-bold uppercase tracking-wider">
              Terakhir diperbarui: 19 Mei 2026
            </p>
          </div>

          <div className="prose prose-invert max-w-none text-zinc-400 text-sm leading-relaxed space-y-6 font-medium">
            
            <p>
              Di **Arshaka Edu**, kami berkomitmen penuh untuk menjaga privasi, keamanan, dan kerahasiaan data pribadi seluruh pengguna kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menyimpan, menggunakan, dan melindungi informasi Anda selama mengakses platform laboratorium simulasi sains kami.
            </p>

            <div className="space-y-3">
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                1. Informasi yang Kami Kumpulkan
              </h2>
              <div className="pl-4 space-y-2">
                <p>Kami meminimalkan pengumpulan data demi kenyamanan belajar Anda. Data yang kami kumpulkan meliputi:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>**Informasi Akun (OAuth)**: Jika Anda mendaftar melalui Google atau GitHub, kami menerima informasi dasar berupa nama, alamat email, dan foto profil Anda.</li>
                  <li>**Riwayat Progres Belajar**: Data pencapaian tugas, pengerjaan kuis, skor simulasi, dan perolehan lencana/badge kelas.</li>
                  <li>**Data Analitik Anonim**: Informasi browser, perangkat, dan durasi pengerjaan simulasi untuk peningkatan performa situs.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                2. Penggunaan Data Pengguna
              </h2>
              <div className="pl-4 space-y-2">
                <p>Data pribadi yang dikumpulkan oleh platform kami hanya akan digunakan untuk:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Menyimpan progres pembelajaran pribadi Anda di database.</li>
                  <li>Menyinkronkan ruang kelas digital antara Guru dan Siswa.</li>
                  <li>Mengoptimalkan loading modul simulasi berdasarkan perangkat pengguna.</li>
                  <li>Mendiagnosis kendala teknis atau perbaikan bug sistem.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                3. Penyimpanan &amp; Perlindungan Data
              </h2>
              <p className="pl-4">
                Seluruh data pengguna disimpan secara aman di server basis data terenkripsi PostgreSQL dan dilindungi menggunakan protokol enkripsi standar industri (SSL/TLS). Kami tidak pernah menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga manapun untuk tujuan periklanan atau keuntungan komersial.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                4. Cookies &amp; Keamanan Sesi
              </h2>
              <p className="pl-4">
                Kami menggunakan cookies aman NextAuth secara eksklusif untuk menjaga keadaan login akun Anda. Cookies ini tidak melacak aktivitas web Anda di luar platform Arshaka Edu.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                5. Hak Anda atas Data Pribadi
              </h2>
              <p className="pl-4">
                Anda memiliki hak penuh untuk meminta penghapusan akun atau salinan data eksperimen Anda kapan saja dengan menghubungi kami melalui platform atau mengajukan penghapusan akun secara mandiri melalui pengaturan dasbor profil Anda.
              </p>
            </div>

          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-zinc-500">
            <span>© 2026 Arshaka Edu • Hak Cipta Dilindungi</span>
            <Link href="/terms" className="text-indigo-400 hover:text-white transition-colors underline underline-offset-4">Lihat Syarat &amp; Ketentuan</Link>
          </div>

        </div>
      </div>
    </div>
  );
}
