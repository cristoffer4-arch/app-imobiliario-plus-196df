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
        return NextResponse.redirect(`https://app-imobiliario-plus.netlify.app/?error=auth_failed`);
      }

      if (data?.session) {
              
      // Get selected plan from URL params
      const plan = requestUrl.searchParams.get('plan') || 'professional';
      
      // Store the selected plan in user metadata or profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: data.session.user.id,
          subscription_tier: plan,
          email: data.session.user.email,
          updated_at: new Date().toISOString()
        });

      if (updateError) {
        console.error('Error updating profile with plan:', updateError);
      }
        console.log('Session created successfully for user:', data.session.user.email);
        // Successful authentication - redirect to dashboard
        return NextResponse.redirect(`https://app-imobiliario-plus.netlify.app/imoveis`);
      }
    } catch (err) {
      console.error('Unexpected error during OAuth callback:', err);
      return NextResponse.redirect(`https://app-imobiliario-plus.netlify.app/?error=unexpected`);
    }
  }

  // No code provided or session creation failed
  return NextResponse.redirect('https://app-imobiliario-plus.netlify.app');
}
