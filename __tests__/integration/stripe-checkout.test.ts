import { NextRequest } from 'next/server';
import { POST } from '@/app/api/stripe/checkout/route';

// Mock dependencies
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id', email: 'test@example.com' } },
        error: null,
      }),
    },
  })),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('@/lib/stripe', () => ({
  createCheckoutSession: jest.fn().mockResolvedValue({
    id: 'test_session_id',
    url: 'https://checkout.stripe.com/test',
  }),
  PRICING_PLANS: {
    FREE: { id: 'free', price: 0, priceId: null },
    STARTER: { id: 'starter', price: 29, priceId: 'price_starter' },
    PRO: { id: 'pro', price: 79, priceId: 'price_pro' },
  },
}));

describe('Stripe Checkout API', () => {
  it('should create checkout session for valid plan', async () => {
    const request = new NextRequest('http://localhost:3001/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ planId: 'STARTER' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.sessionId).toBe('test_session_id');
    expect(data.url).toBe('https://checkout.stripe.com/test');
  });

  it('should reject free plan checkout', async () => {
    const request = new NextRequest('http://localhost:3001/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ planId: 'FREE' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('gratuito');
  });

  it('should reject invalid plan', async () => {
    const request = new NextRequest('http://localhost:3001/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ planId: 'INVALID' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('inválido');
  });
});
