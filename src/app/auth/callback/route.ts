import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const plan = requestUrl.searchParams.get('plan');

  if (!code) {
    const errorUrl = `${requestUrl.origin}/auth/login?error=missing_code${plan ? `&plan=${encodeURIComponent(plan)}` : ''}`;
    return NextResponse.redirect(errorUrl);
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('OAuth callback error:', error);
      const errorUrl = `${requestUrl.origin}/auth/login?error=oauth_exchange_failed${plan ? `&plan=${encodeURIComponent(plan)}` : ''}`;
      return NextResponse.redirect(errorUrl);
    }

    const redirectUrl = plan
      ? `${requestUrl.origin}/pricing?plan=${encodeURIComponent(plan)}`
      : `${requestUrl.origin}/imoveis`;

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error('Unexpected OAuth callback error:', err);
    const errorUrl = `${requestUrl.origin}/auth/login?error=unexpected_error${plan ? `&plan=${encodeURIComponent(plan)}` : ''}`;
    return NextResponse.redirect(errorUrl);
  }
}
