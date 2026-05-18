import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import OAuthButtons from '@/components/auth/OAuthButtons';

export const metadata = {
  title: 'Masuk | Arshaka Edu',
  description: 'Masuk ke akun Arshaka Edu kamu untuk menyimpan progres belajar.',
};

export default function LoginPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative py-12 px-4">
      {/* Background blobs */}
      <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-pink-600/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.25)] overflow-hidden">
              <img src="/logo.png" alt="Arshaka Edu Logo" className="w-full h-full object-contain p-2" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Selamat Datang di Arshaka Edu</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Masuk untuk menyimpan progres belajar, koleksi badge, dan riwayat simulasimu
            </p>
          </div>

          <OAuthButtons callbackUrl="/dashboard" />

          <div className="mt-8 text-center">
            <p className="text-xs text-zinc-600 leading-relaxed">
              Dengan masuk, kamu menyetujui{' '}
              <Link href="/terms" className="text-zinc-400 hover:text-white transition-colors underline underline-offset-2">
                Syarat & Ketentuan
              </Link>{' '}
              dan{' '}
              <Link href="/privacy" className="text-zinc-400 hover:text-white transition-colors underline underline-offset-2">
                Kebijakan Privasi
              </Link>{' '}
              Arshaka Edu.
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Belum familiar? Coba dulu{' '}
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
            simulasi tanpa login →
          </Link>
        </p>
      </div>
    </div>
  );
}
