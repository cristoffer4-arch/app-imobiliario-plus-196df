import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicPaths = ['/', '/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/callback'];

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // TODO: Implement real session check with Supabase; allow all for now to avoid redirect loops
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
