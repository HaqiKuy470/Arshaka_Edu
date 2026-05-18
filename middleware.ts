import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Route yang membutuhkan login
const PROTECTED = ['/dashboard', '/admin'];
// Route yang hanya untuk tamu (redirect ke dashboard jika sudah login)
const AUTH_ROUTES = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    // Sesuaikan dengan cookie name NextAuth v5 (secure prefix jika HTTPS)
    cookieName:
      request.nextUrl.protocol === 'https:'
        ? '__Secure-authjs.session-token'
        : 'authjs.session-token',
  });

  const isLoggedIn = !!token || request.cookies.has('authjs.session-token') || request.cookies.has('__Secure-authjs.session-token');
  const isProtected = PROTECTED.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  if (isProtected && !isLoggedIn) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.webp|logo\\.png).*)',
  ],
};
