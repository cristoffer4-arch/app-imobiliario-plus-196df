import Stripe from 'stripe';

// Initialize Stripe only if key is available
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
    typescript: true,
  });
}

export { stripe };

// Pricing plans based on PRICING-STRATEGY-OPTIMIZED.md
export const PRICING_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Pesquisa básica de propriedades',
      'Visualização de mapas',
      'Até 5 propriedades salvas',
      'Suporte por email',
    ],
    limits: {
      savedProperties: 5,
      comparisons: 0,
      aiRequests: 0,
      savedAreas: 0,
    },
  },
  STARTER: {
    id: 'starter',
    name: 'Starter',
    price: 29,
    priceId: process.env.STRIPE_PRICE_STARTER,
    features: [
      'Até 2 comparações de imóveis',
      'Até 50 propriedades salvas',
      '10 consultas IA/dia',
      'Alertas por email',
      'Mapas interativos básicos',
      'Análise de ROI básica',
      'Suporte prioritário',
    ],
    limits: {
      savedProperties: 50,
      comparisons: 2,
      aiRequests: 10,
      savedAreas: 2,
    },
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 79,
    priceId: process.env.STRIPE_PRICE_PRO,
    popular: true,
    features: [
      'Até 4 comparações de imóveis',
      'Propriedades ilimitadas',
      '50 consultas IA/dia',
      'Alertas em tempo real',
      'Mapas avançados com heatmap',
      'Análise completa de ROI',
      'Dashboard de investimentos',
      'Exportação de dados',
      'Suporte prioritário 24/7',
    ],
    limits: {
      savedProperties: -1, // unlimited
      comparisons: 4,
      aiRequests: 50,
      savedAreas: 10,
    },
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 149,
    priceId: process.env.STRIPE_PRICE_PREMIUM,
    features: [
      'Comparações ilimitadas',
      'Consultas IA ilimitadas',
      'API access completo',
      'Relatórios personalizados',
      'Análise preditiva de mercado',
      'Integração CRM',
      'Múltiplos usuários (até 5)',
      'Suporte dedicado 24/7',
      'Consultoria mensal',
    ],
    limits: {
      savedProperties: -1,
      comparisons: -1,
      aiRequests: -1,
      savedAreas: -1,
    },
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 497,
    priceId: process.env.STRIPE_PRICE_ENTERPRISE,
    features: [
      'Tudo do Premium',
      'White-label',
      'Usuários ilimitados',
      'SLA garantido',
      'Infraestrutura dedicada',
      'Gerente de conta dedicado',
      'Treinamento personalizado',
      'Customização sob demanda',
    ],
    limits: {
      savedProperties: -1,
      comparisons: -1,
      aiRequests: -1,
      savedAreas: -1,
    },
  },
} as const;

export type PlanId = keyof typeof PRICING_PLANS;

export async function createCheckoutSession(
  userId: string,
  planId: PlanId,
  successUrl: string,
  cancelUrl: string
) {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }
  
  const plan = PRICING_PLANS[planId];
  
  if (!plan.priceId) {
    throw new Error('Invalid plan selected');
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: undefined, // Will be filled from user metadata
    client_reference_id: userId,
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price: plan.priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      planId,
    },
  });

  return session;
}

export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
) {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }
  
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

export async function getSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }
  return await stripe.subscriptions.retrieve(subscriptionId);
}

export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }
  return await stripe.subscriptions.cancel(subscriptionId);
}
