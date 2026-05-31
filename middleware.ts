import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const CANONICAL_HOST = 'edu.heyhaqi.my.id';

// Route yang membutuhkan login
const PROTECTED = ['/dashboard', '/admin'];
// Route yang hanya untuk tamu (redirect ke dashboard jika sudah login)
const AUTH_ROUTES = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';

  if (host && host !== CANONICAL_HOST) {
    const url = new URL(request.url);
    url.protocol = 'https:';
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 301);
  }

  const proto = request.headers.get('x-forwarded-proto') || (request.nextUrl.protocol === 'https:' ? 'https' : 'http');
  const isHttps = proto === 'https';

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    // Sesuaikan dengan cookie name NextAuth v5 (secure prefix jika HTTPS)
    cookieName: isHttps ? '__Secure-authjs.session-token' : 'authjs.session-token',
  });

  const isLoggedIn = !!token;
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
