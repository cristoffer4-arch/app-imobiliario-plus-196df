import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { buildAbsoluteUrl, getSiteUrl } from '@/lib/site-url';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const plan = requestUrl.searchParams.get('plan');
  const siteUrl = getSiteUrl(requestUrl.origin);
  const buildRedirect = (path: string) => buildAbsoluteUrl(path, siteUrl);

  if (!code) {
    const errorUrl = buildRedirect(`/auth/login?error=missing_code${plan ? `&plan=${encodeURIComponent(plan)}` : ''}`);
    return NextResponse.redirect(errorUrl);
  }

  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('OAuth callback error:', error);
      const errorUrl = buildRedirect(`/auth/login?error=oauth_exchange_failed${plan ? `&plan=${encodeURIComponent(plan)}` : ''}`);
      return NextResponse.redirect(errorUrl);
    }

    const redirectUrl = plan
      ? buildRedirect(`/pricing?plan=${encodeURIComponent(plan)}`)
      : buildRedirect('/imoveis');

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error('Unexpected OAuth callback error:', err);
    const errorUrl = buildRedirect(`/auth/login?error=unexpected_error${plan ? `&plan=${encodeURIComponent(plan)}` : ''}`);
    return NextResponse.redirect(errorUrl);
  }
}
