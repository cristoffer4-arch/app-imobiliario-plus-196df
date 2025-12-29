import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createCheckoutSession, PRICING_PLANS, PlanId } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId } = body;

    // Validate plan
    if (!planId || !PRICING_PLANS[planId as PlanId]) {
      return NextResponse.json(
        { error: 'Plano inválido' },
        { status: 400 }
      );
    }

    // Can't checkout for free plan
    if (planId === 'FREE') {
      return NextResponse.json(
        { error: 'Plano gratuito não requer checkout' },
        { status: 400 }
      );
    }

    // Create checkout session
    const baseUrl = request.headers.get('origin') || 'http://localhost:3001';
    const session = await createCheckoutSession(
      user.id,
      planId as PlanId,
      `${baseUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      `${baseUrl}/pricing/cancel`
    );

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao criar sessão de checkout' },
      { status: 500 }
    );
  }
}
