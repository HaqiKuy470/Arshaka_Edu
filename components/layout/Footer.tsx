import Link from "next/link";
import { Atom } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 glass mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg">
                <Atom className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">
                Arshaka<span className="text-indigo-400">Edu</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Platform simulasi pembelajaran interaktif berbasis web, gratis, dan dapat diakses oleh semua kalangan — dari SD hingga Perguruan Tinggi.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Mata Pelajaran</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/simulasi" className="hover:text-white transition-colors">Fisika</Link></li>
              <li><Link href="/simulasi" className="hover:text-white transition-colors">Kimia</Link></li>
              <li><Link href="/simulasi" className="hover:text-white transition-colors">Matematika</Link></li>
              <li><Link href="/simulasi" className="hover:text-white transition-colors">Biologi</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/tentang" className="hover:text-white transition-colors">Tentang Kami</Link></li>
              <li><Link href="/untuk-guru" className="hover:text-white transition-colors">Untuk Guru</Link></li>
              <li><Link href="/untuk-sekolah" className="hover:text-white transition-colors">Untuk Sekolah</Link></li>
              <li><Link href="/donasi" className="hover:text-white transition-colors">Dukung Kami</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Bantuan</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/panduan" className="hover:text-white transition-colors">Panduan Penggunaan</Link></li>
              <li><Link href="/kontak" className="hover:text-white transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} Arshaka Edu. Platform Edukasi Terbuka.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privasi" className="hover:text-zinc-300">Privasi</Link>
            <Link href="/syarat" className="hover:text-zinc-300">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
