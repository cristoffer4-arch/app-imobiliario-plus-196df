import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';

const supabase = createClient();

// Hook for fetching user subscription
export function useUserSubscription() {
  return useQuery({
    queryKey: ['user-subscription'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*, subscription_plans(*)')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching subscription usage
export function useSubscriptionUsage() {
  return useQuery({
    queryKey: ['subscription-usage'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const monthYear = new Date().toISOString().slice(0, 7); // YYYY-MM

      const { data, error } = await supabase
        .from('subscription_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('month_year', monthYear)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" error
      return data || {
        saved_properties: 0,
        comparisons: 0,
        ai_requests: 0,
        saved_areas: 0,
      };
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Hook for fetching payment history
export function usePaymentHistory() {
  return useQuery({
    queryKey: ['payment-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('payment_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching properties with caching
export function useProperties(filters?: any) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value));
        });
      }

      const response = await fetch(`/api/properties?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Mutation for creating checkout session
export function useCreateCheckout() {
  return useMutation({
    mutationFn: async (planId: string) => {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout');
      }

      return response.json();
    },
  });
}

// Mutation for incrementing usage
export function useIncrementUsage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ counter, increment = 1 }: { counter: string; increment?: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('increment_usage', {
        user_uuid: user.id,
        counter_name: counter,
        increment_by: increment,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate usage query to refetch
      queryClient.invalidateQueries({ queryKey: ['subscription-usage'] });
    },
  });
}
