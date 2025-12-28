import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        // Redirect to home with error
        return NextResponse.redirect(`${requestUrl.origin}/?error=auth_failed`);
      }
      
      if (data?.session) {
        console.log('Session created successfully for user:', data.session.user.email);
        // Successful authentication - redirect to dashboard
        return NextResponse.redirect(`${requestUrl.origin}/imoveis`);
      }
    } catch (err) {
      console.error('Unexpected error during OAuth callback:', err);
      return NextResponse.redirect(`${requestUrl.origin}/?error=unexpected`);
    }
  }

  // No code provided or session creation failed
  return NextResponse.redirect(requestUrl.origin);
}
