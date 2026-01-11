import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicPaths = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/callback', '/pricing', '/termos', '/privacidade'];

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  await supabase.auth.getUser();

  // Permitir acesso a rotas públicas
  if (publicPaths.includes(pathname)) {
    return supabaseResponse;
  }

  // Redirecionar root para login (depois o usuário será redirecionado pelo cliente)
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Permitir acesso a todas as outras rotas (verificação de autenticação será feita no cliente)
  return supabaseResponse;
}

export const config = {
  // Skip API routes (e.g., /api/chat) that don't need Supabase middleware
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/.*|.*\\..*).*)'],
};
