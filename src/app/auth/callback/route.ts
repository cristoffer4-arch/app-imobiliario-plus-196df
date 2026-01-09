import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { buildAbsoluteUrl, getSiteUrl } from '@/lib/site-url';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const next = requestUrl.searchParams.get('next');
  const plan = requestUrl.searchParams.get('plan');
  const siteUrl = getSiteUrl(requestUrl.origin);
  const buildRedirect = (path: string) => buildAbsoluteUrl(path, siteUrl);

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    const errorUrl = buildRedirect(`/auth/login?error=${encodeURIComponent(error)}`);
    return NextResponse.redirect(errorUrl);
  }

  if (!code) {
    const errorUrl = buildRedirect(`/auth/login?error=missing_code${plan ? `&plan=${encodeURIComponent(plan)}` : ''}`);
    return NextResponse.redirect(errorUrl);
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      const errorUrl = buildRedirect('/auth/login?error=config_error');
      return NextResponse.redirect(errorUrl);
    }

    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
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

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('OAuth callback error:', exchangeError);
      const errorUrl = buildRedirect(`/auth/login?error=oauth_exchange_failed${plan ? `&plan=${encodeURIComponent(plan)}` : ''}`);
      return NextResponse.redirect(errorUrl);
    }

    // Determine redirect URL based on query params
    let redirectUrl: string;
    if (plan) {
      redirectUrl = buildRedirect(`/pricing?plan=${encodeURIComponent(plan)}`);
    } else if (next) {
      redirectUrl = buildRedirect(next);
    } else {
      redirectUrl = buildRedirect('/home');
    }

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error('Unexpected OAuth callback error:', err);
    const errorUrl = buildRedirect(`/auth/login?error=unexpected_error${plan ? `&plan=${encodeURIComponent(plan)}` : ''}`);
    return NextResponse.redirect(errorUrl);
  }
}
