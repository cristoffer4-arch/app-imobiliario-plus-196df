import { useUserSubscription, useSubscriptionUsage } from '@/hooks/use-subscriptions';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
        error: null,
      }),
    },
    from: jest.fn((table: string) => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: {
              id: '1',
              user_id: 'test-user-id',
              plan_id: 'pro',
              status: 'active',
            },
            error: null,
          }),
        })),
      })),
    })),
  })),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Subscription Hooks', () => {
  describe('useUserSubscription', () => {
    it('should fetch user subscription', async () => {
      const { result } = renderHook(() => useUserSubscription(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.plan_id).toBe('pro');
    });

    it('should handle loading state', () => {
      const { result } = renderHook(() => useUserSubscription(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBeDefined();
    });
  });

  describe('useSubscriptionUsage', () => {
    it('should fetch subscription usage', async () => {
      const { result } = renderHook(() => useSubscriptionUsage(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
    });
  });
});
