import Link from "next/link";
import { ArrowLeft, GitBranch } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative py-12 px-4">
      {/* Background blobs */}
      <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-pink-600/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Selamat Datang</h1>
            <p className="text-zinc-400">Masuk ke Arshaka Edu untuk menyimpan progres Anda</p>
          </div>

          <div className="space-y-4">
            <button className="w-full bg-white text-black font-semibold rounded-xl py-3 px-4 flex items-center justify-center gap-3 hover:bg-zinc-200 transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"/>
                <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"/>
                <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"/>
                <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853"/>
              </svg>
              Lanjutkan dengan Google
            </button>
            
            <button className="w-full bg-[#24292F] text-white font-semibold rounded-xl py-3 px-4 flex items-center justify-center gap-3 hover:bg-black transition-colors border border-white/10">
              <GitBranch className="w-5 h-5" />
              Lanjutkan dengan GitHub
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-zinc-400">
            Belum punya akun? <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">Daftar sekarang</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
