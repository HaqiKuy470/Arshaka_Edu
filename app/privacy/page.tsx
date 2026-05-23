import { Shield } from "lucide-react";
import { LegalPage } from "@/components/LegalPage";

export const metadata = {
  title: "Kebijakan Privasi | Arshaka Edu",
  description: "Kebijakan Privasi dan keamanan data bagi pengguna platform simulasi interaktif edukasi Arshaka Edu.",
};

const sections = [
  {
    title: "1. Informasi yang Kami Kumpulkan",
    content: (
      <>
        <p>Kami meminimalkan pengumpulan data demi kenyamanan belajar Anda. Data yang dikumpulkan meliputi:</p>
        <ul className="list-disc pl-4 mt-2 space-y-1.5">
          <li>
            <strong className="text-zinc-300">Informasi Akun (OAuth):</strong> Jika Anda mendaftar
            melalui Google atau GitHub, kami menerima nama, alamat email, dan foto profil.
          </li>
          <li>
            <strong className="text-zinc-300">Riwayat Progres Belajar:</strong> Data pencapaian tugas,
            skor simulasi, dan perolehan lencana/badge kelas.
          </li>
          <li>
            <strong className="text-zinc-300">Data Analitik Anonim:</strong> Informasi browser,
            perangkat, dan durasi pengerjaan simulasi untuk peningkatan performa situs.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "2. Penggunaan Data Pengguna",
    content: (
      <>
        <p>Data pribadi yang dikumpulkan hanya akan digunakan untuk:</p>
        <ul className="list-disc pl-4 mt-2 space-y-1.5">
          <li>Menyimpan progres pembelajaran pribadi Anda di database.</li>
          <li>Menyinkronkan ruang kelas digital antara Guru dan Siswa.</li>
          <li>Mengoptimalkan loading modul simulasi berdasarkan perangkat pengguna.</li>
          <li>Mendiagnosis kendala teknis atau perbaikan bug sistem.</li>
        </ul>
      </>
    ),
  },
  {
    title: "3. Penyimpanan & Perlindungan Data",
    content: (
      <p>
        Seluruh data pengguna disimpan secara aman di server basis data terenkripsi PostgreSQL
        dan dilindungi menggunakan protokol enkripsi standar industri (SSL/TLS). Kami tidak
        pernah menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga
        manapun untuk tujuan periklanan atau keuntungan komersial.
      </p>
    ),
  },
  {
    title: "4. Cookies & Keamanan Sesi",
    content: (
      <p>
        Kami menggunakan cookies aman NextAuth secara eksklusif untuk menjaga keadaan login
        akun Anda. Cookies ini tidak melacak aktivitas web Anda di luar platform Arshaka Edu.
      </p>
    ),
  },
  {
    title: "5. Hak Anda atas Data Pribadi",
    content: (
      <p>
        Anda memiliki hak penuh untuk meminta penghapusan akun atau salinan data eksperimen
        Anda kapan saja dengan menghubungi kami melalui platform atau melalui pengaturan
        dasbor profil Anda.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      badge={<Shield className="w-3 h-3" />}
      badgeLabel="Keamanan Data"
      title="Kebijakan Privasi"
      updated="19 Mei 2026"
      intro={
        <>
          Di <strong className="text-white">Arshaka Edu</strong>, kami berkomitmen penuh untuk
          menjaga privasi, keamanan, dan kerahasiaan data pribadi seluruh pengguna. Kebijakan
          Privasi ini menjelaskan bagaimana kami mengumpulkan, menyimpan, menggunakan, dan
          melindungi informasi Anda selama mengakses platform laboratorium simulasi sains kami.
        </>
      }
      sections={sections}
      footerLink={{ href: "/terms", label: "Lihat Syarat & Ketentuan" }}
    />
  );
}