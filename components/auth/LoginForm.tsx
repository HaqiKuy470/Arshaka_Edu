'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

// ─── Google SVG ─────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"/>
      <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"/>
      <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"/>
      <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853"/>
    </svg>
  );
}

// ─── GitHub SVG ─────────────────────────────────────────────────────────────
function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div className="relative flex items-center gap-4 my-2">
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest">atau</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LoginForm({
  googleEnabled,
  githubEnabled,
}: {
  googleEnabled: boolean;
  githubEnabled: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email atau password salah. Coba lagi.');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setOauthLoading(provider);
    await signIn(provider, { callbackUrl });
  };

  const hasOAuth = googleEnabled || githubEnabled;

  return (
    <div className="space-y-5">
      {/* ── OAuth Buttons ── */}
      {hasOAuth && (
        <div className="space-y-3">
          {googleEnabled && (
            <button
              id="btn-login-google"
              onClick={() => handleOAuth('google')}
              disabled={!!oauthLoading}
              className="w-full bg-white text-black font-semibold rounded-xl py-3 px-4 flex items-center justify-center gap-3 hover:bg-zinc-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {oauthLoading === 'google' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Lanjutkan dengan Google
            </button>
          )}

          {githubEnabled && (
            <button
              id="btn-login-github"
              onClick={() => handleOAuth('github')}
              disabled={!!oauthLoading}
              className="w-full bg-[#24292F] text-white font-semibold rounded-xl py-3 px-4 flex items-center justify-center gap-3 hover:bg-black transition-colors border border-white/10 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {oauthLoading === 'github' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <GitHubIcon />
              )}
              Lanjutkan dengan GitHub
            </button>
          )}

          <Divider />
        </div>
      )}

      {/* ── Error Alert ── */}
      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Credentials Form ── */}
      <form id="form-login" onSubmit={handleCredentialsLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="block text-sm font-medium text-zinc-300">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kamu@email.com"
            required
            autoComplete="email"
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="login-password" className="block text-sm font-medium text-zinc-300">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          id="btn-login-submit"
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Memverifikasi...
            </>
          ) : (
            'Masuk ke Akun'
          )}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-400 pt-2">
        Belum punya akun?{' '}
        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
