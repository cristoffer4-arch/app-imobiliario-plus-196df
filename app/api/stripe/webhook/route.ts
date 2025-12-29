import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Supabase client with service role for webhook operations
let supabaseAdmin: any = null;

if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    if (!stripe || !supabaseAdmin) {
      return NextResponse.json(
        { error: 'Stripe or Supabase not configured' },
        { status: 503 }
      );
    }
    
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Assinatura do webhook ausente' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro no webhook' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;

  if (!userId || !planId) {
    console.error('Missing metadata in checkout session');
    return;
  }

  // Create or update subscription
  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      plan_id: planId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      status: 'active',
      current_period_start: new Date(session.created * 1000).toISOString(),
      current_period_end: session.expires_at 
        ? new Date(session.expires_at * 1000).toISOString() 
        : null,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error creating subscription:', error);
  }

  // Record payment
  await supabaseAdmin.from('payment_history').insert({
    user_id: userId,
    stripe_payment_intent_id: session.payment_intent as string,
    amount: (session.amount_total || 0) / 100,
    currency: session.currency || 'eur',
    status: 'succeeded',
    description: `Subscription to ${planId} plan`,
    metadata: { sessionId: session.id },
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error updating subscription:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error deleting subscription:', error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Record successful payment
  const { data: subscription } = await supabaseAdmin
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', invoice.subscription)
    .single();

  if (subscription) {
    await supabaseAdmin.from('payment_history').insert({
      user_id: subscription.user_id,
      stripe_payment_intent_id: invoice.payment_intent as string,
      amount: (invoice.amount_paid || 0) / 100,
      currency: invoice.currency || 'eur',
      status: 'succeeded',
      description: 'Subscription payment',
      metadata: { invoiceId: invoice.id },
    });
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const { data: subscription } = await supabaseAdmin
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', invoice.subscription)
    .single();

  if (subscription) {
    await supabaseAdmin.from('payment_history').insert({
      user_id: subscription.user_id,
      stripe_payment_intent_id: invoice.payment_intent as string,
      amount: (invoice.amount_due || 0) / 100,
      currency: invoice.currency || 'eur',
      status: 'failed',
      description: 'Payment failed',
      metadata: { invoiceId: invoice.id },
    });
  }
}
