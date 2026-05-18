'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
      <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"/>
      <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"/>
      <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"/>
      <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}

export default function OAuthButtons({ callbackUrl = '/dashboard' }: { callbackUrl?: string }) {
  const [loading, setLoading] = useState<'google' | 'github' | null>(null);

  const handleSignIn = async (provider: 'google' | 'github') => {
    setLoading(provider);
    // signIn akan redirect, jadi tidak perlu setLoading(null)
    await signIn(provider, { callbackUrl });
  };

  return (
    <div className="space-y-3">
      {/* Google */}
      <button
        id="btn-login-google"
        onClick={() => handleSignIn('google')}
        disabled={!!loading}
        className="w-full flex items-center gap-4 px-5 py-4 bg-white text-gray-800 font-semibold rounded-xl hover:bg-zinc-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed group"
      >
        {loading === 'google' ? (
          <Loader2 className="w-5 h-5 animate-spin text-gray-500 shrink-0" />
        ) : (
          <GoogleIcon />
        )}
        <span className="flex-1 text-left text-sm">
          {loading === 'google' ? 'Menghubungkan...' : 'Lanjutkan dengan Google'}
        </span>
        <span className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">→</span>
      </button>

      {/* GitHub */}
      <button
        id="btn-login-github"
        onClick={() => handleSignIn('github')}
        disabled={!!loading}
        className="w-full flex items-center gap-4 px-5 py-4 bg-[#1c2128] text-white font-semibold rounded-xl hover:bg-[#24292f] border border-white/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed group"
      >
        {loading === 'github' ? (
          <Loader2 className="w-5 h-5 animate-spin text-zinc-400 shrink-0" />
        ) : (
          <GitHubIcon />
        )}
        <span className="flex-1 text-left text-sm">
          {loading === 'github' ? 'Menghubungkan...' : 'Lanjutkan dengan GitHub'}
        </span>
        <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">→</span>
      </button>

      {/* Info */}
      <div className="flex items-center gap-3 mt-2 px-1">
        <div className="flex-1 h-px bg-white/5" />
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold whitespace-nowrap">
          Login Aman & Gratis
        </p>
        <div className="flex-1 h-px bg-white/5" />
      </div>
    </div>
  );
}
