import { PRICING_PLANS, PlanId } from '@/lib/stripe';

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          id: 'test_session_id',
          url: 'https://checkout.stripe.com/test',
        }),
      },
    },
    billingPortal: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          url: 'https://billing.stripe.com/test',
        }),
      },
    },
    subscriptions: {
      retrieve: jest.fn().mockResolvedValue({
        id: 'sub_test',
        status: 'active',
      }),
      cancel: jest.fn().mockResolvedValue({
        id: 'sub_test',
        status: 'canceled',
      }),
    },
  }));
});

describe('Stripe Integration', () => {
  describe('PRICING_PLANS', () => {
    it('should have all required plans', () => {
      expect(PRICING_PLANS.FREE).toBeDefined();
      expect(PRICING_PLANS.STARTER).toBeDefined();
      expect(PRICING_PLANS.PRO).toBeDefined();
      expect(PRICING_PLANS.PREMIUM).toBeDefined();
      expect(PRICING_PLANS.ENTERPRISE).toBeDefined();
    });

    it('should have correct pricing structure', () => {
      expect(PRICING_PLANS.FREE.price).toBe(0);
      expect(PRICING_PLANS.STARTER.price).toBe(29);
      expect(PRICING_PLANS.PRO.price).toBe(79);
      expect(PRICING_PLANS.PREMIUM.price).toBe(149);
      expect(PRICING_PLANS.ENTERPRISE.price).toBe(497);
    });

    it('should mark PRO as popular', () => {
      expect(PRICING_PLANS.PRO.popular).toBe(true);
    });

    it('should have features for each plan', () => {
      Object.values(PRICING_PLANS).forEach((plan) => {
        expect(Array.isArray(plan.features)).toBe(true);
        expect(plan.features.length).toBeGreaterThan(0);
      });
    });

    it('should have limits for each plan', () => {
      Object.values(PRICING_PLANS).forEach((plan) => {
        expect(plan.limits).toBeDefined();
        expect(plan.limits.savedProperties).toBeDefined();
        expect(plan.limits.comparisons).toBeDefined();
        expect(plan.limits.aiRequests).toBeDefined();
        expect(plan.limits.savedAreas).toBeDefined();
      });
    });

    it('should have unlimited limits (-1) for premium plans', () => {
      expect(PRICING_PLANS.PREMIUM.limits.savedProperties).toBe(-1);
      expect(PRICING_PLANS.PREMIUM.limits.comparisons).toBe(-1);
      expect(PRICING_PLANS.PREMIUM.limits.aiRequests).toBe(-1);
      
      expect(PRICING_PLANS.ENTERPRISE.limits.savedProperties).toBe(-1);
      expect(PRICING_PLANS.ENTERPRISE.limits.comparisons).toBe(-1);
    });
  });

  describe('createCheckoutSession', () => {
    it('should create a checkout session for valid plan', async () => {
      const { createCheckoutSession } = await import('@/lib/stripe');
      
      const session = await createCheckoutSession(
        'user_123',
        'PRO',
        'https://example.com/success',
        'https://example.com/cancel'
      );

      expect(session).toBeDefined();
      expect(session.id).toBe('test_session_id');
      expect(session.url).toBe('https://checkout.stripe.com/test');
    });

    it('should throw error for free plan', async () => {
      const { createCheckoutSession } = await import('@/lib/stripe');
      
      await expect(
        createCheckoutSession(
          'user_123',
          'FREE',
          'https://example.com/success',
          'https://example.com/cancel'
        )
      ).rejects.toThrow('Invalid plan selected');
    });
  });

  describe('createBillingPortalSession', () => {
    it('should create a billing portal session', async () => {
      const { createBillingPortalSession } = await import('@/lib/stripe');
      
      const session = await createBillingPortalSession(
        'cus_123',
        'https://example.com/return'
      );

      expect(session).toBeDefined();
      expect(session.url).toBe('https://billing.stripe.com/test');
    });
  });
});
