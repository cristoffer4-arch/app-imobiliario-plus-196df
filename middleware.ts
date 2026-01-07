import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicPaths = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/callback', '/pricing', '/termos', '/privacidade'];

  // Permitir acesso a rotas públicas
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Redirecionar root para login (depois o usuário será redirecionado pelo cliente)
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Permitir acesso a todas as outras rotas (verificação de autenticação será feita no cliente)
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
