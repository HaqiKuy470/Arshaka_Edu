import { BookOpen } from "lucide-react";
import { LegalPage } from "@/components/LegalPage";

export const metadata = {
  title: "Syarat & Ketentuan | Arshaka Edu",
  description: "Syarat dan Ketentuan penggunaan platform simulasi interaktif edukasi Arshaka Edu.",
};

const sections = [
  {
    title: "1. Penggunaan Platform & Lisensi Layanan",
    content: (
      <p>
        Platform simulasi pembelajaran ini disediakan <strong className="text-white">100% gratis</strong> untuk
        tujuan akademis, pengajaran sekolah, pembelajaran mandiri, dan kegiatan edukatif
        non-komersial lainnya. Anda dilarang keras menjual kembali, mengemas ulang, atau
        menyalahgunakan API simulasi kami untuk tujuan komersial sepihak tanpa izin tertulis
        dari Arshaka Team.
      </p>
    ),
  },
  {
    title: "2. Kepemilikan Akun & Privasi Data",
    content: (
      <p>
        Sebagian besar fitur simulasi dapat diakses tanpa mendaftarkan akun (Mode Tamu).
        Pendaftaran akun (opsional) disarankan bagi Siswa dan Guru untuk menyimpan riwayat
        eksperimen, badge, tugas, dan kelas. Anda bertanggung jawab penuh atas keamanan
        kredensial OAuth (Google/GitHub) Anda.
      </p>
    ),
  },
  {
    title: "3. Hak Kekayaan Intelektual (HAKI)",
    content: (
      <p>
        Seluruh kode sumber simulasi, aset visual, logo, animasi, dan skema matematika
        yang diterbitkan di platform ini dilindungi hak cipta terbuka. Lisensi kode sumber
        terbuka (open source) tunduk pada lisensi repositori resmi di GitHub Arshaka Edu.
      </p>
    ),
  },
  {
    title: "4. Batasan Tanggung Jawab",
    content: (
      <p>
        Simulasi sains yang kami sajikan adalah model pendekatan visual teoritis untuk
        mempermudah pemahaman abstrak. Kami berusaha menyajikan akurasi data terbaik, namun
        tidak bertanggung jawab atas kerugian yang diakibatkan oleh perbedaan nilai teoritis
        simulasi dengan eksperimen fisik nyata di laboratorium sekolah.
      </p>
    ),
  },
  {
    title: "5. Perubahan Ketentuan Layanan",
    content: (
      <p>
        Kami berhak mengubah, memodifikasi, atau memperbarui Syarat &amp; Ketentuan ini
        sewaktu-waktu. Perubahan akan berlaku segera setelah dipublikasikan di halaman ini.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      badge={<BookOpen className="w-3 h-3" />}
      badgeLabel="Legalitas Platform"
      title="Syarat & Ketentuan Penggunaan"
      updated="19 Mei 2026"
      intro={
        <>
          Selamat datang di <strong className="text-white">Arshaka Edu</strong>. Platform ini
          dikembangkan sebagai sarana pembelajaran interaktif nirlaba yang gratis dan dapat
          diakses oleh semua kalangan. Dengan mengakses atau menggunakan platform kami, Anda
          menyetujui untuk terikat secara hukum oleh syarat dan ketentuan penggunaan di bawah ini.
        </>
      }
      sections={sections}
      footerLink={{ href: "/privacy", label: "Lihat Kebijakan Privasi" }}
    />
  );
}