// Lazy-loaded components for better performance
import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
  </div>
);

// Lazy load PropertyMap (heavy component with maps)
export const PropertyMapLazy = dynamic(
  () => import('@/components/PropertyMap'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // Disable SSR for map components
  }
);

// Lazy load PropertyMapAdvanced
export const PropertyMapAdvancedLazy = dynamic(
  () => import('@/components/PropertyMapAdvanced'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

// Lazy load ChatInterface (AI features)
export const ChatInterfaceLazy = dynamic(
  () => import('@/components/ChatInterface'),
  {
    loading: () => <LoadingSpinner />,
  }
);

// Lazy load ROI Calculator
export const ROICalculatorLazy = dynamic(
  () => import('@/components/roi-calculator'),
  {
    loading: () => <LoadingSpinner />,
  }
);

// Lazy load Dashboard components
export const DashboardStatsLazy = dynamic(
  () => import('@/components/Dashboard/DashboardStats').then(mod => mod.DashboardStats),
  {
    loading: () => <LoadingSpinner />,
  }
);

export const DashboardChartsLazy = dynamic(
  () => import('@/components/Dashboard/DashboardCharts').then(mod => mod.DashboardCharts),
  {
    loading: () => <LoadingSpinner />,
  }
);

// Lazy load PricingPlans
export const PricingPlansLazy = dynamic(
  () => import('@/components/pricing/PricingPlans'),
  {
    loading: () => <LoadingSpinner />,
  }
);

// Helper function for code splitting
export function lazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: { ssr?: boolean }
) {
  return dynamic(importFn, {
    loading: () => <LoadingSpinner />,
    ssr: options?.ssr ?? true,
  });
}
