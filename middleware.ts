import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicPaths = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/callback'];
  const hasSession = request.cookies.has('sb-access-token');

  if (pathname === '/') {
    const target = hasSession ? '/dashboard' : '/auth/login';
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  if (!hasSession) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
