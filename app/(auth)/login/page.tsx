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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)]">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8 1.402 1.402c1 1 .03 2.798-1.414 2.798H4.212c-1.444 0-2.414-1.798-1.414-2.798L4.2 15.3" />
              </svg>
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
