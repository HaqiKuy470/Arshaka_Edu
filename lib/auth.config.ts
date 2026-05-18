/**
 * auth.config.ts — Konfigurasi NextAuth EDGE-SAFE
 * File ini TIDAK boleh mengimport apapun yang bergantung pada Node.js native modules
 * (pg, bcryptjs, drizzle, dll). Hanya digunakan di middleware.ts
 */

import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [], // provider diisi di auth.ts (Node.js only)
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = nextUrl.pathname.startsWith('/dashboard');
      const isAuthRoute =
        nextUrl.pathname.startsWith('/login') ||
        nextUrl.pathname.startsWith('/register');

      if (isProtected && !isLoggedIn) {
        const loginUrl = new URL('/login', nextUrl.origin);
        loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
        return Response.redirect(loginUrl);
      }

      // Jika sudah login, jangan bisa akses /login atau /register
      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl.origin));
      }

      return true;
    },
  },
};
