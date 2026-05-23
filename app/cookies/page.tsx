import { Cookie } from "lucide-react";
import { LegalPage } from "@/components/LegalPage";

export const metadata = {
  title: "Kebijakan Cookie | Arshaka Edu",
  description: "Kebijakan penggunaan cookies pada platform simulasi interaktif edukasi Arshaka Edu.",
};

const sections = [
  {
    title: "1. Apa Itu Cookie?",
    content: (
      <p>
        Cookie adalah file teks kecil yang disimpan di perangkat Anda (komputer, tablet, atau
        ponsel) ketika Anda mengunjungi sebuah situs web. Cookie membantu situs web mengingat
        preferensi Anda, menjaga sesi login tetap aktif, dan meningkatkan pengalaman
        penggunaan secara keseluruhan.
      </p>
    ),
  },
  {
    title: "2. Cookie yang Kami Gunakan",
    content: (
      <>
        <p>Arshaka Edu hanya menggunakan cookie yang benar-benar diperlukan, yaitu:</p>
        <ul className="list-disc pl-4 mt-2 space-y-2">
          <li>
            <strong className="text-zinc-300">Cookie Sesi (Session Cookie):</strong> Digunakan
            oleh NextAuth untuk menjaga status login akun Anda. Cookie ini bersifat sementara
            dan otomatis terhapus saat Anda menutup browser.
          </li>
          <li>
            <strong className="text-zinc-300">Cookie Preferensi:</strong> Menyimpan pilihan
            tampilan seperti tema gelap/terang agar tidak perlu diatur ulang setiap kali Anda
            kembali ke platform.
          </li>
          <li>
            <strong className="text-zinc-300">Cookie Analitik Anonim:</strong> Mengumpulkan data
            agregat tentang halaman yang dikunjungi dan durasi sesi untuk membantu kami
            memperbaiki performa platform. Tidak ada informasi pribadi yang disimpan.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "3. Cookie yang Tidak Kami Gunakan",
    content: (
      <>
        <p>Kami secara tegas <strong className="text-white">tidak</strong> menggunakan:</p>
        <ul className="list-disc pl-4 mt-2 space-y-1.5">
          <li>Cookie pelacak iklan (advertising/tracking cookies) dari pihak ketiga.</li>
          <li>Cookie lintas situs (cross-site tracking) untuk membuat profil perilaku Anda.</li>
          <li>Cookie dari jaringan iklan seperti Google Ads, Meta Pixel, atau sejenisnya.</li>
        </ul>
        <p className="mt-3">
          Platform Arshaka Edu sepenuhnya bebas iklan dan tidak pernah memonetisasi data
          pengguna untuk kepentingan komersial.
        </p>
      </>
    ),
  },
  {
    title: "4. Mengontrol Cookie",
    content: (
      <>
        <p>
          Anda dapat mengatur atau menonaktifkan cookie melalui pengaturan browser Anda kapan
          saja. Berikut cara mengaksesnya pada browser umum:
        </p>
        <ul className="list-disc pl-4 mt-2 space-y-1.5">
          <li><strong className="text-zinc-300">Chrome:</strong> Setelan → Privasi & Keamanan → Cookie.</li>
          <li><strong className="text-zinc-300">Firefox:</strong> Preferensi → Privasi & Keamanan → Cookie.</li>
          <li><strong className="text-zinc-300">Safari:</strong> Preferensi → Privasi → Kelola Data Situs.</li>
          <li><strong className="text-zinc-300">Edge:</strong> Setelan → Cookie & Izin Situs.</li>
        </ul>
        <p className="mt-3 text-zinc-500 text-xs">
          Perlu diketahui: menonaktifkan cookie sesi dapat memengaruhi fungsi login dan
          penyimpanan progres belajar Anda.
        </p>
      </>
    ),
  },
  {
    title: "5. Pembaruan Kebijakan Cookie",
    content: (
      <p>
        Kami dapat memperbarui Kebijakan Cookie ini sewaktu-waktu seiring perkembangan
        platform. Setiap perubahan akan dipublikasikan di halaman ini dengan tanggal
        pembaruan terbaru.
      </p>
    ),
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalPage
      badge={<Cookie className="w-3 h-3" />}
      badgeLabel="Cookie & Pelacakan"
      title="Kebijakan Cookie"
      updated="23 Mei 2026"
      intro={
        <>
          Di <strong className="text-white">Arshaka Edu</strong>, kami percaya pada transparansi
          penuh tentang bagaimana platform kami bekerja. Halaman ini menjelaskan jenis cookie
          yang kami gunakan, tujuan penggunaannya, dan bagaimana Anda dapat mengontrolnya.
        </>
      }
      sections={sections}
      footerLink={{ href: "/privacy", label: "Lihat Kebijakan Privasi" }}
    />
  );
}